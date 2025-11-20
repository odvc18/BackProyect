using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.EvaluationRepositories
{
    public class RubricRepository
    {
        private readonly AppDbContext _context;

        public RubricRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<DataTableCollection> Create(string sp, RubricCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.ContestId),
                new SqlParameter("@criterion_name", request.CriterionName),
                new SqlParameter("@description", (object?)request.Description ?? DBNull.Value),
                new SqlParameter("@max_score", request.MaxScore),
                new SqlParameter("@weight", request.Weight),
                new SqlParameter("@criteria_order", request.CriteriaOrder),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> GetByContest(string sp, Guid contestId)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", contestId),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> QueryAsync(string sql) => _context.ExecuteQueryAsync(sql);
    }
}

