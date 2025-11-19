using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models;

namespace WS.Repositories.RubricRepositories
{
    public class RubricRepository
    {
        private readonly AppDbContext _context;

        public RubricRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> Create(string nombreProcedimiento, RubricCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.ContestId),
                new SqlParameter("@criterion_name", request.CriterionName),
                new SqlParameter("@description", request.Description ?? (object)DBNull.Value),
                new SqlParameter("@max_score", request.MaxScore),
                new SqlParameter("@weight", request.Weight),
                new SqlParameter("@criteria_order", request.CriteriaOrder)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetRubricByContestId(string nombreProcedimiento,  Guid contestId)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", contestId)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
