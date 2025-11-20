using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.EvaluationRepositories
{
    public class JudgeAssignmentRepository
    {
        private readonly AppDbContext _context;

        public JudgeAssignmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<DataTableCollection> Create(string sp, JudgeAssignmentCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.ContestId),
                new SqlParameter("@submission_id", request.SubmissionId),
                new SqlParameter("@judge_id", request.JudgeId),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> GetByJudge(string sp, Guid judgeId)
        {
            var parametros = new[]
            {
                new SqlParameter("@judge_id", judgeId),
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

        public Task<DataTableCollection> QueryAsync(string sql) => _context.ExecuteQueryAsync(sql);
    }
}

