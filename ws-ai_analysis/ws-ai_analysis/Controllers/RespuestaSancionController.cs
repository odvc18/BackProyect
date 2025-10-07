using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.WS.RespuestaSancion;
using WS.Service.WSServices;

namespace WS.Cobranzas.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RespuestaSancionController : ControllerBase
    {
        private readonly RespuestaSancionService _service;

        public RespuestaSancionController(RespuestaSancionService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtiene la respuesta de sanción para un proceso específico.
        /// </summary>
        [HttpGet("RespuestaSancion")]
        public async Task<IActionResult> GetRespuestaSancion([FromQuery] RespuestaSancionRequest request)
        {
            if (request == null || request.IdProceso <= 0)
                return BadRequest("Parámetro IdProceso es requerido y debe ser mayor a cero.");

            var response = await _service.RespuestaSancionAsync(request);

            if (response == null)
                return NotFound();

            return Ok(response);
        }

        /// <summary>
        /// Obtiene la respuesta de sanción masiva.
        /// </summary>
        [HttpGet("RespuestaSancionMasiva")]
        public async Task<IActionResult> GetRespuestaSancionMasiva()
        {
            var response = await _service.RespuestaSancionMasivaAsync();

            if (response == null || response.Count == 0)
                return NotFound();

            return Ok(response);
        }
    }
}
