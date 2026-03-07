namespace ExamSystem.Application.DTOs;

public record NotificationDto(
    long Id,
    string Title,
    string Message,
    DateTime CreatedAt,
    bool IsRead);

public record CreateNotificationDto(
    string Title,
    string Message,
    List<long> UserIds);

public record ActivityLogDto(
    long Id,
    long UserId,
    string Username,
    string Action,
    string? Metadata,
    DateTime CreatedAt);

public record SystemSettingDto(
    string Key,
    string Value);
