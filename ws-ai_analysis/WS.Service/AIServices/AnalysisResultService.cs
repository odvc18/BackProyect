using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.AIRepositories;

namespace WS.Service.WSServices
{
    public class AnalysisResultService
    {
        private readonly AnalysisResultRepository _repository;

        public AnalysisResultService(AnalysisResultRepository repository)
        {
            _repository = repository;
        }

        public async Task<AnalysisResult> Create(AnalysisResultCreateDto request)
        {
            var query = await _repository.Create("sp_analysis_results_create", request);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0 ? Map(query[0].Rows[0]) : null;
        }

        public async Task<List<AnalysisResult>> GetByRequest(Guid requestId)
        {
            var list = new List<AnalysisResult>();
            var query = await _repository.GetByRequest("sp_analysis_results_get_by_request", requestId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                foreach (System.Data.DataRow row in query[0].Rows) list.Add(Map(row));
            return list;
        }

        public async Task<List<AnalysisResult>> GetByFile(Guid submissionFileId)
        {
            var sql = $@"
SELECT r.*
FROM analysis_results r
JOIN analysis_requests ar ON ar.id = r.analysis_request_id
WHERE ar.submission_file_id = '{submissionFileId}'";
            return await QueryList(sql);
        }

        public async Task<List<AnalysisResult>> GetAll()
        {
            var sql = "SELECT * FROM analysis_results ORDER BY created_at DESC";
            return await QueryList(sql);
        }

        public async Task<AnalysisResult> Update(AnalysisResult result)
        {
            var sql = $@"
UPDATE analysis_results SET 
    result_type = '{result.ResultType.Replace("'", "''")}',
    result_data = '{result.ResultData.Replace("'", "''")}',
    confidence_score = {(result.ConfidenceScore.HasValue ? result.ConfidenceScore.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : "confidence_score")},
    metadata = {(result.Metadata != null ? $"'{result.Metadata.Replace("'", "''")}'" : "metadata")}
WHERE id = '{result.Id}';
SELECT * FROM analysis_results WHERE id = '{result.Id}'";
            var query = await _repository.QueryAsync(sql);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0 ? Map(query[0].Rows[0]) : null;
        }

        public async Task<bool> Delete(Guid id)
        {
            var sql = $@"DELETE FROM analysis_results WHERE id = '{id}'";
            await _repository.QueryAsync(sql);
            return true;
        }

        private async Task<List<AnalysisResult>> QueryList(string sql)
        {
            var list = new List<AnalysisResult>();
            var query = await _repository.QueryAsync(sql);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                foreach (System.Data.DataRow row in query[0].Rows) list.Add(Map(row));
            return list;
        }

        public static AnalysisResult Map(System.Data.DataRow row)
        {
            return new AnalysisResult
            {
                Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                AnalysisRequestId = Guid.Parse(row["analysis_request_id"].ToString() ?? Guid.Empty.ToString()),
                ResultType = row["result_type"].ToString() ?? string.Empty,
                ResultData = row["result_data"].ToString() ?? string.Empty,
                ConfidenceScore = row["confidence_score"] != DBNull.Value ? (decimal?)Convert.ToDecimal(row["confidence_score"]) : null,
                Metadata = row["metadata"] != DBNull.Value ? row["metadata"].ToString() : null,
                CreatedAt = Convert.ToDateTime(row["created_at"])
            };
        }
    }
}

