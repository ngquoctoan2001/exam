using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class ExamsController : BaseApiController
{
    private readonly IExamService _examService;

    public ExamsController(IExamService examService)
    {
        _examService = examService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExamDto>>> GetAll([FromQuery] long? teacherId, [FromQuery] long? classId)
    {
        return Ok(await _examService.GetAllAsync(teacherId, classId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExamDto>> GetById(long id)
    {
        var exam = await _examService.GetByIdAsync(id);
        if (exam == null) return NotFound();
        return Ok(exam);
    }

    [HttpPost]
    public async Task<ActionResult<ExamDto>> Create(CreateExamDto dto)
    {
        var exam = await _examService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = exam.Id }, exam);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(long id, UpdateExamStatusDto dto)
    {
        await _examService.UpdateStatusAsync(id, dto.Status);
        return NoContent();
    }

    [HttpPost("{id}/questions")]
    public async Task<IActionResult> AddQuestions(long id, [FromBody] IEnumerable<long> questionIds)
    {
        await _examService.AddQuestionsAsync(id, questionIds);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _examService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPut("{id}/settings")]
    public async Task<IActionResult> UpdateSettings(long id, ExamSettingsDto dto)
    {
        await _examService.UpdateSettingsAsync(id, dto);
        return NoContent();
    }

    [HttpPost("{id}/classes")]
    public async Task<IActionResult> AssignClasses(long id, [FromBody] IEnumerable<long> classIds)
    {
        await _examService.AssignClassesAsync(id, classIds);
        return NoContent();
    }

    [HttpDelete("{id}/classes/{classId}")]
    public async Task<IActionResult> UnassignClass(long id, long classId)
    {
        await _examService.UnassignClassAsync(id, classId);
        return NoContent();
    }

    [HttpGet("{id}/classes")]
    public async Task<ActionResult<IEnumerable<ClassDto>>> GetClasses(long id)
    {
        return Ok(await _examService.GetExamClassesAsync(id));
    }
}
