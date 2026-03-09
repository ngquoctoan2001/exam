using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class SystemSettingsController : ControllerBase
{
    private readonly ISystemSettingsService _settingsService;

    public SystemSettingsController(ISystemSettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SystemSettingDto>>> GetAll()
    {
        return Ok(await _settingsService.GetAllSettingsAsync());
    }

    [HttpGet("{key}")]
    public async Task<IActionResult> GetSetting(string key)
    {
        var value = await _settingsService.GetSettingAsync(key);
        return Ok(new { key, value });
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateSetting([FromBody] SettingUpdateRequest request)
    {
        await _settingsService.UpdateSettingAsync(request.Key, request.Value);
        return Ok();
    }
}

public class SettingUpdateRequest
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
