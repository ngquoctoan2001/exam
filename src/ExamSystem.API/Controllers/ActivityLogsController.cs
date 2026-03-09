using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class ActivityLogsController : BaseApiController
{
    private readonly IActivityLogService _logService;

    public ActivityLogsController(IActivityLogService logService)
    {
        _logService = logService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActivityLogDto>>> GetLogs([FromQuery] int count = 100)
    {
        return Ok(await _logService.GetLogsAsync(count));
    }

    [HttpPost]
    public async Task<IActionResult> Create(string action, string? details = null)
    {
        long userId = 1; // TODO: Get from Auth
        await _logService.LogActionAsync(userId, action, details);
        return NoContent();
    }
}
