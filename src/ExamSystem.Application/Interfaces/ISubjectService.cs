using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface ISubjectService
{
    Task<IEnumerable<SubjectDto>> GetAllAsync();
    Task<SubjectDto> CreateAsync(CreateSubjectDto dto);
    Task UpdateAsync(long id, CreateSubjectDto dto);
    Task DeleteAsync(long id);
}
