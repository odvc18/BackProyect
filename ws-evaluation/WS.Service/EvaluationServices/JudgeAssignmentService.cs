using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.EvaluationRepositories;

namespace WS.Service.EvaluationServices
{
    public class JudgeAssignmentService
    {
        private readonly JudgeAssignmentRepository _repository;

        public JudgeAssignmentService(JudgeAssignmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<JudgeAssignment> Create(JudgeAssignmentCreateDto request)
        {
            var query = await _repository.Create("sp_judge_assignments_create", request);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0
                ? MapAssignment(query[0].Rows[0])
                : null;
        }

        public async Task<List<JudgeAssignment>> GetByJudge(Guid judgeId)
        {
            var list = new List<JudgeAssignment>();
            var query = await _repository.GetByJudge("sp_judge_assignments_get_by_judge", judgeId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                    list.Add(MapAssignment(row));
            }
            return list;
        }

        public async Task<List<JudgeAssignment>> GetBySubmission(Guid submissionId)
        {
            var list = new List<JudgeAssignment>();
            var query = await _repository.GetBySubmission("sp_judge_assignments_get_by_submission", submissionId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                    list.Add(MapAssignment(row));
            }
            return list;
        }

        public async Task<JudgeAssignment> GetById(Guid id)
        {
            var sql = $@"SELECT * FROM judge_assignments WHERE id = '{id}'";
            var query = await _repository.QueryAsync(sql);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0
                ? MapAssignment(query[0].Rows[0])
                : null;
        }

        public Task<List<JudgeAssignment>> GetAll()
        {
            return QueryList("SELECT * FROM judge_assignments ORDER BY assigned_at DESC;");
        }

        public async Task<JudgeAssignment> UpdateStatus(Guid id, string status)
        {
            var sql = $@"
UPDATE judge_assignments SET status = '{status.Replace("'", "''")}', 
    completed_at = CASE WHEN '{status.Replace("'", "''")}' = 'Completed' THEN GETDATE() ELSE completed_at END
WHERE id = '{id}';
SELECT * FROM judge_assignments WHERE id = '{id}'";
            var query = await _repository.QueryAsync(sql);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0
                ? MapAssignment(query[0].Rows[0])
                : null;
        }

        public async Task<bool> Delete(Guid id)
        {
            var sql = $@"DELETE FROM judge_assignments WHERE id = '{id}'";
            await _repository.QueryAsync(sql);
            return true;
        }

        private async Task<List<JudgeAssignment>> QueryList(string sql)
        {
            var list = new List<JudgeAssignment>();
            var query = await _repository.QueryAsync(sql);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                    list.Add(MapAssignment(row));
            }
            return list;
        }

        private static JudgeAssignment MapAssignment(System.Data.DataRow row)
        {
            return new JudgeAssignment
            {
                Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString()),
                SubmissionId = Guid.Parse(row["submission_id"].ToString() ?? Guid.Empty.ToString()),
                JudgeId = Guid.Parse(row["judge_id"].ToString() ?? Guid.Empty.ToString()),
                AssignedAt = Convert.ToDateTime(row["assigned_at"]),
                Status = row["status"].ToString() ?? string.Empty,
                CompletedAt = row["completed_at"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["completed_at"]) : null
            };
        }
    }
}

