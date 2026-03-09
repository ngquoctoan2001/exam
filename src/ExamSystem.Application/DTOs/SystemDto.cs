namespace ExamSystem.Application.DTOs;

public record NotificationDto(
    long Id,
    string Title,
    string Message,
    string Type,
    DateTime CreatedAt,
    bool IsRead);

public record CreateNotificationDto(
    string Title,
    string Message,
    List<long> UserIds);

public record SystemSettingDto(
    string Key,
    string Value);
