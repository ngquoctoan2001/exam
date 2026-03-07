using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class NotificationsController : BaseApiController
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetMyNotifications()
    {
        // TODO: Get real userId from identity
        long userId = 1;
        return Ok(await _notificationService.GetUserNotificationsAsync(userId));
    }

    [HttpPost("mark-read/{id}")]
    public async Task<IActionResult> MarkRead(long id)
    {
        long userId = 1;
        await _notificationService.MarkAsReadAsync(id, userId);
        return NoContent();
    }

    [HttpPost("mark-all-read")]
    public async Task<IActionResult> MarkAllRead()
    {
        long userId = 1;
        await _notificationService.MarkAllAsReadAsync(userId);
        return NoContent();
    }

    [HttpDelete("notifications/{id}")]
    public async Task<IActionResult> DeleteNotification(long id)
    {
        long userId = 1;
        await _notificationService.DeleteNotificationAsync(id, userId);
        return NoContent();
    }

    [HttpPost("send")]
    public async Task<IActionResult> Send(CreateNotificationDto dto)
    {
        await _notificationService.SendNotificationAsync(dto);
        return NoContent();
    }
}

public class SystemSettingsController : BaseApiController
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

    [HttpPost]
    public async Task<IActionResult> Update(SystemSettingDto dto)
    {
        await _settingsService.UpdateSettingAsync(dto.Key, dto.Value);
        return NoContent();
    }
}

public class SystemLogsController : BaseApiController
{
    private readonly IActivityLogService _logService;

    public SystemLogsController(IActivityLogService logService)
    {
        _logService = logService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActivityLogDto>>> GetLogs([FromQuery] int count = 100)
    {
        return Ok(await _logService.GetLogsAsync(count));
    }
}
