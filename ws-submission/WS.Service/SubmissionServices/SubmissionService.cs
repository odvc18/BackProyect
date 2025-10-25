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
            Submission submission = new Submission();
            try
            {
                var query = await _repository.Create("sp_contests_create", request);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    submission.Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString());
                    submission.ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString());
                    submission.CategoryId = Guid.Parse(row["category_id"].ToString() ?? Guid.Empty.ToString());

                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating submission", ex);
            }
            return submission;
        }

        public async Task<Submission?> GetById(Guid id)
        {
            Submission? submission = null;
            try
            {
                var query = await _repository.GetById("sp_submissions_get_by_id", id);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    submission = new Submission
                    {
                        Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                        ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString()),
                        CategoryId = Guid.Parse(row["category_id"].ToString() ?? Guid.Empty.ToString()),
                        ParticipantId = Guid.Parse(row["participant_id"].ToString() ?? Guid.Empty.ToString()),
                        Title = row["title"].ToString(),
                        Description = row["description"].ToString(),
                        Status = row["status"].ToString() ?? string.Empty,
                        SubmittedAt = row["submitted_at"] != DBNull.Value ? (DateTime?)DateTime.Parse(row["submitted_at"].ToString() ?? string.Empty) : null,
                        CreatedAt = DateTime.Parse(row["created_at"].ToString() ?? string.Empty),
                        UpdatedAt = DateTime.Parse(row["updated_at"].ToString() ?? string.Empty)
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving submission by ID", ex);
            }
            return submission;
        }

        public async Task<List<Submission>> GetByContestId(Guid contestId)
        {
            List<Submission> submissions = new List<Submission>();
            try
            {
                var query = await _repository.GetByContest("sp_submissions_get_by_contest", contestId);
                if (query != null && query.Count > 0)
                {
                    foreach (System.Data.DataRow row in query[0].Rows)
                    {
                        Submission submission = new Submission
                        {
                            Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                            ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString()),
                            CategoryId = Guid.Parse(row["category_id"].ToString() ?? Guid.Empty.ToString()),
                            ParticipantId = Guid.Parse(row["participant_id"].ToString() ?? Guid.Empty.ToString()),
                            Title = row["title"].ToString(),
                            Description = row["description"].ToString(),
                            Status = row["status"].ToString() ?? string.Empty,
                            SubmittedAt = row["submitted_at"] != DBNull.Value ? (DateTime?)DateTime.Parse(row["submitted_at"].ToString() ?? string.Empty) : null,
                            CreatedAt = DateTime.Parse(row["created_at"].ToString() ?? string.Empty),
                            UpdatedAt = DateTime.Parse(row["updated_at"].ToString() ?? string.Empty)
                        };
                        submissions.Add(submission);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving submissions by contest ID", ex);
            }
            return submissions;
        }

        public async Task<List<Submission>> GetByParticipantId(Guid participantId)
        {
            List<Submission> submissions = new List<Submission>();
            try
            {
                var query = await _repository.GetByParticipant("sp_submissions_get_by_participant", participantId);
                if (query != null && query.Count > 0)
                {
                    foreach (System.Data.DataRow row in query[0].Rows)
                    {
                        Submission submission = new Submission
                        {
                            Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                            ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString()),
                            CategoryId = Guid.Parse(row["category_id"].ToString() ?? Guid.Empty.ToString()),
                            ParticipantId = Guid.Parse(row["participant_id"].ToString() ?? Guid.Empty.ToString()),
                            Title = row["title"].ToString(),
                            Description = row["description"].ToString(),
                            Status = row["status"].ToString() ?? string.Empty,
                            SubmittedAt = row["submitted_at"] != DBNull.Value ? (DateTime?)DateTime.Parse(row["submitted_at"].ToString() ?? string.Empty) : null,
                            CreatedAt = DateTime.Parse(row["created_at"].ToString() ?? string.Empty),
                            UpdatedAt = DateTime.Parse(row["updated_at"].ToString() ?? string.Empty)
                        };
                        submissions.Add(submission);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving submissions by participant ID", ex);
            }
            return submissions;
        }

        public async Task<SubmissionFile> CreateFile(SubmissionFileCreateDto request)
        {
            SubmissionFile submissionFile = new SubmissionFile();
            try
            {
                var query = await _repository.CreateFile("sp_submission_files_create", request);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    submissionFile.Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString());
                    submissionFile.SubmissionId = Guid.Parse(row["submission_id"].ToString() ?? Guid.Empty.ToString());
                    submissionFile.FileName = row["file_name"].ToString() ?? string.Empty;
                    submissionFile.OriginalName = row["original_name"].ToString() ?? string.Empty;
                    submissionFile.StoredPath = row["stored_path"].ToString() ?? string.Empty;
                    submissionFile.FileSize = long.Parse(row["file_size"].ToString() ?? "0");
                    submissionFile.MimeType = row["mime_type"].ToString() ?? string.Empty;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating submission file", ex);
            }
            return submissionFile;
        }

        public async Task<List<SubmissionFile>> GetFilesBySubmissionId(Guid submissionId)
        {
            List<SubmissionFile> submissionFiles = new List<SubmissionFile>();
            try
            {
                var query = await _repository.GetFilesBySubmission("sp_submission_files_get_by_submission", submissionId);
                if (query != null && query.Count > 0)
                {
                    foreach (System.Data.DataRow row in query[0].Rows)
                    {
                        SubmissionFile submissionFile = new SubmissionFile
                        {
                            Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                            SubmissionId = Guid.Parse(row["submission_id"].ToString() ?? Guid.Empty.ToString()),
                            FileName = row["file_name"].ToString() ?? string.Empty,
                            OriginalName = row["original_name"].ToString() ?? string.Empty,
                            StoredPath = row["stored_path"].ToString() ?? string.Empty,
                            FileSize = long.Parse(row["file_size"].ToString() ?? "0"),
                            MimeType = row["mime_type"].ToString() ?? string.Empty
                        };
                        submissionFiles.Add(submissionFile);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving submission files by submission ID", ex);
            }
            return submissionFiles;
        }
    }
}
