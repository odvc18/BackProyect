using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.ContestRepositories
{
    public class ContestRepository
    {
        private readonly AppDbContext _context;

        public ContestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> Create(string nombreProcedimiento, ContestCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@title", request.Title),
                new SqlParameter("@description", request.Description),
                new SqlParameter("@rules", request.Rules),
                new SqlParameter("@status", request.Status ?? (object)DBNull.Value),
                new SqlParameter("@start_date", request.StartDate),
                new SqlParameter("@end_date", request.EndDate),
                new SqlParameter("@judging_date", request.JudgingDate ?? (object)DBNull.Value),
                new SqlParameter("@max_submissions_per_participant", request.MaxSubmissionsPerParticipant),
                new SqlParameter("@created_by_user_id", request.CreatedByUserId),
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetById(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetByActive(string nombreProcedimiento)
        {
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento);
        }

        public async Task<DataTableCollection> Update(string nombreProcedimiento, ContestUpdateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.Id),
                new SqlParameter("@title", request.Title),
                new SqlParameter("@description", request.Description),
                new SqlParameter("@rules", request.Rules ?? (object)DBNull.Value),
                new SqlParameter("@status", request.Status),
                new SqlParameter("@end_date", request.EndDate),
                new SqlParameter("@judging_date", request.JudgingDate ?? (object)DBNull.Value)
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> Delete(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
