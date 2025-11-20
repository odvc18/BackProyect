using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.SubmissionRepositories;

namespace WS.Service.SubmissionServices
{
    public class SubmissionService
    {
        private readonly SubmissionRepository _repository;

        public SubmissionService(SubmissionRepository repository)
        {
            _repository = repository;
        }

        public async Task<Submission> Create(SubmissionCreateDto request)
        {
            try
            {
                Submission submission = null;
                var query = await _repository.Create("sp_submissions_create", request);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    submission = MapSubmission(query[0].Rows[0]);
                }
                return submission;
            }
            catch (Microsoft.Data.SqlClient.SqlException ex)
            {
                // Re-lanzar la excepción para que el controlador la maneje
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear submission: {ex.Message}", ex);
            }
        }

        public async Task<Submission> Submit(Guid submissionId)
        {
            Submission submission = null;
            var query = await _repository.Submit("sp_submissions_submit", submissionId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                submission = MapSubmission(query[0].Rows[0]);
            }
            return submission;
        }

        public async Task<Submission> GetById(Guid id)
        {
            Submission submission = null;
            var query = await _repository.GetById("sp_submissions_get_by_id", id);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                submission = MapSubmission(query[0].Rows[0]);
            }
            return submission;
        }

        public async Task<List<Submission>> GetByContest(Guid contestId)
        {
            var list = new List<Submission>();
            var query = await _repository.GetByContest("sp_submissions_get_by_contest", contestId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                {
                    list.Add(MapSubmission(row));
                }
            }
            return list;
        }

        public async Task<List<Submission>> GetByParticipant(Guid participantId)
        {
            var list = new List<Submission>();
            var query = await _repository.GetByParticipant("sp_submissions_get_by_participant", participantId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                {
                    list.Add(MapSubmission(row));
                }
            }
            return list;
        }

        public async Task<Submission> Update(Submission request)
        {
            // Not covered by SPs; use raw SQL to update allowed fields
            var sql = $@"
UPDATE submissions
SET title = {(request.Title != null ? $"'{request.Title.Replace("'", "''")}'" : "title")},
    description = {(request.Description != null ? $"'{request.Description.Replace("'", "''")}'" : "description")},
    updated_at = GETDATE()
WHERE id = '{request.Id}';
SELECT * FROM submissions WHERE id = '{request.Id}';";

            var result = await _repository.UpdateRaw(sql);
            if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
            {
                return MapSubmission(result[0].Rows[0]);
            }
            return null;
        }

        public async Task<List<Submission>> GetAll()
        {
            var list = new List<Submission>();
            var sql = "SELECT * FROM submissions ORDER BY created_at DESC;";
            var result = await _repository.GetAllRaw(sql);
            if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in result[0].Rows)
                {
                    list.Add(MapSubmission(row));
                }
            }
            return list;
        }

        public async Task<bool> Delete(Guid id)
        {
            var sql = $@"DELETE FROM submissions WHERE id = '{id}';";
            var result = await _repository.DeleteRaw(sql);
            return true;
        }

        private static Submission MapSubmission(System.Data.DataRow row)
        {
            return new Submission
            {
                Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString()),
                CategoryId = Guid.Parse(row["category_id"].ToString() ?? Guid.Empty.ToString()),
                ParticipantId = Guid.Parse(row["participant_id"].ToString() ?? Guid.Empty.ToString()),
                Title = row["title"] != DBNull.Value ? row["title"].ToString() : null,
                Description = row["description"] != DBNull.Value ? row["description"].ToString() : null,
                Status = row["status"].ToString() ?? string.Empty,
                SubmittedAt = row.Table.Columns.Contains("submitted_at") && row["submitted_at"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["submitted_at"]) : null,
                CreatedAt = Convert.ToDateTime(row["created_at"]),
                UpdatedAt = Convert.ToDateTime(row["updated_at"])
            };
        }
    }
}

