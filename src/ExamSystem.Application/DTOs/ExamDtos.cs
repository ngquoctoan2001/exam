namespace ExamSystem.Application.DTOs;

public record ExamDto(
    long Id, 
    string Title, 
    long SubjectId, 
    string SubjectName,
    long TeacherId, 
    string TeacherName,
    int DurationMinutes, 
    DateTime StartTime, 
    DateTime EndTime, 
    string Status,
    ExamSettingsDto Settings);

public record ExamSettingsDto(
    bool ShuffleQuestions, 
    bool ShuffleAnswers, 
    bool ShowResultImmediately, 
    bool AllowReview);

public record CreateExamDto(
    string Title, 
    long SubjectId, 
    long TeacherId, 
    int DurationMinutes, 
    DateTime StartTime, 
    DateTime EndTime,
    List<long> ClassIds,
    ExamSettingsDto Settings);
    
public record UpdateExamStatusDto(string Status);
