using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTO;

namespace WS.Repositories.AIAnalysisRepositories
{
    public class AIAnalysisRepository
    {
        private readonly AppDbContext _context;

        public AIAnalysisRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> CreateAnalysisRequest(string nombreProcedimiento, AnalysisRequestCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_file_id", request.SubmissionFileId),
                new SqlParameter("@file_path", request.FilePath),
                new SqlParameter("@analysis_type", request.AnalysisType)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> UpdateAnalysisRequestStatus(string nombreProcedimiento, AnalysisStatusUpdateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@status", request.Status),
                new SqlParameter("@error_message", (object?)request.ErrorMessage ?? DBNull.Value),
                new SqlParameter("@request_id", request.AnalysisRequestId)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros.ToArray());
        }

        public async Task<DataTableCollection> CreateAnalysisResult(string nombreProcedimiento, AnalysisResultCreateDto result)
        {
            var parametros = new[]
            {
                new SqlParameter("@analysis_request_id", result.AnalysisRequestId),
                new SqlParameter("@result_type", result.ResultType),
                new SqlParameter("@result_data", result.ResultData),
                new SqlParameter("@confidence_score", (object?)result.ConfidenceScore ?? DBNull.Value),
                new SqlParameter("@metadata", (object?)result.Metadata ?? DBNull.Value)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetAnalysisResultsByRequestId(string nombreProcedimiento, Guid analysisRequestId)
        {
            var parametros = new[]
            {
                new SqlParameter("@analysis_request_id", analysisRequestId)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetAnalysisResultsByStatus(string nombreProcedimiento, string status)
        {
            var parametros = new[]
            {
                new SqlParameter("@status", status)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
