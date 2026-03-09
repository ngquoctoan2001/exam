namespace ExamSystem.Application.DTOs;

public record SubjectDto(long Id, string Name, string? Description, string? Code);
public record CreateSubjectDto(string Name, string? Description, string? Code);

public record ClassDto(long Id, string Name, long? HomeroomTeacherId, string? HomeroomTeacherName);
public record CreateClassDto(string Name, long? HomeroomTeacherId);

public record TeacherDto(long Id, string TeacherCode, string FullName, string SubjectName, string Position);
public record StudentDto(long Id, string StudentCode, string FullName, string ClassName);
