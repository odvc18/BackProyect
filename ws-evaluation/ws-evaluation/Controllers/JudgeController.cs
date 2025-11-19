using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.JudgeServices;
using WS.Service.ScoresServices;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class JudgeController : ControllerBase
    {
        private readonly JudgeService _service;

        public JudgeController(JudgeService service)
        {
            _service = service;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(JudgeAssignmentCreateDto request)
        {
            try
            {
                var created = await _service.Create(request);
                if (created == null || created.Id == Guid.Empty)
                    return BadRequest("No se pudo crear la asignación de juez.");
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
                var assignment = await _service.GetAssignmentsByJudgeId(id);
                if (assignment == null)
                    return NotFound();
                return Ok(assignment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetAssignmentsByJudgeId")]
        public async Task<IActionResult> GetAssignmentsByJudgeId(Guid judgeId)
        {
            try
            {
                var assignments = await _service.GetAssignmentsByJudgeId(judgeId);
                if (assignments == null || assignments.Count == 0)
                    return NotFound();
                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
