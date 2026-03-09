using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExamSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ExamAttemptsController : ControllerBase
{
    private readonly IExamAttemptService _attemptService;

    public ExamAttemptsController(IExamAttemptService attemptService)
    {
        _attemptService = attemptService;
    }

    [HttpPost("start/{examId}")]
    public async Task<ActionResult<ExamAttemptDto>> StartAttempt(long examId)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var attempt = await _attemptService.StartAttemptAsync(examId, userId);
        return Ok(attempt);
    }

    [HttpPost("save-answer/{attemptId}")]
    public async Task<IActionResult> SaveAnswer(long attemptId, SaveAnswerDto dto)
    {
        await _attemptService.SaveAnswerAsync(attemptId, dto);
        return Ok();
    }

    [HttpPost("submit/{attemptId}")]
    public async Task<IActionResult> SubmitAttempt(long attemptId)
    {
        await _attemptService.SubmitAttemptAsync(attemptId);
        return Ok();
    }

    [HttpGet("current/{examId}")]
    public async Task<ActionResult<ExamAttemptDto>> GetCurrentAttempt(long examId)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var attempt = await _attemptService.GetCurrentAttemptAsync(examId, userId);
        if (attempt == null) return NotFound();
        return Ok(attempt);
    }
}
