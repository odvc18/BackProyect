using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.SubmissionRepositories;

namespace WS.Service.SubmissionServices
{
    public class SubmissionFileService
    {
        private readonly SubmissionFileRepository _repository;

        public SubmissionFileService(SubmissionFileRepository repository)
        {
            _repository = repository;
        }

        public async Task<SubmissionFile> Create(SubmissionFileCreateDto request)
        {
            SubmissionFile file = null;
            var query = await _repository.Create("sp_submission_files_create", request);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                file = MapFile(query[0].Rows[0]);
            }
            return file;
        }

        public async Task<List<SubmissionFile>> GetBySubmission(Guid submissionId)
        {
            var list = new List<SubmissionFile>();
            var query = await _repository.GetBySubmission("sp_submission_files_get_by_submission", submissionId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                {
                    list.Add(MapFile(row));
                }
            }
            return list;
        }

        public async Task<SubmissionFile> GetByStoredPath(string storedPath)
        {
            var sql = $@"SELECT * FROM submission_files WHERE stored_path = '{storedPath.Replace("'", "''")}'";
            var query = await _repository.DeleteRaw(sql);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                return MapFile(query[0].Rows[0]);
            }
            return null;
        }

        public async Task<bool> Delete(Guid id)
        {
            var sql = $@"DELETE FROM submission_files WHERE id = '{id}';";
            await _repository.DeleteRaw(sql);
            return true;
        }

        private static SubmissionFile MapFile(System.Data.DataRow row)
        {
            return new SubmissionFile
            {
                Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                SubmissionId = Guid.Parse(row["submission_id"].ToString() ?? Guid.Empty.ToString()),
                FileName = row["file_name"].ToString() ?? string.Empty,
                OriginalName = row["original_name"].ToString() ?? string.Empty,
                StoredPath = row["stored_path"].ToString() ?? string.Empty,
                FileSize = Convert.ToInt64(row["file_size"]),
                MimeType = row["mime_type"].ToString() ?? string.Empty,
                UploadCompleted = row.Table.Columns.Contains("upload_completed") && Convert.ToBoolean(row["upload_completed"]),
                CreatedAt = Convert.ToDateTime(row["created_at"])
            };
        }
    }
}

