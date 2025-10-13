using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Repositories.CategoryRepositories;
using WS.Repositories.ContestRepositories;

namespace WS.Service.ContestServices
{
    public class ContestService
    {
        private readonly ContestRepository _repository;

        public ContestService(ContestRepository repository)
        {
            _repository = repository;
        }

        public async Task<Contest> Create(ContestCreateDto request)
        {
            Contest contest = new Contest();
            try
            {
                var query = await _repository.Create("sp_contests_create", request);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    contest.Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString());
                    contest.Title = row["title"].ToString() ?? string.Empty;
                    contest.Description = row["description"].ToString() ?? string.Empty;
                    contest.Rules = row["rules"].ToString() ?? string.Empty;
                    contest.Status = row["status"].ToString() ?? string.Empty;
                    contest.StartDate = Convert.ToDateTime(row["start_date"]);
                    contest.EndDate = Convert.ToDateTime(row["end_date"]);
                    contest.JudgingDate = row["judging_date"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["judging_date"]) : null;
                    contest.MaxSubmissionsPerParticipant = Convert.ToInt32(row["max_submissions_per_participant"]);
                    contest.CreatedByUserId = Guid.Parse(row["created_by_user_id"].ToString() ?? Guid.Empty.ToString());
                    contest.CreatedAt = Convert.ToDateTime(row["created_at"]);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return contest;
        }

        public async Task<Contest> GetById(Guid id)
        {
            Contest contest = new Contest();
            try
            {
                var query = await _repository.GetById("sp_contests_get_by_id", id);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    contest.Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString());
                    contest.Title = row["title"].ToString() ?? string.Empty;
                    contest.Description = row["description"].ToString() ?? string.Empty;
                    contest.Rules = row["rules"].ToString() ?? string.Empty;
                    contest.Status = row["status"].ToString() ?? string.Empty;
                    contest.StartDate = Convert.ToDateTime(row["start_date"]);
                    contest.EndDate = Convert.ToDateTime(row["end_date"]);
                    contest.JudgingDate = row["judging_date"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["judging_date"]) : null;
                    contest.MaxSubmissionsPerParticipant = Convert.ToInt32(row["max_submissions_per_participant"]);
                    contest.CreatedByUserId = Guid.Parse(row["created_by_user_id"].ToString() ?? Guid.Empty.ToString());
                    contest.CreatedAt = Convert.ToDateTime(row["created_at"]);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return contest;
        }

        public async Task<List<Contest>> GetByActive()
        {
            List<Contest> contests = new List<Contest>();
            try
            {
                var query = await _repository.GetByActive("sp_contests_get_by_active");
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    foreach (System.Data.DataRow row in query[0].Rows)
                    {
                        Contest contest = new Contest
                        {
                            Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString()),
                            Title = row["title"].ToString() ?? string.Empty,
                            Description = row["description"].ToString() ?? string.Empty,
                            Rules = row["rules"].ToString() ?? string.Empty,
                            Status = row["status"].ToString() ?? string.Empty,
                            StartDate = Convert.ToDateTime(row["start_date"]),
                            EndDate = Convert.ToDateTime(row["end_date"]),
                            JudgingDate = row["judging_date"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["judging_date"]) : null,
                            MaxSubmissionsPerParticipant = Convert.ToInt32(row["max_submissions_per_participant"]),
                            CreatedByUserId = Guid.Parse(row["created_by_user_id"].ToString() ?? Guid.Empty.ToString()),
                            CreatedAt = Convert.ToDateTime(row["created_at"])
                        };
                        contests.Add(contest);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return contests;
        }

        public async Task<Contest> Update(ContestUpdateDto request)
        {
            Contest contest = new Contest();
            try
            {
                var query = await _repository.Update("sp_contests_update", request);
                if (query != null && query.Count > 0 && query[0].Rows.Count > 0)
                {
                    var row = query[0].Rows[0];
                    contest.Id = Guid.Parse(row["id"].ToString() ?? Guid.Empty.ToString());
                    contest.Title = row["title"].ToString() ?? string.Empty;
                    contest.Description = row["description"].ToString() ?? string.Empty;
                    contest.Rules = row["rules"].ToString() ?? string.Empty;
                    contest.Status = row["status"].ToString() ?? string.Empty;
                    contest.StartDate = Convert.ToDateTime(row["start_date"]);
                    contest.EndDate = Convert.ToDateTime(row["end_date"]);
                    contest.JudgingDate = row["judging_date"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(row["judging_date"]) : null;
                    contest.MaxSubmissionsPerParticipant = Convert.ToInt32(row["max_submissions_per_participant"]);
                    contest.CreatedByUserId = Guid.Parse(row["created_by_user_id"].ToString() ?? Guid.Empty.ToString());
                    contest.CreatedAt = Convert.ToDateTime(row["created_at"]);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return contest;
        }
    }
}
