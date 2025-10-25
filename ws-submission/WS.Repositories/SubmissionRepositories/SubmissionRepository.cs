using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.SubmissionRepositories
{
    public class SubmissionRepository
    {
        private readonly AppDbContext _context;

        public SubmissionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> Create(string nombreProcedimiento, SubmissionCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.ContestId),
                new SqlParameter("@category_id", request.CategoryId),
                new SqlParameter("@participant_id", request.ParticipantId),
                new SqlParameter("@title", request.Title ?? (object)DBNull.Value),
                new SqlParameter("@description", request.Description)
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> CreateFile(string nombreProcedimiento, SubmissionFileCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", request.SubmissionId),
                new SqlParameter("@file_name", request.FileName),
                new SqlParameter("@original_name", request.OriginalName),
                new SqlParameter("@stored_path", request.StoredPath),
                new SqlParameter("@file_size", request.FileSize),
                new SqlParameter("@mime_type", request.MimeType)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetById(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetByContest(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetByParticipant(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@participant_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetFilesBySubmission(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
