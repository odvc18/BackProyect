using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.EvaluationRepositories;

namespace WS.Service.EvaluationServices
{
    public class RubricService
    {
        private readonly RubricRepository _repository;

        public RubricService(RubricRepository repository)
        {
            _repository = repository;
        }

        public async Task<Rubric> Create(RubricCreateDto request)
        {
            var query = await _repository.Create("sp_rubrics_create", request);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0
                ? MapRubric(query[0].Rows[0])
                : null;
        }

        public async Task<List<Rubric>> GetByContest(Guid contestId)
        {
            var list = new List<Rubric>();
            var query = await _repository.GetByContest("sp_rubrics_get_by_contest", contestId);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                    list.Add(MapRubric(row));
            }
            return list;
        }

        public Task<List<Rubric>> GetAll()
        {
            var sql = "SELECT * FROM rubrics ORDER BY criteria_order;";
            return QueryList(sql);
        }

        public async Task<Rubric> Update(Rubric rubric)
        {
            var sql = $@"
UPDATE rubrics SET 
    criterion_name = '{rubric.CriterionName.Replace("'", "''")}',
    description = {(rubric.Description != null ? $"'{rubric.Description.Replace("'", "''")}'" : "description")},
    max_score = {rubric.MaxScore.ToString(System.Globalization.CultureInfo.InvariantCulture)},
    weight = {rubric.Weight.ToString(System.Globalization.CultureInfo.InvariantCulture)},
    criteria_order = {rubric.CriteriaOrder}
WHERE id = '{rubric.Id}';
SELECT * FROM rubrics WHERE id = '{rubric.Id}'";
            var query = await _repository.QueryAsync(sql);
            return query != null && query.Count > 0 && query[0].Rows.Count > 0
                ? MapRubric(query[0].Rows[0])
                : null;
        }

        public async Task<bool> Delete(Guid id)
        {
            var sql = $@"DELETE FROM rubrics WHERE id = '{id}'";
            await _repository.QueryAsync(sql);
            return true;
        }

        private Task<List<Rubric>> QueryList(string sql)
        {
            return QueryListInternal(sql);
        }

        private async Task<List<Rubric>> QueryListInternal(string sql)
        {
            var list = new List<Rubric>();
            var query = await _repository.QueryAsync(sql);
            if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
            {
                foreach (System.Data.DataRow row in query[0].Rows)
                    list.Add(MapRubric(row));
            }
            return list;
        }

        private static Rubric MapRubric(System.Data.DataRow row)
        {
            return new Rubric
            {
                Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                ContestId = Guid.Parse(row["contest_id"].ToString() ?? Guid.Empty.ToString()),
                CriterionName = row["criterion_name"].ToString() ?? string.Empty,
                Description = row["description"] != DBNull.Value ? row["description"].ToString() : null,
                MaxScore = Convert.ToDecimal(row["max_score"]),
                Weight = Convert.ToDecimal(row["weight"]),
                CriteriaOrder = Convert.ToInt32(row["criteria_order"]),
                CreatedAt = Convert.ToDateTime(row["created_at"])
            };
        }
    }
}

