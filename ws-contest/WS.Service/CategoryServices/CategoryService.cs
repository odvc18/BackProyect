using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.CategoryRepositories;

namespace WS.Service.CategoryServices
{
    public class CategoryService
    {
        private readonly CategoryRepository _repository;

        public CategoryService(CategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Category> Create(CategoryCreateDto request)
        {
            Category category = new Category();
            try
            {
                var query = await _repository.Create("sp_categories_create", request);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    category.Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString());
                    category.ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString());
                    category.Name = row["name"].ToString() ?? string.Empty;
                    category.Description = row["description"].ToString() ?? string.Empty;
                    category.MaxSubmissions = row["max_submissions"] != DBNull.Value ? (int?)Convert.ToInt32(row["max_submissions"]) : null;
                    category.AllowedFileTypes = row["allowed_file_types"].ToString() ?? string.Empty;
                    category.MaxFileSizeMb = Convert.ToInt32(row["max_file_size_mb"]);
                    category.CreatedAt = Convert.ToDateTime(row["created_at"]);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return category;
        }

        public async Task<List<Category>> GetByContestId(Guid contestId)
        {
            List<Category> categories = new List<Category>();
            try
            {
                var query = await _repository.GetByContestId("sp_categories_get_by_contest_id", contestId);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    foreach (System.Data.DataRow row in query[0].Rows)
                    {
                        Category category = new Category
                        {
                            Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                            ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString()),
                            Name = row["name"].ToString() ?? string.Empty,
                            Description = row["description"].ToString() ?? string.Empty,
                            MaxSubmissions = row["max_submissions"] != DBNull.Value ? (int?)Convert.ToInt32(row["max_submissions"]) : null,
                            AllowedFileTypes = row["allowed_file_types"].ToString() ?? string.Empty,
                            MaxFileSizeMb = Convert.ToInt32(row["max_file_size_mb"]),
                            CreatedAt = Convert.ToDateTime(row["created_at"])
                        };
                        categories.Add(category);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return categories;
        }
    }
}
