using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.UserServices;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly UserService _service;

        public IdentityController(UserService service)
        {
            _service = service;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromQuery] UserCreateDto request)
        {
            if (request == null)
                return BadRequest("Error al crear el usuario.");

            var response = await _service.Create(request);

            if (response == null)
                return NotFound();

            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromQuery] UserUpdateDto request)
        {
            var response = await _service.Update(request);

            if (response == null)
                return NotFound();

            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpDelete("Delete")]
        public async Task<IActionResult> Update([FromQuery] Guid request)
        {
            var response = await _service.Delete(request);

            if (!response)
                return NotFound();

            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpGet("GetByEmail")]
        public async Task<IActionResult> GetByEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest("El email es requerido.");
            var response = await _service.GetByEmail(email);
            if (response == null)
                return NotFound();
            return Ok(response);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("GetById")]
        public async Task<IActionResult> GetById([FromQuery] Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest("El id es requerido.");
            var response = await _service.GetById(id);
            if (response == null)
                return NotFound();
            return Ok(response);
        }
    }
}
