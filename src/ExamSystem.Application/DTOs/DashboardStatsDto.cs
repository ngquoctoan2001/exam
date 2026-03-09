namespace ExamSystem.Application.DTOs;

public record DashboardStatsDto(
    string UserName,
    int TotalTeachers,
    int TotalStudents,
    int OngoingExams,
    decimal CompletionRate,
    List<UpcomingExamDto> UpcomingExams);

public record UpcomingExamDto(
    long Id,
    string Title,
    string SubjectName,
    DateTime StartTime);
