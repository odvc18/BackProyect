using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.CategoryRepositories
{
    public class CategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> Create(string nombreProcedimiento, CategoryCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", request.ContestId),
                new SqlParameter("@name", request.Description),
                new SqlParameter("@description", request.Description),
                new SqlParameter("@max_submissions", request.MaxSubmissions ?? (object)DBNull.Value),
                new SqlParameter("@allowed_file_types", request.AllowedFileTypes),
                new SqlParameter("@max_file_size_mb", request.MaxFileSizeMb)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetByContestId(string nombreProcedimiento, Guid contestId)
        {
            var parametros = new[]
            {
                new SqlParameter("@contest_id", contestId)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
