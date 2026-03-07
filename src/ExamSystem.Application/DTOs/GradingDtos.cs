namespace ExamSystem.Application.DTOs;

public record GradeResultDto(
    long QuestionId, 
    decimal Score, 
    string? Comment, 
    string? AnnotationData);

public record ExamResultDto(
    long AttemptId, 
    decimal TotalScore, 
    List<QuestionGradeDto> QuestionGrades);

public record QuestionGradeDto(
    long QuestionId, 
    string Content, 
    decimal MaxScore, 
    decimal EarnedScore, 
    bool IsManual);

public record ManualGradingDto(
    long AttemptId, 
    long QuestionId, 
    decimal Score, 
    string? Comment, 
    string? AnnotationData);
