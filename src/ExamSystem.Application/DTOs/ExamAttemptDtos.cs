namespace ExamSystem.Application.DTOs;

public record ExamAttemptDto(
    long Id, 
    long ExamId, 
    string ExamTitle,
    DateTime StartTime, 
    DateTime? EndTime, 
    int RemainingSeconds,
    List<ExamQuestionDto> Questions);

public record ExamQuestionDto(
    long Id, 
    long QuestionId,
    long QuestionTypeId,
    string Content, 
    int OrderIndex,
    List<ExamQuestionOptionDto> Options);

public record ExamQuestionOptionDto(long Id, string OptionLabel, string Content);

public record SaveAnswerDto(
    long QuestionId, 
    string? TextAnswer, 
    List<long>? SelectedOptionIds,
    string? CanvasDataJson);
