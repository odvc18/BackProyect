using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WS.Service.SubmissionServices;
using WS.Infraestructure.Models;
using WS.Infraestructure.Models.DTOs;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionService _service;

        public SubmissionController(SubmissionService service)
        {
            _service = service;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] SubmissionCreateDto request)
        {
            try
            {
                var created = await _service.Create(request);
                if (created == null || created.Id == Guid.Empty)
                    return BadRequest("No se pudo crear la submission.");
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var submission = await _service.GetById(id);
                if (submission == null)
                    return NotFound();
                return Ok(submission);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetByContestId")]
        public async Task<IActionResult> GetByContestId(Guid contestId)
        {
            try
            {
                var submissions = await _service.GetByContestId(contestId);
                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetByParticipantId")]
        public async Task<IActionResult> GetByParticipantId(Guid participantId)
        {
            try
            {
                var submissions = await _service.GetByParticipantId(participantId);
                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("CreateFile")]
        public async Task<IActionResult> CreateFile([FromBody] SubmissionFileCreateDto request)
        {
            try
            {
                var createdFile = await _service.CreateFile(request);
                if (createdFile == null || createdFile.Id == Guid.Empty)
                    return BadRequest("No se pudo crear el archivo de la submission.");
                return Created(string.Empty, createdFile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetFilesBySubmissionId")]
        public async Task<IActionResult> GetFilesBySubmissionId(Guid submissionId)
        {
            try
            {
                var files = await _service.GetFilesBySubmissionId(submissionId);
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}