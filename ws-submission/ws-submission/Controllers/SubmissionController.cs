using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Service.SubmissionServices;

namespace Controllers
{
    [ApiController]
    [Route("api/submission")]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionService _service;

        public SubmissionController(SubmissionService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] SubmissionCreateDto request)
        {
            try
            {
                if (request == null) 
                    return BadRequest(new { message = "Request inválido." });
                
                var result = await _service.Create(request);
                if (result == null) 
                    return StatusCode(500, new { message = "Error creando submission." });
                
                return Ok(result);
            }
            catch (Microsoft.Data.SqlClient.SqlException ex)
            {
                // Capturar errores SQL específicos
                if (ex.Number == 51000) // Error personalizado del stored procedure
                {
                    return BadRequest(new { message = ex.Message });
                }
                return StatusCode(500, new { message = $"Error de base de datos: {ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al crear submission: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpPost("Submit")]
        public async Task<IActionResult> Submit([FromQuery] Guid submissionId)
        {
            if (submissionId == Guid.Empty) return BadRequest("submissionId requerido.");
            var result = await _service.Submit(submissionId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [Authorize]
        [HttpGet("GetById")]
        public async Task<IActionResult> GetById([FromQuery] string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return BadRequest(new { message = "El ID de la submission es requerido." });

                if (!Guid.TryParse(id, out Guid parsedId) || parsedId == Guid.Empty)
                    return BadRequest(new { message = "El ID de la submission no es un GUID válido." });

                var result = await _service.GetById(parsedId);
                if (result == null) 
                    return NotFound(new { message = "Submission no encontrada." });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener submission: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("GetByContest")]
        public async Task<IActionResult> GetByContest([FromQuery] Guid contestId)
        {
            if (contestId == Guid.Empty) return BadRequest("contestId requerido.");
            var result = await _service.GetByContest(contestId);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("GetByParticipant")]
        public async Task<IActionResult> GetByParticipant([FromQuery] Guid participantId)
        {
            if (participantId == Guid.Empty) return BadRequest("participantId requerido.");
            var result = await _service.GetByParticipant(participantId);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] Submission request)
        {
            if (request == null || request.Id == Guid.Empty) return BadRequest("Payload inválido.");
            var result = await _service.Update(request);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [Authorize]
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAll();
            return Ok(result ?? new List<Submission>());
        }

        [Authorize]
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete([FromQuery] Guid id)
        {
            if (id == Guid.Empty) return BadRequest("id requerido.");
            var ok = await _service.Delete(id);
            return Ok(ok);
        }
    }
}

