using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.ScoreRepositories
{
    public class ScoreRepository
    {
        private readonly AppDbContext _context;

        public ScoreRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> Create(string nombreProcedimiento, ScoreCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@judge_assignment_id", request.JudgeAssignmentId),
                new SqlParameter("@rubric_criterion_id", request.RubricCriterionId),
                new SqlParameter("@score_value", request.ScoreValue),
                new SqlParameter("@comments", request.Comments ?? (object)DBNull.Value)
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetScoresByAssignmentId(string nombreProcedimiento, Guid assignmentId)
        {
            var parametros = new[]
            {
                new SqlParameter("@judge_assignment_id", assignmentId)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
