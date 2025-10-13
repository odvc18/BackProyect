using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models.DTOs;
using WS.Service.CategoryServices;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _service;

        public CategoryController(CategoryService service)
        {
            _service = service;
        }

        [HttpGet("GetByContest")]
        public async Task<IActionResult> GetByContest([FromQuery] Guid id)
        {
            var categories = await _service.GetByContestId(id);
            if (categories == null || categories.Count == 0)
                return NotFound();
            return Ok(categories);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CategoryCreateDto request)
        {
            if (request == null)
                return BadRequest("Request body is null.");
            var category = await _service.Create(request);
            if (category == null || category.Id == Guid.Empty)
                return StatusCode(500, "Error creating category.");
            return Ok(category);
        }
    }
}
