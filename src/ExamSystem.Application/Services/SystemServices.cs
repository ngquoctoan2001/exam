using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public NotificationService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(long userId)
    {
        var notifications = await _context.NotificationUsers
            .Include(nu => nu.Notification)
            .Where(nu => nu.UserId == userId)
            .OrderByDescending(nu => nu.Notification.CreatedAt)
            .ToListAsync();

        return notifications.Select(nu => new NotificationDto(
            nu.NotificationId,
            nu.Notification.Title,
            nu.Notification.Message,
            nu.Notification.CreatedAt,
            nu.IsRead));
    }

    public async Task MarkAsReadAsync(long notificationId, long userId)
    {
        var nu = await _context.NotificationUsers
            .FirstOrDefaultAsync(x => x.NotificationId == notificationId && x.UserId == userId);
        
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

        foreach (var nu in notifications) nu.IsRead = true;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteNotificationAsync(long notificationId, long userId)
    {
        var nu = await _context.NotificationUsers.FirstOrDefaultAsync(x => x.NotificationId == notificationId && x.UserId == userId);
        if (nu != null)
        {
            _context.NotificationUsers.Remove(nu);
            await _context.SaveChangesAsync();
        }
    }

    public async Task SendNotificationAsync(CreateNotificationDto dto)
    {
        var notification = new Notification
        {
            Title = dto.Title,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow
        };
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        foreach (var userId in dto.UserIds)
        {
            _context.NotificationUsers.Add(new NotificationUser
            {
                NotificationId = notification.Id,
                UserId = userId
            });
        }
        await _context.SaveChangesAsync();
    }
}

public class ActivityLogService : IActivityLogService
{
    private readonly IApplicationDbContext _context;

    public ActivityLogService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task LogActionAsync(long userId, string action, string? metadata = null)
    {
        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = userId,
            Action = action,
            Metadata = metadata,
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ActivityLogDto>> GetLogsAsync(int count = 100)
    {
        return await _context.ActivityLogs
            .Include(l => l.User)
            .OrderByDescending(l => l.CreatedAt)
            .Take(count)
            .Select(l => new ActivityLogDto(l.Id, l.UserId, l.User.UserName ?? "Unknown", l.Action, l.Metadata, l.CreatedAt))
            .ToListAsync();
    }
}

public class SystemSettingsService : ISystemSettingsService
{
    private readonly IApplicationDbContext _context;

    public SystemSettingsService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GetSettingAsync(string key)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        return setting?.Value ?? string.Empty;
    }

    public async Task UpdateSettingAsync(string key, string value)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
        {
            _context.SystemSettings.Add(new SystemSetting { Key = key, Value = value });
        }
        else
        {
            setting.Value = value;
        }
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<SystemSettingDto>> GetAllSettingsAsync()
    {
        return await _context.SystemSettings
            .Select(s => new SystemSettingDto(s.Key, s.Value))
            .ToListAsync();
    }
}
