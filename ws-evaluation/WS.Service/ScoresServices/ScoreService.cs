using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.ScoreRepositories;

namespace WS.Service.ScoresServices
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
            Score score = new Score();
            try
            {
                var result = await _repository.Create("sp_scores_create", request);
                if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
                {
                    var row = result[0].Rows[0];
                    score.Id = Guid.Parse(row["id"].ToString());
                    score.RubricCriterionId = Guid.Parse(row["rubric_criterion_id"].ToString());
                    score.JudgeAssignmentId = Guid.Parse(row["judge_assignment_id"].ToString());
                    score.ScoreValue = int.Parse(row["score_value"].ToString());
                    score.ScoredAt = DateTime.Parse(row["scored_at"].ToString());
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating Score", ex);
            }
            return score;
        }

        public async Task<List<Score>> GetScoresByAssignmentId(Guid assignmentId)
        {
            List<Score> scores = new List<Score>();
            try
            {
                var result = await _repository.GetScoresByAssignmentId("sp_scores_get_by_assignment", assignmentId);
                if (result != null && result.Count > 0)
                {
                    foreach (System.Data.DataRow row in result[0].Rows)
                    {
                        Score score = new Score
                        {
                            Id = Guid.Parse(row["id"].ToString()),
                            RubricCriterionId = Guid.Parse(row["rubric_criterion_id"].ToString()),
                            JudgeAssignmentId = Guid.Parse(row["judge_assignment_id"].ToString()),
                            ScoreValue = int.Parse(row["score_value"].ToString()),
                            Comments = row["comments"].ToString(),
                            ScoredAt = DateTime.Parse(row["scored_at"].ToString())
                        };
                        scores.Add(score);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving Scores", ex);
            }
            return scores;
        }
    }
}
