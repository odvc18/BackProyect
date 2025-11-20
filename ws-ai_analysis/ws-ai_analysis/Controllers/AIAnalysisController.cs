using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Service.WSServices;

namespace Controllers
{
    [ApiController]
    [Route("ai-analysis")]
    public class AIAnalysisController : ControllerBase
    {
        private readonly AnalysisRequestService _requestService;
        private readonly AnalysisResultService _resultService;

        public AIAnalysisController(AnalysisRequestService requestService, AnalysisResultService resultService)
        {
            _requestService = requestService;
            _resultService = resultService;
        }

        // requests
        [Authorize]
        [HttpPost("requests/Create")]
        public async Task<IActionResult> CreateRequest([FromBody] AnalysisRequestCreateDto request)
        {
            if (request == null) return BadRequest();
            var result = await _requestService.Create(request);
            if (result == null) return StatusCode(500, "No se pudo crear la solicitud");
            return Ok(result);
        }

        [Authorize]
        [HttpGet("requests/GetByStatus")]
        public async Task<IActionResult> GetRequestsByStatus([FromQuery] string status)
        {
            if (string.IsNullOrWhiteSpace(status)) return BadRequest();
            var list = await _requestService.GetByStatus(status);
            return Ok(list);
        }

        [Authorize]
        [HttpGet("requests/GetByFile")]
        public async Task<IActionResult> GetRequestsByFile([FromQuery] Guid submissionFileId)
        {
            if (submissionFileId == Guid.Empty) return BadRequest();
            var list = await _requestService.GetByFile(submissionFileId);
            return Ok(list);
        }

        [Authorize]
        [HttpGet("requests/GetAll")]
        public async Task<IActionResult> GetAllRequests()
        {
            var list = await _requestService.GetAll();
            return Ok(list);
        }

        [Authorize]
        [HttpPost("requests/UpdateStatus")]
        public async Task<IActionResult> UpdateRequestStatus([FromBody] dynamic body)
        {
            Guid id = Guid.Parse((string)body.id);
            string status = (string)body.status;
            string? errorMessage = body.errorMessage != null ? (string)body.errorMessage : null;
            var result = await _requestService.UpdateStatus(id, status, errorMessage);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("requests/Delete")]
        public async Task<IActionResult> DeleteRequest([FromQuery] Guid id)
        {
            if (id == Guid.Empty) return BadRequest();
            var ok = await _requestService.Delete(id);
            return Ok(ok);
        }

        // results
        [Authorize]
        [HttpPost("results/Create")]
        public async Task<IActionResult> CreateResult([FromBody] AnalysisResultCreateDto request)
        {
            if (request == null) return BadRequest();
            var result = await _resultService.Create(request);
            if (result == null) return StatusCode(500, "No se pudo crear el resultado");
            return Ok(result);
        }

        [Authorize]
        [HttpGet("results/GetByRequest")]
        public async Task<IActionResult> GetResultsByRequest([FromQuery] Guid requestId)
        {
            if (requestId == Guid.Empty) return BadRequest();
            var list = await _resultService.GetByRequest(requestId);
            return Ok(list);
        }

        [Authorize]
        [HttpGet("results/GetByFile")]
        public async Task<IActionResult> GetResultsByFile([FromQuery] Guid submissionFileId)
        {
            if (submissionFileId == Guid.Empty) return BadRequest();
            var list = await _resultService.GetByFile(submissionFileId);
            return Ok(list);
        }

        [Authorize]
        [HttpGet("results/GetAll")]
        public async Task<IActionResult> GetAllResults()
        {
            var list = await _resultService.GetAll();
            return Ok(list);
        }

        [Authorize]
        [HttpPost("results/Update")]
        public async Task<IActionResult> UpdateResult([FromBody] AnalysisResult result)
        {
            if (result == null || result.Id == Guid.Empty) return BadRequest();
            var updated = await _resultService.Update(result);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [Authorize]
        [HttpDelete("results/Delete")]
        public async Task<IActionResult> DeleteResult([FromQuery] Guid id)
        {
            if (id == Guid.Empty) return BadRequest();
            var ok = await _resultService.Delete(id);
            return Ok(ok);
        }

        // execute
        [Authorize]
        [HttpPost("execute")]
        public async Task<IActionResult> Execute([FromBody] dynamic body)
        {
            Guid submissionFileId = Guid.Parse((string)body.submissionFileId);
            string analysisType = (string)body.analysisType;
            var req = await _requestService.Execute(submissionFileId, analysisType);
            return Ok(req);
        }

        // metrics
        [Authorize]
        [HttpGet("metrics")]
        public async Task<IActionResult> GetMetrics()
        {
            var (total, completed, failed, pending, avg, byType) = await _requestService.GetMetrics();
            return Ok(new
            {
                totalRequests = total,
                completedRequests = completed,
                failedRequests = failed,
                pendingRequests = pending,
                averageProcessingTime = avg,
                analysisTypes = byType
            });
        }

        // summary
        [Authorize]
        [HttpGet("summary/GetBySubmission")]
        public async Task<IActionResult> GetSummaryBySubmission([FromQuery] Guid submissionId)
        {
            if (submissionId == Guid.Empty) return BadRequest();
            var (requests, results) = await _requestService.GetSummaryBySubmission(submissionId);
            return Ok(new
            {
                submissionId,
                totalAnalyses = requests.Count,
                completedAnalyses = requests.Count(r => r.Status == "Completed"),
                failedAnalyses = requests.Count(r => r.Status == "Failed"),
                pendingAnalyses = requests.Count(r => r.Status == "Pending"),
                results,
                requests
            });
        }
    }
}

