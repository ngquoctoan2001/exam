namespace ExamSystem.Application.DTOs;

public record QuestionDto(
    long Id, 
    long QuestionTypeId, 
    string QuestionTypeName,
    long SubjectId, 
    string SubjectName,
    string Content, 
    int DifficultyLevel,
    List<QuestionOptionDto> Options);

public record QuestionOptionDto(long Id, string OptionLabel, string Content, bool IsCorrect);

public record CreateQuestionDto(
    long QuestionTypeId, 
    long SubjectId, 
    string Content, 
    int DifficultyLevel,
    List<CreateQuestionOptionDto> Options);

public record CreateQuestionOptionDto(string OptionLabel, string Content, bool IsCorrect);

public record QuestionTypeDto(long Id, string Name);
