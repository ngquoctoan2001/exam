namespace ExamSystem.Application.DTOs;

public record CreateActivityLogDto(string Action, string Details);

public record ActivityLogDto(
    long Id,
    long UserId,
    string UserName,
    string Action,
    string Details,
    DateTime Timestamp,
    string IpAddress);
