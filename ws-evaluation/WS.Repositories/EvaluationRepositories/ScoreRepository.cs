using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.EvaluationRepositories
{
    public class ScoreRepository
    {
        private readonly AppDbContext _context;

        public ScoreRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<DataTableCollection> Create(string sp, ScoreCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@judge_assignment_id", request.JudgeAssignmentId),
                new SqlParameter("@rubric_criterion_id", (object?)request.RubricCriterionId ?? DBNull.Value),
                new SqlParameter("@score", request.Score),
                new SqlParameter("@comments", (object?)request.Comments ?? DBNull.Value),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> GetByAssignment(string sp, Guid assignmentId)
        {
            var parametros = new[]
            {
                new SqlParameter("@judge_assignment_id", assignmentId),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> QueryAsync(string sql) => _context.ExecuteQueryAsync(sql);
    }
}

