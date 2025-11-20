using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.AIRepositories;

namespace WS.Service.WSServices
{
    public class AnalysisRequestService
    {
        private readonly AnalysisRequestRepository _repository;

        public AnalysisRequestService(AnalysisRequestRepository repository)
        {
            _repository = repository;
        }

        public async Task<AnalysisRequest> Create(AnalysisRequestCreateDto request)
        {
            var query = await _repository.Create("sp_analysis_requests_create", request);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0 ? Map(query[0].Rows[0]) : null;
        }

        public async Task<AnalysisRequest> Execute(Guid submissionFileId, string analysisType)
        {
            var create = new AnalysisRequestCreateDto
            {
                SubmissionFileId = submissionFileId,
                FilePath = $"/files/{submissionFileId}", // placeholder
                AnalysisType = analysisType
            };
            return await Create(create);
        }

        public async Task<List<AnalysisRequest>> GetByStatus(string status)
        {
            var list = new List<AnalysisRequest>();
            var query = await _repository.GetByStatus("sp_analysis_requests_get_by_status", status);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows) list.Add(Map(row));
            }
            return list;
        }

        public async Task<List<AnalysisRequest>> GetByFile(Guid submissionFileId)
        {
            var sql = $@"SELECT * FROM analysis_requests WHERE submission_file_id = '{submissionFileId}' ORDER BY requested_at";
            return await QueryList(sql);
        }

        public async Task<List<AnalysisRequest>> GetAll()
        {
            var sql = "SELECT * FROM analysis_requests ORDER BY requested_at DESC";
            return await QueryList(sql);
        }

        public async Task<AnalysisRequest> UpdateStatus(Guid id, string status, string? errorMessage)
        {
            var query = await _repository.UpdateStatus("sp_analysis_requests_update_status", id, status, errorMessage);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0 ? Map(query[0].Rows[0]) : null;
        }

        public async Task<bool> Delete(Guid id)
        {
            var sql = $@"DELETE FROM analysis_requests WHERE id = '{id}'";
            await _repository.QueryAsync(sql);
            return true;
        }

        public async Task<(int total, int completed, int failed, int pending, double avgTime, Dictionary<string, int> byType)> GetMetrics()
        {
            var sql = @"
SELECT COUNT(*) total,
       SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) completed,
       SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) failed,
       SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) pending
FROM analysis_requests;

SELECT analysis_type, COUNT(*) cnt
FROM analysis_requests
GROUP BY analysis_type;

SELECT AVG(DATEDIFF(SECOND, started_at, completed_at)) avg_sec
FROM analysis_requests
WHERE started_at IS NOT NULL AND completed_at IS NOT NULL;";

            var data = await _repository.QueryAsync(sql);
            int total = 0, completed = 0, failed = 0, pending = 0;
            double avgSec = 0;
            var byType = new Dictionary<string, int>();

            if (data.Count > 0 && data[0].Rows.Count > 0)
            {
                var r = data[0].Rows[0];
                total = Convert.ToInt32(r["total"]);
                completed = Convert.ToInt32(r["completed"]);
                failed = Convert.ToInt32(r["failed"]);
                pending = Convert.ToInt32(r["pending"]);
            }
            if (data.Count > 1 && data[1].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in data[1].Rows)
                    byType[row["analysis_type"].ToString() ?? "Unknown"] = Convert.ToInt32(row["cnt"]);
            }
            if (data.Count > 2 && data[2].Rows.Count > 0 && data[2].Rows[0][0] != DBNull.Value)
            {
                avgSec = Convert.ToDouble(data[2].Rows[0][0]);
            }

            return (total, completed, failed, pending, avgSec, byType);
        }

        public async Task<(List<AnalysisRequest> requests, List<AnalysisResult> results)> GetSummaryBySubmission(Guid submissionId)
        {
            var sql = $@"
SELECT ar.* 
FROM analysis_requests ar
JOIN submission_db.dbo.submission_files sf ON sf.id = ar.submission_file_id
WHERE sf.submission_id = '{submissionId}';

SELECT res.* 
FROM analysis_results res
JOIN analysis_requests ar ON ar.id = res.analysis_request_id
JOIN submission_db.dbo.submission_files sf ON sf.id = ar.submission_file_id
WHERE sf.submission_id = '{submissionId}';
";
            var data = await _repository.QueryAsync(sql);
            var requests = new List<AnalysisRequest>();
            var results = new List<AnalysisResult>();
            if (data.Count > 0 && data[0].Rows.Count > 0)
                foreach (System.Data.DataRow row in data[0].Rows) requests.Add(Map(row));
            if (data.Count > 1 && data[1].Rows.Count > 0)
                foreach (System.Data.DataRow row in data[1].Rows) results.Add(AnalysisResultService.Map(row));
            return (requests, results);
        }

        private async Task<List<AnalysisRequest>> QueryList(string sql)
        {
            var list = new List<AnalysisRequest>();
            var query = await _repository.QueryAsync(sql);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                foreach (System.Data.DataRow row in query[0].Rows) list.Add(Map(row));
            return list;
        }

        public static AnalysisRequest Map(System.Data.DataRow row)
        {
            return new AnalysisRequest
            {
                Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                SubmissionFileId = Guid.Parse(row["submission_file_id"].ToString() ?? Guid.Empty.ToString()),
                FilePath = row["file_path"].ToString() ?? string.Empty,
                AnalysisType = row["analysis_type"].ToString() ?? string.Empty,
                Status = row["status"].ToString() ?? string.Empty,
                RequestedAt = Convert.ToDateTime(row["requested_at"]),
                StartedAt = row["started_at"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["started_at"]) : null,
                CompletedAt = row["completed_at"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["completed_at"]) : null,
                ErrorMessage = row["error_message"] != DBNull.Value ? row["error_message"].ToString() : null
            };
        }
    }
}

