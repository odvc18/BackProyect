using Microsoft.Data.SqlClient;
using System.Data;
using WS.Infraestructure.Connection;
using WS.Infraestructure.Models.DTOs;

namespace WS.Repositories.UserRepositories
{
    public class UserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DataTableCollection> Create(string nombreProcedimiento, UserCreateDto request)
        {
            var parametros = new[]
            {
                new SqlParameter("@email", request.Email),
                new SqlParameter("@passwordHash", request.PasswordHash),
                new SqlParameter("@role", request.Role),
                new SqlParameter("@firstName", request.FirstName ?? (object)DBNull.Value),
                new SqlParameter("@lastName", request.LastName ?? (object)DBNull.Value),
                new SqlParameter("@phone", request.Phone ?? (object)DBNull.Value),
                new SqlParameter("@institution", request.Institution ?? (object)DBNull.Value),
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetByEmail(string nombreProcedimiento, string email)
        {
            var parametros = new[]
            {
                new SqlParameter("@Email", email)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> GetById(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@user_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> Update(string nombreProcedimiento, UserUpdateDto request, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@user_id", id),
                new SqlParameter("@firstName", request.FirstName ?? (object)DBNull.Value),
                new SqlParameter("@lastName", request.LastName ?? (object)DBNull.Value),
                new SqlParameter("@phone", request.Phone ?? (object)DBNull.Value),
                new SqlParameter("@institution", request.Institution ?? (object)DBNull.Value),
            };

            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }

        public async Task<DataTableCollection> Delete(string nombreProcedimiento, Guid id)
        {
            var parametros = new[]
            {
                new SqlParameter("@user_id", id)
            };
            return await _context.ExecuteStoreProcedureAsync(nombreProcedimiento, parametros);
        }
    }
}
