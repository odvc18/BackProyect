using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.ScoresServices;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly ScoreService _service;
        
        public ScoreController(ScoreService service)
        {
            _service = service;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(ScoreCreateDto request)
        {
            try
            {
                var created = await _service.Create(request);
                if (created == null || created.Id == Guid.Empty)
                    return BadRequest("No se pudo crear la submission.");
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var score = await _service.GetScoresByAssignmentId(id);
                if (score == null)
                    return NotFound();
                return Ok(score);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
