using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Service.SubmissionServices;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Controllers
{
    [ApiController]
    [Route("api/submission/files")]
    public class SubmissionFilesController : ControllerBase
    {
        private readonly SubmissionFileService _service;
        private readonly SubmissionService _submissionService;
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpClientFactory _httpClientFactory;

        public SubmissionFilesController(
            SubmissionFileService service,
            SubmissionService submissionService,
            IWebHostEnvironment environment,
            IHttpClientFactory httpClientFactory)
        {
            _service = service;
            _submissionService = submissionService;
            _environment = environment;
            _httpClientFactory = httpClientFactory;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] SubmissionFileCreateDto request)
        {
            if (request == null) return BadRequest("Request inválido.");
            var result = await _service.Create(request);
            if (result == null) return StatusCode(500, "Error creando archivo.");
            return Ok(result);
        }

        [Authorize]
        [HttpGet("GetBySubmission")]
        public async Task<IActionResult> GetBySubmission([FromQuery] Guid submissionId)
        {
            if (submissionId == Guid.Empty) return BadRequest("submissionId requerido.");
            var result = await _service.GetBySubmission(submissionId);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("Download")]
        public async Task<IActionResult> Download([FromQuery] string filePath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(filePath))
                    return BadRequest(new { message = "La ruta del archivo es requerida." });

                // Obtener el archivo de la base de datos
                var file = await _service.GetByStoredPath(filePath);
                if (file == null)
                    return NotFound(new { message = "Archivo no encontrado." });

                // Obtener la submission para validar permisos
                var submission = await _submissionService.GetById(file.SubmissionId);
                if (submission == null)
                    return NotFound(new { message = "Submission no encontrada." });

                // Validar permisos del usuario
                // Intentar obtener el userId de diferentes claims
                var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub) 
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue("sub");
                
                // Intentar obtener el rol de diferentes claims
                var userRole = User.FindFirstValue(ClaimTypes.Role)
                    ?? User.FindFirstValue("role")
                    ?? User.FindFirstValue(JwtRegisteredClaimNames.Name);

                // Log para debugging
                Console.WriteLine($"Download - UserIdClaim: {userIdClaim}, UserRole: {userRole}");
                var allClaims = string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"));
                Console.WriteLine($"Download - All claims: {allClaims}");

                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
                {
                    Console.WriteLine($"Download - Error: No se pudo obtener o parsear el userId. Claim value: {userIdClaim}");
                    return Unauthorized(new { message = "Usuario no autenticado correctamente." });
                }

                // Verificar permisos: Admin, participante, o juez asignado
                bool hasPermission = false;

                // Normalizar el rol para comparación (case-insensitive)
                var normalizedRole = userRole?.Trim() ?? string.Empty;

                // Admin puede ver todo
                if (string.Equals(normalizedRole, "Admin", StringComparison.OrdinalIgnoreCase))
                {
                    hasPermission = true;
                }
                // Participante puede ver sus propias submissions
                else if (submission.ParticipantId == userId)
                {
                    hasPermission = true;
                }
                // Juez asignado puede ver archivos de submissions asignadas
                else if (string.Equals(normalizedRole, "Judge", StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        var httpClient = _httpClientFactory.CreateClient();
                        var authHeader = Request.Headers["Authorization"].ToString();
                        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                        {
                            var token = authHeader.Substring(7);
                            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                        }
                        
                        var response = await httpClient.GetAsync($"http://localhost:5004/api/evaluation/assignments/GetBySubmission?submissionId={submission.Id}");
                        if (response.IsSuccessStatusCode)
                        {
                            var json = await response.Content.ReadAsStringAsync();
                            var assignments = JsonSerializer.Deserialize<List<JudgeAssignmentInfo>>(json, new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true
                            });

                            // Comparar JudgeId como Guid
                            hasPermission = assignments?.Any(a => 
                                Guid.TryParse(a.JudgeId, out Guid judgeId) && judgeId == userId
                            ) ?? false;
                        }
                    }
                    catch (Exception ex)
                    {
                        // Si falla la llamada al servicio de evaluación, denegar acceso
                        // Log del error para debugging
                        Console.WriteLine($"Error verificando asignación de juez: {ex.Message}");
                        hasPermission = false;
                    }
                }

                if (!hasPermission)
                    return Forbid("No tienes permisos para descargar este archivo.");

                // Construir la ruta física del archivo
                // El storedPath tiene formato: contestId/categoryId/participantId/fileName
                var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads");
                var physicalPath = Path.Combine(uploadsFolder, filePath.Replace("/", "\\"));

                // Verificar que el archivo existe
                if (!System.IO.File.Exists(physicalPath))
                    return NotFound(new { message = "El archivo físico no se encuentra en el servidor." });

                // Determinar el tipo MIME
                var mimeType = file.MimeType;
                if (string.IsNullOrEmpty(mimeType))
                {
                    var extension = Path.GetExtension(file.OriginalName)?.ToLower();
                    mimeType = extension switch
                    {
                        ".pdf" => "application/pdf",
                        ".doc" => "application/msword",
                        ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        ".jpg" => "image/jpeg",
                        ".jpeg" => "image/jpeg",
                        ".png" => "image/png",
                        ".gif" => "image/gif",
                        ".mp4" => "video/mp4",
                        ".avi" => "video/x-msvideo",
                        ".mov" => "video/quicktime",
                        _ => "application/octet-stream"
                    };
                }

                // Leer el archivo y devolverlo
                var fileBytes = await System.IO.File.ReadAllBytesAsync(physicalPath);
                return File(fileBytes, mimeType, file.OriginalName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al descargar el archivo: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete([FromQuery] Guid id)
        {
            if (id == Guid.Empty) return BadRequest("id requerido.");
            var ok = await _service.Delete(id);
            return Ok(ok);
        }

        [Authorize]
        [HttpPost("Upload")]
        [Consumes("multipart/form-data")]
        [RequestFormLimits(MultipartBodyLengthLimit = 104857600, ValueLengthLimit = int.MaxValue, MultipartHeadersLengthLimit = int.MaxValue)]
        public async Task<IActionResult> Upload([FromForm] string submissionId, IFormFile file)
        {
            try
            {
                // Log para debugging
                Console.WriteLine($"Upload endpoint called. Content-Type: {Request.ContentType}");
                Console.WriteLine($"SubmissionId: {submissionId}");
                Console.WriteLine($"File is null: {file == null}");
                if (file != null)
                {
                    Console.WriteLine($"File name: {file.FileName}, Length: {file.Length}");
                }

                if (string.IsNullOrWhiteSpace(submissionId))
                    return BadRequest(new { message = "El ID de la submission es requerido." });

                if (!Guid.TryParse(submissionId, out Guid parsedSubmissionId) || parsedSubmissionId == Guid.Empty)
                    return BadRequest(new { message = "El ID de la submission no es un GUID válido." });

                if (file == null)
                    return BadRequest(new { message = "El archivo es requerido." });

                // Obtener la submission para validar y obtener información
                var submission = await _submissionService.GetById(parsedSubmissionId);
                if (submission == null)
                    return NotFound(new { message = "Submission no encontrada." });

                // Validar tipo de archivo y tamaño según la categoría
                var validationResult = await ValidateFile(file, submission.CategoryId, submission.ContestId);
                if (!validationResult.IsValid)
                    return BadRequest(new { message = validationResult.ErrorMessage });

                // Crear estructura de carpetas: id_contest/id_category/id_participant/
                var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads");
                var contestFolder = Path.Combine(uploadsFolder, submission.ContestId.ToString());
                var categoryFolder = Path.Combine(contestFolder, submission.CategoryId.ToString());
                var participantFolder = Path.Combine(categoryFolder, submission.ParticipantId.ToString());
                
                // Crear directorios si no existen
                if (!Directory.Exists(participantFolder))
                {
                    Directory.CreateDirectory(participantFolder);
                }

                // Mantener el nombre original del archivo
                var originalFileName = file.FileName;
                // Sanitizar el nombre del archivo para evitar problemas con caracteres especiales
                var sanitizedFileName = string.Join("_", originalFileName.Split(Path.GetInvalidFileNameChars()));
                var filePath = Path.Combine(participantFolder, sanitizedFileName);

                // Si el archivo ya existe, agregar un número al final
                var counter = 1;
                var baseFileName = Path.GetFileNameWithoutExtension(sanitizedFileName);
                var fileExtension = Path.GetExtension(sanitizedFileName);
                while (System.IO.File.Exists(filePath))
                {
                    var newFileName = $"{baseFileName}_{counter}{fileExtension}";
                    filePath = Path.Combine(participantFolder, newFileName);
                    sanitizedFileName = newFileName;
                    counter++;
                }

                // Guardar el archivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Crear registro en la base de datos
                var storedPath = Path.Combine(submission.ContestId.ToString(), submission.CategoryId.ToString(), submission.ParticipantId.ToString(), sanitizedFileName)
                    .Replace("\\", "/"); // Usar / para rutas web

                var createDto = new SubmissionFileCreateDto
                {
                    SubmissionId = parsedSubmissionId,
                    FileName = sanitizedFileName,
                    OriginalName = originalFileName,
                    StoredPath = storedPath,
                    FileSize = file.Length,
                    MimeType = file.ContentType
                };

                var result = await _service.Create(createDto);
                if (result == null)
                    return StatusCode(500, new { message = "Error al crear registro del archivo." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log del error completo para debugging
                Console.WriteLine($"Error al subir archivo: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"InnerException: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = $"Error al subir archivo: {ex.Message}" });
            }
        }

        private async Task<(bool IsValid, string ErrorMessage)> ValidateFile(IFormFile file, Guid categoryId, Guid contestId)
        {
            try
            {
                // Validación básica de extensión
                var fileExtension = Path.GetExtension(file.FileName)?.ToLower().TrimStart('.');
                if (string.IsNullOrEmpty(fileExtension))
                {
                    return (false, "El archivo no tiene una extensión válida.");
                }

                // Obtener información de la categoría desde ws-contest
                string? allowedFileTypes = null;
                int maxFileSizeMb = 100; // Por defecto

                try
                {
                    var httpClient = _httpClientFactory.CreateClient();
                    var response = await httpClient.GetAsync($"http://localhost:5002/api/contest/categories/GetByContest?contestId={contestId}");
                    
                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        var categories = JsonSerializer.Deserialize<List<CategoryInfo>>(json, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        var category = categories?.FirstOrDefault(c => c.Id == categoryId.ToString());
                        if (category != null)
                        {
                            allowedFileTypes = category.AllowedFileTypes;
                            maxFileSizeMb = category.MaxFileSizeMb;
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Si falla la llamada, usamos validación básica
                    // Log del error para debugging (opcional)
                    Console.WriteLine($"Error obteniendo información de categoría: {ex.Message}");
                }

                // Validación de tamaño
                var maxSizeBytes = maxFileSizeMb * 1024 * 1024;
                if (file.Length > maxSizeBytes)
                {
                    return (false, $"El archivo excede el tamaño máximo permitido ({maxFileSizeMb}MB).");
                }

                // Validación de tipos permitidos
                if (!string.IsNullOrEmpty(allowedFileTypes))
                {
                    var allowedExtensions = allowedFileTypes.Split(',')
                        .Select(t => t.Trim().ToLower())
                        .ToList();
                    
                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return (false, $"El tipo de archivo '{fileExtension}' no está permitido. Tipos permitidos: {allowedFileTypes}");
                    }
                }
                else
                {
                    // Validación básica si no hay información de categoría
                    var defaultAllowedExtensions = new[] { "pdf", "doc", "docx", "jpg", "jpeg", "png", "gif", "mp4", "avi", "mov" };
                    if (!defaultAllowedExtensions.Contains(fileExtension))
                    {
                        return (false, $"El tipo de archivo '{fileExtension}' no está permitido.");
                    }
                }

                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                return (false, $"Error al validar archivo: {ex.Message}");
            }
        }

        private class CategoryInfo
        {
            public string Id { get; set; } = string.Empty;
            public string? AllowedFileTypes { get; set; }
            public int MaxFileSizeMb { get; set; }
        }

        private class JudgeAssignmentInfo
        {
            public string Id { get; set; } = string.Empty;
            public string JudgeId { get; set; } = string.Empty;
            public string SubmissionId { get; set; } = string.Empty;
            public string ContestId { get; set; } = string.Empty;
            public string Status { get; set; } = string.Empty;
        }
    }
}

