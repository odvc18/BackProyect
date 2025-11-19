using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTO;
using WS.Service.AIAnalysisServices;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AIAnalysisController : ControllerBase
    {
        private readonly AIAnalysisService _service;

        public AIAnalysisController(AIAnalysisService service)
        {
            _service = service;
        }

        [HttpPost("CreateAnalysisRequest")]
        public async Task<IActionResult> CreateAnalysisRequest([FromBody] AnalysisRequestCreateDto request)
        {
            try
            {
                var result = await _service.CreateAnalysisRequest(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("UpdateAnalysisRequestStatus")]
        public async Task<IActionResult> UpdateAnalysisRequestStatus([FromBody] AnalysisStatusUpdateDto request)
        {
            try
            {
                var result = await _service.UpdateAnalysisRequestStatus(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("CreateAnalysisResult")]
        public async Task<IActionResult> CreateAnalysisResult([FromBody] AnalysisResultCreateDto result)
        {
            try
            {
                var createdResult = await _service.CreateAnalysisResult(result);
                return Ok(createdResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetAnalysisResultsByRequestId")]
        public async Task<IActionResult> GetAnalysisResultsByRequestId(Guid analysisRequestId)
        {
            try
            {
                var results = await _service.GetAnalysisResultsByRequestId(analysisRequestId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetAnalysisResultByStatus")]
        public async Task<IActionResult> GetAnalysisResultByStatus(string status)
        {
            try
            {
                var results = await _service.GetAnalysisResultByStatus(status);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
