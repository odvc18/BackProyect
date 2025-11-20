using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;
using WS.Service.EvaluationServices;
using System;
using System.Linq;

namespace Controllers
{
    [ApiController]
    [Route("api/evaluation")]
    public class EvaluationController : ControllerBase
    {
        private readonly JudgeAssignmentService _assignmentService;
        private readonly ScoreService _scoreService;
        private readonly RubricService _rubricService;

        public EvaluationController(
            JudgeAssignmentService assignmentService,
            ScoreService scoreService,
            RubricService rubricService)
        {
            _assignmentService = assignmentService;
            _scoreService = scoreService;
            _rubricService = rubricService;
        }

        // assignments
        [Authorize]
        [HttpPost("assignments/Create")]
        public async Task<IActionResult> CreateAssignment([FromBody] JudgeAssignmentCreateDto request)
        {
            try
            {
                if (request == null) 
                    return BadRequest(new { message = "Request inválido." });
                
                var result = await _assignmentService.Create(request);
                if (result == null) 
                    return StatusCode(500, new { message = "No se pudo crear la asignación." });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al crear asignación: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("assignments/GetByJudge")]
        public async Task<IActionResult> GetAssignmentsByJudge([FromQuery] string judgeId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(judgeId))
                    return BadRequest(new { message = "El ID del juez es requerido." });

                if (!Guid.TryParse(judgeId, out Guid parsedJudgeId) || parsedJudgeId == Guid.Empty)
                    return BadRequest(new { message = "El ID del juez no es un GUID válido." });
                
                var result = await _assignmentService.GetByJudge(parsedJudgeId);
                return Ok(result ?? new List<JudgeAssignment>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener asignaciones: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("assignments/GetBySubmission")]
        public async Task<IActionResult> GetAssignmentsBySubmission([FromQuery] Guid submissionId)
        {
            try
            {
                if (submissionId == Guid.Empty) 
                    return BadRequest(new { message = "El ID de la submission es requerido." });
                
                var result = await _assignmentService.GetBySubmission(submissionId);
                return Ok(result ?? new List<JudgeAssignment>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener asignaciones: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("assignments/GetAll")]
        public async Task<IActionResult> GetAllAssignments()
        {
            try
            {
                var result = await _assignmentService.GetAll();
                return Ok(result ?? new List<JudgeAssignment>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener asignaciones: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpPost("assignments/UpdateStatus")]
        public async Task<IActionResult> UpdateAssignmentStatus([FromBody] JudgeAssignmentUpdateStatusDto request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Request inválido." });

                if (string.IsNullOrWhiteSpace(request.Id))
                    return BadRequest(new { message = "El ID de la asignación es requerido." });

                if (!Guid.TryParse(request.Id, out Guid id) || id == Guid.Empty)
                    return BadRequest(new { message = "El ID de la asignación no es un GUID válido." });

                if (string.IsNullOrWhiteSpace(request.Status))
                    return BadRequest(new { message = "El estado es requerido." });

                // Validar que el estado sea válido
                var validStatuses = new[] { "Assigned", "InProgress", "Completed", "Cancelled" };
                if (!validStatuses.Contains(request.Status))
                    return BadRequest(new { message = $"El estado '{request.Status}' no es válido. Estados permitidos: {string.Join(", ", validStatuses)}" });

                var result = await _assignmentService.UpdateStatus(id, request.Status);
                if (result == null)
                    return NotFound(new { message = "Asignación no encontrada." });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al actualizar el estado: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpDelete("assignments/Delete")]
        public async Task<IActionResult> DeleteAssignment([FromQuery] Guid id)
        {
            if (id == Guid.Empty) return BadRequest();
            var ok = await _assignmentService.Delete(id);
            return Ok(ok);
        }

        // scores
        [Authorize]
        [HttpPost("scores/Create")]
        public async Task<IActionResult> CreateScore([FromBody] ScoreCreateDto request)
        {
            try
            {
                if (request == null) 
                    return BadRequest(new { message = "Request inválido." });

                // Validar que el score esté en el rango válido (0-10)
                if (request.Score < 0 || request.Score > 10)
                    return BadRequest(new { message = "El score debe estar entre 0 y 10." });

                // Validar que la asignación exista y no esté completada
                var assignment = await _assignmentService.GetById(request.JudgeAssignmentId);
                if (assignment == null)
                    return NotFound(new { message = "Asignación no encontrada." });
                
                if (assignment.Status == "Completed")
                    return BadRequest(new { message = "No se puede agregar scores a una asignación ya completada." });
                
                var result = await _scoreService.Create(request);
                if (result == null) 
                    return StatusCode(500, new { message = "No se pudo crear el score." });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al crear score: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("scores/GetByAssignment")]
        public async Task<IActionResult> GetScoresByAssignment([FromQuery] Guid assignmentId)
        {
            if (assignmentId == Guid.Empty) return BadRequest();
            var result = await _scoreService.GetByAssignment(assignmentId);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("scores/GetBySubmission")]
        public async Task<IActionResult> GetScoresBySubmission([FromQuery] Guid submissionId)
        {
            if (submissionId == Guid.Empty) return BadRequest();
            var result = await _scoreService.GetBySubmission(submissionId);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("scores/Update")]
        public async Task<IActionResult> UpdateScore([FromBody] Score score)
        {
            try
            {
                if (score == null || score.Id == Guid.Empty) 
                    return BadRequest(new { message = "Request inválido." });

                // Validar que el score esté en el rango válido (0-10)
                if (score.Value < 0 || score.Value > 10)
                    return BadRequest(new { message = "El score debe estar entre 0 y 10." });

                // Validar que la asignación exista y no esté completada
                var assignment = await _assignmentService.GetById(score.JudgeAssignmentId);
                if (assignment == null)
                    return NotFound(new { message = "Asignación no encontrada." });
                
                if (assignment.Status == "Completed")
                    return BadRequest(new { message = "No se puede modificar scores de una asignación ya completada." });

                var result = await _scoreService.Update(score);
                if (result == null) 
                    return NotFound(new { message = "Score no encontrado." });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al actualizar score: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpDelete("scores/Delete")]
        public async Task<IActionResult> DeleteScore([FromQuery] Guid id)
        {
            if (id == Guid.Empty) return BadRequest();
            var ok = await _scoreService.Delete(id);
            return Ok(ok);
        }

        // rubrics
        [Authorize]
        [HttpPost("rubrics/Create")]
        public async Task<IActionResult> CreateRubric([FromBody] RubricCreateDto request)
        {
            try
            {
                if (request == null) 
                    return BadRequest(new { message = "Request inválido." });
                
                var result = await _rubricService.Create(request);
                if (result == null) 
                    return StatusCode(500, new { message = "No se pudo crear la rúbrica." });
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al crear rúbrica: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("rubrics/GetByContest")]
        public async Task<IActionResult> GetRubricsByContest([FromQuery] Guid contestId)
        {
            if (contestId == Guid.Empty) return BadRequest();
            var result = await _rubricService.GetByContest(contestId);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("rubrics/GetAll")]
        public async Task<IActionResult> GetAllRubrics()
        {
            var result = await _rubricService.GetAll();
            return Ok(result);
        }

        [Authorize]
        [HttpPost("rubrics/Update")]
        public async Task<IActionResult> UpdateRubric([FromBody] Rubric rubric)
        {
            if (rubric == null || rubric.Id == Guid.Empty) return BadRequest();
            var result = await _rubricService.Update(rubric);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("rubrics/Delete")]
        public async Task<IActionResult> DeleteRubric([FromQuery] Guid id)
        {
            if (id == Guid.Empty) return BadRequest();
            var ok = await _rubricService.Delete(id);
            return Ok(ok);
        }

        // summary
        [Authorize]
        [HttpGet("summary/GetBySubmission")]
        public async Task<IActionResult> GetEvaluationSummary([FromQuery] Guid submissionId)
        {
            try
            {
                if (submissionId == Guid.Empty) return BadRequest(new { message = "El ID de la submission es requerido." });
                var (totalScore, scores) = await _scoreService.GetSummaryBySubmission(submissionId);
                var response = new
                {
                    submissionId,
                    totalScore,
                    maxScore = scores.Count,
                    averageScore = scores.Count > 0 ? totalScore / scores.Count : 0,
                    scores,
                    assignments = await _assignmentService.GetBySubmission(submissionId)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener resumen de evaluación: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("scores/GetByContest")]
        public async Task<IActionResult> GetScoresByContest([FromQuery] Guid contestId)
        {
            try
            {
                if (contestId == Guid.Empty) return BadRequest(new { message = "El ID del concurso es requerido." });
                var result = await _scoreService.GetByContest(contestId);
                return Ok(result ?? new List<Score>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener scores por concurso: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("scores/GetByCategory")]
        public async Task<IActionResult> GetScoresByCategory([FromQuery] Guid categoryId)
        {
            try
            {
                if (categoryId == Guid.Empty) return BadRequest(new { message = "El ID de la categoría es requerido." });
                var result = await _scoreService.GetByCategory(categoryId);
                return Ok(result ?? new List<Score>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener scores por categoría: {ex.Message}" });
            }
        }
    }
}

