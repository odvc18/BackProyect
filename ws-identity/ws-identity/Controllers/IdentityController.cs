using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly UserService _service;
        private readonly IConfiguration _configuration;

        public IdentityController(UserService service, IConfiguration configuration)
        {
            _service = service;
            _configuration = configuration;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] UserCreateDto request)
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
        public async Task<IActionResult> Update([FromBody] UserUpdateDto request)
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Credenciales inválidas. El email y la contraseña son requeridos." });

            var user = await _service.GetByEmail(request.Email);
            if (user == null)
                return Unauthorized(new { message = "Credenciales incorrectas. El email no está registrado en el sistema." });

            // Nota: En producción, validar hash de contraseña con un verificador seguro
            // Por ahora, comparamos directamente porque en desarrollo las contraseñas están en texto plano
            if (!string.Equals(user.PasswordHash, request.Password, StringComparison.Ordinal))
                return Unauthorized(new { message = "Credenciales incorrectas. La contraseña no coincide." });

            var jwtKeyString = _configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(jwtKeyString))
            {
                return StatusCode(500, "Configuración JWT inválida (Jwt:Key).");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(jwtKeyString);

            var userRole = string.IsNullOrWhiteSpace(user.Role) ? "Viewer" : user.Role;

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, userRole),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var expiresAt = DateTime.UtcNow.AddHours(2);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiresAt,
                Issuer = _configuration["Jwt:Issuer"] ?? "EGOSCORE",
                Audience = _configuration["Jwt:Audience"] ?? "EGOSCORE",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                token = tokenString,
                user,
                expiresIn = (int)TimeSpan.FromHours(2).TotalSeconds
            });
        }

        [Authorize]
        [HttpGet("verify")]
        public async Task<IActionResult> Verify()
        {
            try
            {
                var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(JwtRegisteredClaimNames.Email);
                var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(sub))
                {
                    return Unauthorized(new { message = "Token inválido." });
                }

                // Obtener usuario completo desde la base de datos
                var user = await _service.GetByEmail(email);
                if (user == null)
                {
                    return Unauthorized(new { message = "Usuario no encontrado." });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al verificar token: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _service.GetAll();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener usuarios: {ex.Message}" });
            }
        }
    }
}
