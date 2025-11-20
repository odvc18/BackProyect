using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.UserRepositories;
using System.Collections.Generic;

namespace WS.Service.UserServices
{
    public class UserService
    {
        private readonly UserRepository _repository;

        public UserService(UserRepository repository)
        {
            _repository = repository;
        }

        private static string NormalizeRoleForDatabase(string role)
        {
            if (string.IsNullOrWhiteSpace(role)) return role;
            var r = role.Trim().ToLowerInvariant();
            return r switch
            {
                "admin" => "ADMIN",
                "judge" => "JUDGE",
                "participant" => "PARTICIPANT",
                "viewer" => "VIEWER",
                _ => role.ToUpperInvariant()
            };
        }

        private static string NormalizeRoleForApp(string roleFromDb)
        {
            if (string.IsNullOrWhiteSpace(roleFromDb)) return roleFromDb;
            var r = roleFromDb.Trim().ToUpperInvariant();
            return r switch
            {
                "ADMIN" => "Admin",
                "JUDGE" => "Judge",
                "PARTICIPANT" => "Participant",
                "VIEWER" => "Viewer",
                _ => roleFromDb
            };
        }

        public async Task<User> Create(UserCreateDto request)
        {
            User user = null;
            try
            {
                var normalized = new UserCreateDto
                {
                    Email = request.Email,
                    PasswordHash = request.PasswordHash,
                    Role = NormalizeRoleForDatabase(request.Role),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Phone = request.Phone,
                    Institution = request.Institution
                };

                var query = await _repository.Create("sp_users_create", normalized);
                if (query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    user = new User
                    {
                        Id = Guid.Parse(row["id"].ToString() ?? string.Empty),
                        Email = row["email"].ToString() ?? string.Empty,
                        PasswordHash = row["password_hash"].ToString() ?? string.Empty,
                        Role = NormalizeRoleForApp(row["role"].ToString() ?? string.Empty),
                        FirstName = row["first_name"] != DBNull.Value ? row["first_name"].ToString() : null,
                        LastName = row["last_name"] != DBNull.Value ? row["last_name"].ToString() : null,
                        Phone = row["phone"] != DBNull.Value ? row["phone"].ToString() : null,
                        Institution = row["institution"] != DBNull.Value ? row["institution"].ToString() : null,
                        IsActive = Convert.ToBoolean(row["is_active"]),
                        CreatedAt = Convert.ToDateTime(row["created_at"]),
                        UpdatedAt = Convert.ToDateTime(row["updated_at"])
                    };
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el usuario: " + ex.Message);
            }
            return user;
        }

        public async Task<User> GetByEmail(string email)
        {
            User user = null;
            try
            {
                var query = await _repository.GetByEmail("sp_users_get_by_email", email);
                if (query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    user = new User
                    {
                        Id = Guid.Parse(row["id"].ToString() ?? string.Empty),
                        Email = row["email"].ToString() ?? string.Empty,
                        PasswordHash = row["password_hash"].ToString() ?? string.Empty,
                        Role = NormalizeRoleForApp(row["role"].ToString() ?? string.Empty),
                        FirstName = row["first_name"] != DBNull.Value ? row["first_name"].ToString() : null,
                        LastName = row["last_name"] != DBNull.Value ? row["last_name"].ToString() : null,
                        Phone = row["phone"] != DBNull.Value ? row["phone"].ToString() : null,
                        Institution = row["institution"] != DBNull.Value ? row["institution"].ToString() : null,
                        IsActive = Convert.ToBoolean(row["is_active"]),
                        CreatedAt = Convert.ToDateTime(row["created_at"]),
                        UpdatedAt = Convert.ToDateTime(row["updated_at"])
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el usuario por email: " + ex.Message);
            }
            return user;
        }

        public async Task<User> GetById(Guid id)
        {
            User user = null;
            try
            {
                var query = await _repository.GetById("sp_users_get_by_id", id);
                if (query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    user = new User
                    {
                        Id = Guid.Parse(row["id"].ToString() ?? string.Empty),
                        Email = row["email"].ToString() ?? string.Empty,
                        PasswordHash = row["password_hash"].ToString() ?? string.Empty,
                        Role = NormalizeRoleForApp(row["role"].ToString() ?? string.Empty),
                        FirstName = row["first_name"] != DBNull.Value ? row["first_name"].ToString() : null,
                        LastName = row["last_name"] != DBNull.Value ? row["last_name"].ToString() : null,
                        Phone = row["phone"] != DBNull.Value ? row["phone"].ToString() : null,
                        Institution = row["institution"] != DBNull.Value ? row["institution"].ToString() : null,
                        IsActive = Convert.ToBoolean(row["is_active"]),
                        CreatedAt = Convert.ToDateTime(row["created_at"]),
                        UpdatedAt = Convert.ToDateTime(row["updated_at"])
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el usuario por ID: " + ex.Message);
            }
            return user;
        }

        public async Task<User> Update(UserUpdateDto request)
        {
            User user = null;
            try
            {
                var query = await _repository.Update("sp_users_update", request, request.Id);
                if (query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    user = new User
                    {
                        Id = Guid.Parse(row["id"].ToString() ?? string.Empty),
                        Email = row["email"].ToString() ?? string.Empty,
                        PasswordHash = row["password_hash"].ToString() ?? string.Empty,
                        Role = NormalizeRoleForApp(row["role"].ToString() ?? string.Empty),
                        FirstName = row["first_name"] != DBNull.Value ? row["first_name"].ToString() : null,
                        LastName = row["last_name"] != DBNull.Value ? row["last_name"].ToString() : null,
                        Phone = row["phone"] != DBNull.Value ? row["phone"].ToString() : null,
                        Institution = row["institution"] != DBNull.Value ? row["institution"].ToString() : null,
                        IsActive = Convert.ToBoolean(row["is_active"]),
                        CreatedAt = Convert.ToDateTime(row["created_at"]),
                        UpdatedAt = Convert.ToDateTime(row["updated_at"])
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar el usuario: " + ex.Message);
            }
            return user;
        }

        public async Task<bool> Delete(Guid id)
        {
            try
            {
                var query = await _repository.Delete("sp_users_delete", id);
                return query[0].Rows.Count > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar el usuario: " + ex.Message);
            }
        }

        public async Task<List<User>> GetAll()
        {
            var list = new List<User>();
            try
            {
                var query = await _repository.GetAll();
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    foreach (System.Data.DataRow row in query[0].Rows)
                    {
                        list.Add(new User
                        {
                            Id = Guid.Parse(row["id"].ToString() ?? string.Empty),
                            Email = row["email"].ToString() ?? string.Empty,
                            PasswordHash = row["password_hash"].ToString() ?? string.Empty,
                            Role = NormalizeRoleForApp(row["role"].ToString() ?? string.Empty),
                            FirstName = row["first_name"] != DBNull.Value ? row["first_name"].ToString() : null,
                            LastName = row["last_name"] != DBNull.Value ? row["last_name"].ToString() : null,
                            Phone = row["phone"] != DBNull.Value ? row["phone"].ToString() : null,
                            Institution = row["institution"] != DBNull.Value ? row["institution"].ToString() : null,
                            IsActive = Convert.ToBoolean(row["is_active"]),
                            CreatedAt = Convert.ToDateTime(row["created_at"]),
                            UpdatedAt = Convert.ToDateTime(row["updated_at"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los usuarios: " + ex.Message);
            }
            return list;
        }
    }
}
