using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.JugdeRepositories
{
    public class JugdeRepository
    {
        private readonly AppDbContext _context;

        public JugdeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> Create(string nombreProcedimiento, JudgeAssignmentCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.ContestId),
                new SqlParameter("@submission_id", request.SubmissionId),
                new SqlParameter("@judge_id", request.JudgeId)
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetAssignmentsByJudgeId(string nombreProcedimiento, Guid judgeId)
        {
            var parametros = new[]
            {
                new SqlParameter("@judge_id", judgeId)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetJudgeAssignmentsBySubmission(string nombreProcedimiento, Guid assignmentId, string status)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", assignmentId)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
