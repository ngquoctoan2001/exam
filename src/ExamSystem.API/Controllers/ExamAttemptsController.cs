using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class ExamAttemptsController : BaseApiController
{
    private readonly IExamAttemptService _attemptService;

    public ExamAttemptsController(IExamAttemptService attemptService)
    {
        _attemptService = attemptService;
    }

    [HttpPost("start/{examId}")]
    public async Task<ActionResult<ExamAttemptDto>> Start(long examId)
    {
        // TODO: Get current student ID from Auth context
        long studentId = 1; // Demo
        return Ok(await _attemptService.StartAttemptAsync(examId, studentId));
    }

    [HttpPost("{id}/save")]
    public async Task<IActionResult> SaveAnswer(long id, SaveAnswerDto dto)
    {
        await _attemptService.SaveAnswerAsync(id, dto);
        return NoContent();
    }

    [HttpPost("{id}/submit")]
    public async Task<IActionResult> Submit(long id)
    {
        await _attemptService.SubmitAttemptAsync(id);
        return NoContent();
    }

    [HttpGet("current/{examId}")]
    public async Task<ActionResult<ExamAttemptDto>> GetCurrent(long examId)
    {
        long studentId = 1; // Demo
        var attempt = await _attemptService.GetCurrentAttemptAsync(examId, studentId);
        if (attempt == null) return NotFound();
        return Ok(attempt);
    }
}
