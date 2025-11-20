using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.ContestServices;
using System;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContestController : ControllerBase
    {
        private readonly ContestService _service;

        public ContestController(ContestService service)
        {
            _service = service;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] ContestCreateDto request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Request body is null." });
                var contest = await _service.Create(request);
                if (contest == null || contest.Id == Guid.Empty)
                    return StatusCode(500, new { message = "Error creating contest." });
                return Ok(contest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al crear concurso: {ex.Message}" });
            }
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById([FromQuery] Guid id)
        {
            try
            {
                var contest = await _service.GetById(id);
                if (contest == null || contest.Id == Guid.Empty)
                    return NotFound(new { message = "Concurso no encontrado." });
                return Ok(contest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener concurso: {ex.Message}" });
            }
        }

        [HttpGet("GetByActive")]
        public async Task<IActionResult> GetByActive()
        {
            try
            {
                var contests = await _service.GetByActive();
                // Si no hay concursos, devolvemos lista vacía para mejor UX en el frontend
                return Ok(contests ?? new List<WS.Infraestructure.Models.Contest>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener concursos: {ex.Message}" });
            }
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] ContestUpdateDto request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Request body is null." });
                var contest = await _service.Update(request);
                if (contest == null || contest.Id == Guid.Empty)
                    return StatusCode(500, new { message = "Error updating contest." });
                return Ok(contest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al actualizar concurso: {ex.Message}" });
            }
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete([FromQuery] Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                    return BadRequest(new { message = "El ID del concurso es requerido." });
                
                var result = await _service.Delete(id);
                if (!result)
                    return NotFound(new { message = "Concurso no encontrado o ya fue eliminado." });
                
                return Ok(new { message = "Concurso eliminado exitosamente.", success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al eliminar concurso: {ex.Message}" });
            }
        }
    }
}
