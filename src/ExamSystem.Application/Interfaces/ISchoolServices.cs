using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface ISchoolService
{
    Task<IEnumerable<SchoolDto>> GetAllAsync();
    Task<SchoolDto> GetByIdAsync(long id);
    Task<SchoolDto> CreateAsync(CreateSchoolDto dto);
    Task UpdateAsync(long id, CreateSchoolDto dto);
    Task DeleteAsync(long id);
}

public interface ISubjectService
{
    Task<IEnumerable<SubjectDto>> GetAllAsync();
    Task<SubjectDto> CreateAsync(CreateSubjectDto dto);
    Task UpdateAsync(long id, CreateSubjectDto dto);
    Task DeleteAsync(long id);
}

public interface IClassService
{
    Task<IEnumerable<ClassDto>> GetAllAsync();
    Task<ClassDto> CreateAsync(CreateClassDto dto);
    Task AssignStudentsAsync(long classId, IEnumerable<long> studentIds);
    Task<IEnumerable<UserDto>> GetStudentsInClassAsync(long classId);
    Task RemoveStudentFromClassAsync(long classId, long studentId);
}

public interface IUserService
{
    Task<ImportUserResult> ImportStudentsAsync(Stream excelStream);
    Task<ImportUserResult> ImportTeachersAsync(Stream excelStream);
    
    // Advanced CRUD
    Task<IEnumerable<UserDto>> GetAllStudentsAsync();
    Task<IEnumerable<UserDto>> GetAllTeachersAsync();
    Task<UserDto> GetUserDetailAsync(long id);
    Task DeleteUserAsync(long id);
}
