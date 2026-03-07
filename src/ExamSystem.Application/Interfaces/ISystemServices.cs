using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(long userId);
    Task MarkAsReadAsync(long notificationId, long userId);
    Task MarkAllAsReadAsync(long userId);
    Task DeleteNotificationAsync(long notificationId, long userId);
    Task SendNotificationAsync(CreateNotificationDto dto);
}

public interface IActivityLogService
{
    Task LogActionAsync(long userId, string action, string? metadata = null);
    Task<IEnumerable<ActivityLogDto>> GetLogsAsync(int count = 100);
}

public interface ISystemSettingsService
{
    Task<string> GetSettingAsync(string key);
    Task UpdateSettingAsync(string key, string value);
    Task<IEnumerable<SystemSettingDto>> GetAllSettingsAsync();
}
