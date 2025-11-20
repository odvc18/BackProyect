using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.EvaluationRepositories;

namespace WS.Service.EvaluationServices
{
    public class ScoreService
    {
        private readonly ScoreRepository _repository;

        public ScoreService(ScoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<Score> Create(ScoreCreateDto request)
        {
            var query = await _repository.Create("sp_scores_create", request);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0
                ? MapScore(query[0].Rows[0])
                : null;
        }

        public async Task<List<Score>> GetByAssignment(Guid assignmentId)
        {
            var list = new List<Score>();
            var query = await _repository.GetByAssignment("sp_scores_get_by_assignment", assignmentId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                    list.Add(MapScore(row));
            }
            return list;
        }

        public Task<List<Score>> GetBySubmission(Guid submissionId)
        {
            var sql = $@"
SELECT s.* FROM scores s
JOIN judge_assignments ja ON ja.id = s.judge_assignment_id
WHERE ja.submission_id = '{submissionId}'";
            return QueryList(sql);
        }

        public async Task<Score> Update(Score score)
        {
            var rubricIdValue = score.RubricCriterionId.HasValue ? $"'{score.RubricCriterionId.Value}'" : "NULL";
            var sql = $@"
UPDATE scores SET 
    rubric_criterion_id = {rubricIdValue},
    score = {score.Value.ToString(System.Globalization.CultureInfo.InvariantCulture)},
    comments = {(score.Comments != null ? $"'{score.Comments.Replace("'", "''")}'" : "comments")},
    scored_at = GETDATE()
WHERE id = '{score.Id}';
SELECT * FROM scores WHERE id = '{score.Id}'";
            var query = await _repository.QueryAsync(sql);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0
                ? MapScore(query[0].Rows[0])
                : null;
        }

        public async Task<bool> Delete(Guid id)
        {
            var sql = $@"DELETE FROM scores WHERE id = '{id}'";
            await _repository.QueryAsync(sql);
            return true;
        }

        public async Task<(decimal totalScore, List<Score> scores)> GetSummaryBySubmission(Guid submissionId)
        {
            var list = await GetBySubmission(submissionId);
            var total = list.Sum(s => s.Value);
            return (total, list);
        }

        public Task<List<Score>> GetByContest(Guid contestId)
        {
            var sql = $@"
SELECT s.* FROM scores s
JOIN judge_assignments ja ON ja.id = s.judge_assignment_id
WHERE ja.contest_id = '{contestId}'";
            return QueryList(sql);
        }

        public Task<List<Score>> GetByCategory(Guid categoryId)
        {
            var sql = $@"
SELECT s.* FROM scores s
JOIN judge_assignments ja ON ja.id = s.judge_assignment_id
JOIN submission_db.dbo.submissions sub ON sub.id = ja.submission_id
WHERE sub.category_id = '{categoryId}'";
            return QueryList(sql);
        }

        private Task<List<Score>> QueryList(string sql)
        {
            return QueryListInternal(sql);
        }

        private async Task<List<Score>> QueryListInternal(string sql)
        {
            var list = new List<Score>();
            var query = await _repository.QueryAsync(sql);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                    list.Add(MapScore(row));
            }
            return list;
        }

        private static Score MapScore(System.Data.DataRow row)
        {
            return new Score
            {
                Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                JudgeAssignmentId = Guid.Parse(row["judge_assignment_id"].ToString() ?? Guid.Empty.ToString()),
                RubricCriterionId = row["rubric_criterion_id"] != DBNull.Value ? (Guid?)Guid.Parse(row["rubric_criterion_id"].ToString() ?? Guid.Empty.ToString()) : null,
                Value = Convert.ToDecimal(row["score"]),
                Comments = row["comments"] != DBNull.Value ? row["comments"].ToString() : null,
                ScoredAt = Convert.ToDateTime(row["scored_at"])
            };
        }
    }
}

