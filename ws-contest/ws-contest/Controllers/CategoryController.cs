using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.CategoryServices;
using System;

namespace Controllers
{
    [ApiController]
    [Route("api/contest/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _service;

        public CategoryController(CategoryService service)
        {
            _service = service;
        }

        [HttpGet("GetByContest")]
        public async Task<IActionResult> GetByContest([FromQuery] Guid contestId)
        {
            try
            {
                var categories = await _service.GetByContestId(contestId);
                // Si no hay categorías, devolvemos lista vacía para mejor UX en el frontend
                return Ok(categories ?? new List<WS.Infraestructure.Models.Category>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener categorías: {ex.Message}" });
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CategoryCreateDto request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Request body is null." });
                var category = await _service.Create(request);
                if (category == null || category.Id == Guid.Empty)
                    return StatusCode(500, new { message = "Error creating category." });
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al crear categoría: {ex.Message}" });
            }
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody] WS.Infraestructure.Models.Category request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Request body is null." });
                var category = await _service.Update(request);
                if (category == null || category.Id == Guid.Empty)
                    return StatusCode(500, new { message = "Error updating category." });
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al actualizar categoría: {ex.Message}" });
            }
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete([FromQuery] Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                    return BadRequest(new { message = "El ID de la categoría es requerido." });
                
                var result = await _service.Delete(id);
                if (!result)
                    return NotFound(new { message = "Categoría no encontrada o ya fue eliminada." });
                
                return Ok(new { message = "Categoría eliminada exitosamente.", success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al eliminar categoría: {ex.Message}" });
            }
        }
    }
}
