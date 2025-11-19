using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTO;
using WS.Repositories.AIAnalysisRepositories;

namespace WS.Service.AIAnalysisServices
{
    public class AIAnalysisService
    {
        private AIAnalysisRepository _repository;

        public AIAnalysisService(AIAnalysisRepository repository)
        {
            _repository = repository;
        }

        public async Task<AnalysisRequest> CreateAnalysisRequest(AnalysisRequestCreateDto request)
        {
            AnalysisRequest analysisRequest = new AnalysisRequest();
            try
            {
                var result = await _repository.CreateAnalysisRequest("sp_analysis_requests_create", request);
                if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
                {
                    var row = result[0].Rows[0];
                    analysisRequest.Id = Guid.Parse(row["id"].ToString()!);
                    analysisRequest.SubmissionFileId = Guid.Parse(row["submission_file_id"].ToString()!);
                    analysisRequest.FilePath = row["file_path"].ToString()!;
                    analysisRequest.AnalysisType = row["analysis_type"].ToString()!;
                    analysisRequest.Status = row["status"].ToString()!;
                    analysisRequest.RequestedAt = DateTime.Parse(row["requested_at"].ToString()!);
                    analysisRequest.StartedAt = row["started_at"] != DBNull.Value ? DateTime.Parse(row["started_at"].ToString()!) : null;
                    analysisRequest.CompletedAt = row["completed_at"] != DBNull.Value ? DateTime.Parse(row["completed_at"].ToString()!) : null;
                    analysisRequest.ErrorMessage = row["error_message"] != DBNull.Value ? row["error_message"].ToString() : null;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("AI Analysis request error creating", ex);
            }
            return analysisRequest;
        }

        public async Task<AnalysisRequest> UpdateAnalysisRequestStatus(AnalysisStatusUpdateDto request)
        {
            AnalysisRequest analysisRequest = new AnalysisRequest();
            try
            {
                var result = await _repository.UpdateAnalysisRequestStatus("sp_analysis_requests_update_status", request);
                if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
                {
                    var row = result[0].Rows[0];
                    analysisRequest.Id = Guid.Parse(row["id"].ToString()!);
                    analysisRequest.SubmissionFileId = Guid.Parse(row["submission_file_id"].ToString()!);
                    analysisRequest.FilePath = row["file_path"].ToString()!;
                    analysisRequest.AnalysisType = row["analysis_type"].ToString()!;
                    analysisRequest.Status = row["status"].ToString()!;
                    analysisRequest.RequestedAt = DateTime.Parse(row["requested_at"].ToString()!);
                    analysisRequest.StartedAt = row["started_at"] != DBNull.Value ? DateTime.Parse(row["started_at"].ToString()!) : null;
                    analysisRequest.CompletedAt = row["completed_at"] != DBNull.Value ? DateTime.Parse(row["completed_at"].ToString()!) : null;
                    analysisRequest.ErrorMessage = row["error_message"] != DBNull.Value ? row["error_message"].ToString() : null;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("AI Analysis request error updating status", ex);
            }

            return analysisRequest;
        }

        public async Task<AnalysisResult> CreateAnalysisResult(AnalysisResultCreateDto request)
        {
            AnalysisResult analysisResult = new AnalysisResult();
            try
            {
                var result = await _repository.CreateAnalysisResult("sp_analysis_results_create", request);
                if (result != null && result.Count > 0 && result[0].Rows.Count > 0)
                {
                    var row = result[0].Rows[0];
                    analysisResult.Id = Guid.Parse(row["id"].ToString()!);
                    analysisResult.AnalysisRequestId = Guid.Parse(row["analysis_request_id"].ToString()!);
                    analysisResult.ResultType = row["result_type"].ToString()!;
                    analysisResult.ResultData = row["result_data"].ToString()!;
                    analysisResult.ConfidenceScore = row["confidence_score"] != DBNull.Value ? decimal.Parse(row["confidence_score"].ToString()!) : null;
                    analysisResult.Metadata = row["metadata"] != DBNull.Value ? row["metadata"].ToString() : null;
                    analysisResult.CreatedAt = DateTime.Parse(row["created_at"].ToString()!);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("AI Analysis request error creating result", ex);
            }
            return analysisResult;
        }

        public async Task<List<AnalysisResult>> GetAnalysisResultsByRequestId(Guid analysisRequestId)
        {
            List<AnalysisResult> analysisResults = new List<AnalysisResult>();
            try
            {
                var result = await _repository.GetAnalysisResultsByRequestId("sp_analysis_results_get_by_request_id", analysisRequestId);
                if (result != null && result.Count > 0)
                {
                    foreach (System.Data.DataRow row in result[0].Rows)
                    {
                        AnalysisResult analysisResult = new AnalysisResult
                        {
                            Id = Guid.Parse(row["id"].ToString()!),
                            AnalysisRequestId = Guid.Parse(row["analysis_request_id"].ToString()!),
                            ResultType = row["result_type"].ToString()!,
                            ResultData = row["result_data"].ToString()!,
                            ConfidenceScore = row["confidence_score"] != DBNull.Value ? decimal.Parse(row["confidence_score"].ToString()!) : null,
                            Metadata = row["metadata"] != DBNull.Value ? row["metadata"].ToString() : null,
                            CreatedAt = DateTime.Parse(row["created_at"].ToString()!)
                        };
                        analysisResults.Add(analysisResult);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("AI Analysis request error retrieving results", ex);
            }
            return analysisResults;
        }

        public async Task<List<AnalysisResult>> GetAnalysisResultByStatus(string status)
        {
            List<AnalysisResult> analysisResults = new List<AnalysisResult>();
            try
            {
                var result = await _repository.GetAnalysisResultsByStatus("sp_analysis_requests_get_by_status", status);
                if (result != null && result.Count > 0)
                {
                    foreach (System.Data.DataRow row in result[0].Rows)
                    {
                        AnalysisResult analysisResult = new AnalysisResult
                        {
                            Id = Guid.Parse(row["id"].ToString()!),
                            AnalysisRequestId = Guid.Parse(row["analysis_request_id"].ToString()!),
                            ResultType = row["result_type"].ToString()!,
                            ResultData = row["result_data"].ToString()!,
                            ConfidenceScore = row["confidence_score"] != DBNull.Value ? decimal.Parse(row["confidence_score"].ToString()!) : null,
                            Metadata = row["metadata"] != DBNull.Value ? row["metadata"].ToString() : null,
                            CreatedAt = DateTime.Parse(row["created_at"].ToString()!)
                        };
                        analysisResults.Add(analysisResult);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("AI Analysis request error retrieving result by Id", ex);
            }
            return analysisResults;
        }
    }
}
