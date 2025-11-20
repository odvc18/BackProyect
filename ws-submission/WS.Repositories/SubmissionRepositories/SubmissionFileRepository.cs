using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.SubmissionRepositories
{
    public class SubmissionFileRepository
    {
        private readonly AppDbContext _context;

        public SubmissionFileRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<DataTableCollection> Create(string sp, SubmissionFileCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", request.SubmissionId),
                new SqlParameter("@file_name", request.FileName),
                new SqlParameter("@original_name", request.OriginalName),
                new SqlParameter("@stored_path", request.StoredPath),
                new SqlParameter("@file_size", request.FileSize),
                new SqlParameter("@mime_type", request.MimeType),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> GetBySubmission(string sp, Guid submissionId)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", submissionId),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> DeleteRaw(string sql)
        {
            return _context.ExecuteQueryAsync(sql);
        }
    }
}

