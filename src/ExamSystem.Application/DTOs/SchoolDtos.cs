namespace ExamSystem.Application.DTOs;

public record SchoolDto(long Id, string Name, string Address);
public record CreateSchoolDto(string Name, string Address);

public record SubjectDto(long Id, string Name);
public record CreateSubjectDto(string Name);

public record ClassDto(long Id, string Name, int Grade, long HomeroomTeacherId, string HomeroomTeacherName);
public record CreateClassDto(string Name, int Grade, long HomeroomTeacherId);

public record TeacherDto(long Id, string TeacherCode, string FullName, string SubjectName, string Position);
public record StudentDto(long Id, string StudentCode, string FullName, string ClassName);

public record ImportUserResult(int SuccessCount, int FailureCount, List<string> Errors);
