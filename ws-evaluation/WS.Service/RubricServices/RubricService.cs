using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Models;
using WS.Repositories.RubricRepositories;

namespace WS.Service.RubricServices
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
            Rubric rubric = new Rubric();
            try
            {
                var result = await _repository.Create("sp_rubrics_create", request);
                if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
                {
                    var row = result[0].Rows[0];
                    rubric.Id = Guid.Parse(row["id"].ToString());
                    rubric.ContestId = Guid.Parse(row["contest_id"].ToString());
                    rubric.CriterionName = row["criterion_name"].ToString();
                    rubric.Description = row["description"].ToString();
                    rubric.MaxScore = int.Parse(row["max_score"].ToString());
                    rubric.Weight = decimal.Parse(row["weight"].ToString());
                    rubric.CriteriaOrder = int.Parse(row["criteria_order"].ToString());
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating Rubric", ex);
            }
            return rubric;
        }

        public async Task<List<Rubric>> GetRubricsByContestId(Guid contestId)
        {
            List<Rubric> rubrics = new List<Rubric>();
            try
            {
                var result = await _repository.GetRubricByContestId("sp_rubrics_get_by_contest", contestId);
                if (result != null && result.Count > 0)
                {
                    foreach (System.Data.DataRow row in result[0].Rows)
                    {
                        Rubric rubric = new Rubric
                        {
                            Id = Guid.Parse(row["id"].ToString()),
                            ContestId = Guid.Parse(row["contest_id"].ToString()),
                            CriterionName = row["criterion_name"].ToString(),
                            Description = row["description"].ToString(),
                            MaxScore = int.Parse(row["max_score"].ToString()),
                            Weight = decimal.Parse(row["weight"].ToString()),
                            CriteriaOrder = int.Parse(row["criteria_order"].ToString())
                        };
                        rubrics.Add(rubric);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving Rubrics by ContestId", ex);
            }
            return rubrics;
        }
    }
}
