namespace ExamSystem.Application.DTOs;

public record ExamResultDto(
    long Id,
    long ExamId,
    string ExamTitle,
    long StudentId,
    string StudentName,
    decimal Score,
    DateTime CompletedAt);
