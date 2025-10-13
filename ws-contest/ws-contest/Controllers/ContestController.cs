using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.ContestServices;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContestController : ControllerBase
    {
        private readonly ContestService _service;

        public ContestController(ContestService service)
        {
            _service = service;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromQuery] ContestCreateDto request)
        {
            var contest = await _service.Create(request);
            if (contest == null || contest.Id == Guid.Empty)
                return StatusCode(500, "Error creating contest.");
            return Ok(contest);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById([FromQuery] Guid id)
        {
            var contest = await _service.GetById(id);
            if (contest == null || contest.Id == Guid.Empty)
                return NotFound();
            return Ok(contest);
        }

        [HttpGet("GetByActive")]
        public async Task<IActionResult> GetByActive()
        {
            var contests = await _service.GetByActive();
            if (contests == null || contests.Count == 0)
                return NotFound();
            return Ok(contests);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] ContestUpdateDto request)
        {
            if (request == null)
                return BadRequest("Request body is null.");
            var contest = await _service.Update(request);
            if (contest == null || contest.Id == Guid.Empty)
                return StatusCode(500, "Error updating contest.");
            return Ok(contest);
        }
    }
}
