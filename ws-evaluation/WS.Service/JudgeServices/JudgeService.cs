using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.JugdeRepositories;

namespace WS.Service.JudgeServices
{
    public class JudgeService
    {
        private readonly JugdeRepository _repository;

        public JudgeService(JugdeRepository repository)
        {
            _repository = repository;
        }

        public async Task<JudgeAssignment> Create(JudgeAssignmentCreateDto request)
        {
            JudgeAssignment judgeAssignment = new JudgeAssignment();
            try
            {
                var result = await _repository.Create("sp_judge_assignments_create", request);
                if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
                {
                    var row = result[0].Rows[0];
                    judgeAssignment.Id = Guid.Parse(row["id"].ToString());
                    judgeAssignment.ContestId = Guid.Parse(row["contest_id"].ToString());
                    judgeAssignment.SubmissionId = Guid.Parse(row["submission_id"].ToString());
                    judgeAssignment.JudgeId = Guid.Parse(row["judge_id"].ToString());
                    judgeAssignment.AssignedAt = DateTime.Parse(row["assigned_at"].ToString());
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating JudgeAssignment", ex);
            }
            return judgeAssignment;
        }

        public async Task<List<JudgeAssignment>> GetAssignmentsByJudgeId(Guid judgeId)
        {
            List<JudgeAssignment> assignments = new List<JudgeAssignment>();
            try
            {
                var result = await _repository.GetAssignmentsByJudgeId("sp_judge_assignments_get_by_judge", judgeId);
                if (result != null && result.Count > 0)
                {
                    foreach (System.Data.DataRow row in result[0].Rows)
                    {
                        JudgeAssignment assignment = new JudgeAssignment
                        {
                            Id = Guid.Parse(row["id"].ToString()),
                            ContestId = Guid.Parse(row["contest_id"].ToString()),
                            SubmissionId = Guid.Parse(row["submission_id"].ToString()),
                            JudgeId = Guid.Parse(row["judge_id"].ToString()),
                            AssignedAt = DateTime.Parse(row["assigned_at"].ToString()),
                            Status = row["status"].ToString(),
                            CompletedAt = row["completed_at"] == DBNull.Value ? null : (DateTime?)DateTime.Parse(row["completed_at"].ToString())
                        };
                        assignments.Add(assignment);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving JudgeAssignments by JudgeId", ex);
            }
            return assignments;
        }

        public async Task<List<JudgeAssignment>> GetJudgeAssignmentsBySubmission(Guid submissionId, string status)
        {
            List<JudgeAssignment> assignments = new List<JudgeAssignment>();
            try
            {
                var result = await _repository.GetJudgeAssignmentsBySubmission("sp_judge_assignments_get_by_submission", submissionId, status);
                if (result != null && result.Count > 0)
                {
                    foreach (System.Data.DataRow row in result[0].Rows)
                    {
                        JudgeAssignment assignment = new JudgeAssignment
                        {
                            Id = Guid.Parse(row["id"].ToString()),
                            ContestId = Guid.Parse(row["contest_id"].ToString()),
                            SubmissionId = Guid.Parse(row["submission_id"].ToString()),
                            JudgeId = Guid.Parse(row["judge_id"].ToString()),
                            AssignedAt = DateTime.Parse(row["assigned_at"].ToString()),
                            Status = row["status"].ToString(),
                            CompletedAt = row["completed_at"] == DBNull.Value ? null : (DateTime?)DateTime.Parse(row["completed_at"].ToString())
                        };
                        assignments.Add(assignment);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving JudgeAssignments by SubmissionId", ex);
            }
            return assignments;
        }
    }
}
