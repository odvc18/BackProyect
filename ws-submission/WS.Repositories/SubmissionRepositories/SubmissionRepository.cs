using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.SubmissionRepositories
{
    public class SubmissionRepository
    {
        private readonly AppDbContext _context;

        public SubmissionRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<DataTableCollection> Create(string sp, SubmissionCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.ContestId),
                new SqlParameter("@category_id", request.CategoryId),
                new SqlParameter("@participant_id", request.ParticipantId),
                new SqlParameter("@title", (object?)request.Title ?? DBNull.Value),
                new SqlParameter("@description", (object?)request.Description ?? DBNull.Value),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> Submit(string sp, Guid submissionId)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", submissionId),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> GetById(string sp, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@submission_id", id),
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

        public Task<DataTableCollection> GetByParticipant(string sp, Guid participantId)
        {
            var parametros = new[]
            {
                new SqlParameter("@participant_id", participantId),
            };
            return _context.ExecuteStoreProcedureAsync(sp, parametros);
        }

        public Task<DataTableCollection> UpdateRaw(string sql)
        {
            return _context.ExecuteQueryAsync(sql);
        }

        public Task<DataTableCollection> GetAllRaw(string sql)
        {
            return _context.ExecuteQueryAsync(sql);
        }

        public Task<DataTableCollection> DeleteRaw(string sql)
        {
            return _context.ExecuteQueryAsync(sql);
        }
    }
}

