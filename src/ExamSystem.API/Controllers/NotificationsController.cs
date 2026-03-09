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
        // TODO: Get real userId from Auth
        long userId = 1; 
        return Ok(await _notificationService.GetUserNotificationsAsync(userId));
    }

    [HttpPost("mark-read/{id}")]
    public async Task<IActionResult> MarkRead(long id)
    {
        long userId = 1; // TODO: Get from Auth
        await _notificationService.MarkAsReadAsync(id, userId);
        return NoContent();
    }

    [HttpPost("mark-all-read")]
    public async Task<IActionResult> MarkAllRead()
    {
        long userId = 1; // TODO: Get from Auth
        await _notificationService.MarkAllAsReadAsync(userId);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(long id)
    {
        long userId = 1; // TODO: Get from Auth
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
