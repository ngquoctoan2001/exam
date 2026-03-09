using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IClassService
{
    Task<IEnumerable<ClassDto>> GetAllAsync();
    Task<ClassDto> CreateAsync(CreateClassDto dto);
    Task AssignStudentsAsync(long classId, IEnumerable<long> studentIds);
    Task<IEnumerable<UserDto>> GetStudentsInClassAsync(long classId);
    Task RemoveStudentFromClassAsync(long classId, long studentId);
}
