using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.AIRepositories
{
    public class AnalysisResultRepository
    {
        private readonly AppDbContext _context;

        public AnalysisResultRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<DataTableCollection> Create(string sp, AnalysisResultCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@analysis_request_id", request.AnalysisRequestId),
                new SqlParameter("@result_type", request.ResultType),
                new SqlParameter("@result_data", request.ResultData),
                new SqlParameter("@confidence_score", (object?)request.ConfidenceScore ?? DBNull.Value),
                new SqlParameter("@metadata", (object?)request.Metadata ?? DBNull.Value),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> GetByRequest(string sp, Guid requestId)
        {
            var parametros = new[]
            {
                new SqlParameter("@analysis_request_id", requestId),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> QueryAsync(string sql) => _context.ExecuteQueryAsync(sql);
    }
}

