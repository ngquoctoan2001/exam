using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _context;

    public NotificationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SendNotificationAsync(CreateNotificationDto dto)
    {
        var notification = new Notification
        {
            Title = dto.Title,
            Message = dto.Message,
            Type = "INFO",
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        
        foreach (var userId in dto.UserIds)
        {
            var userNotification = new NotificationUser
            {
                UserId = userId,
                Notification = notification,
                IsRead = false
            };
            _context.NotificationUsers.Add(userNotification);
        }
        
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(long userId)
    {
        var notifications = await _context.NotificationUsers
            .Include(nu => nu.Notification)
            .Where(nu => nu.UserId == userId)
            .OrderByDescending(nu => nu.Notification.CreatedAt)
            .Take(50)
            .ToListAsync();

        return notifications.Select(nu => new NotificationDto(
            nu.Id,
            nu.Notification.Title,
            nu.Notification.Message,
            nu.Notification.Type,
            nu.Notification.CreatedAt,
            nu.IsRead
        ));
    }

    public async Task MarkAsReadAsync(long notificationId, long userId)
    {
        var nu = await _context.NotificationUsers.FirstOrDefaultAsync(u => u.Id == notificationId && u.UserId == userId);
        if (nu != null)
        {
            nu.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task MarkAllAsReadAsync(long userId)
    {
        var notifications = await _context.NotificationUsers
            .Where(nu => nu.UserId == userId && !nu.IsRead)
            .ToListAsync();

        foreach (var nu in notifications)
        {
            nu.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteNotificationAsync(long notificationId, long userId)
    {
        var nu = await _context.NotificationUsers.FirstOrDefaultAsync(u => u.Id == notificationId && u.UserId == userId);
        if (nu != null)
        {
            _context.NotificationUsers.Remove(nu);
            await _context.SaveChangesAsync();
        }
    }
}
