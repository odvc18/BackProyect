using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.AIRepositories
{
    public class AnalysisRequestRepository
    {
        private readonly AppDbContext _context;

        public AnalysisRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<DataTableCollection> Create(string sp, AnalysisRequestCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_file_id", request.SubmissionFileId),
                new SqlParameter("@file_path", request.FilePath),
                new SqlParameter("@analysis_type", request.AnalysisType),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> UpdateStatus(string sp, Guid id, string status, string? errorMessage)
        {
            var parametros = new[]
            {
                new SqlParameter("@request_id", id),
                new SqlParameter("@status", status),
                new SqlParameter("@error_message", (object?)errorMessage ?? DBNull.Value),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> GetByStatus(string sp, string status)
        {
            var parametros = new[]
            {
                new SqlParameter("@status", status),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> QueryAsync(string sql) => _context.ExecuteQueryAsync(sql);
    }
}

