using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models;
using WS.Service.RubricServices;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RubricController : ControllerBase
    {
        private readonly RubricService _service;
        public RubricController(RubricService service)
        {
            _service = service;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(RubricCreateDto request)
        {
            try
            {
                var created = await _service.Create(request);
                if (created == null || created.Id == Guid.Empty)
                    return BadRequest("No se pudo crear el criterio de rúbrica.");
                return CreatedAtAction(nameof(GetByContestId), new { contestId = request.ContestId }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("GetByContestId")]
        public async Task<IActionResult> GetByContestId(Guid contestId)
        {
            try
            {
                var rubric = await _service.GetRubricsByContestId(contestId);
                if (rubric == null || rubric.Count == 0)
                    return NotFound();
                return Ok(rubric);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
