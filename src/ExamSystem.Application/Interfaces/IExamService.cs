using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IExamService
{
    Task<IEnumerable<ExamDto>> GetAllAsync(long? teacherId = null, long? classId = null);
    Task<ExamDto> GetByIdAsync(long id);
    Task<ExamDto> CreateAsync(CreateExamDto dto);
    Task UpdateStatusAsync(long id, string status);
    Task DeleteAsync(long id);
    Task AddQuestionsAsync(long examId, IEnumerable<long> questionIds);
    
    // Advanced Settings & Assignments
    Task UpdateSettingsAsync(long examId, ExamSettingsDto dto);
    Task AssignClassesAsync(long examId, IEnumerable<long> classIds);
    Task UnassignClassAsync(long examId, long classId);
    Task<IEnumerable<ClassDto>> GetExamClassesAsync(long examId);
}
