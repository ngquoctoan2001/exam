using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IQuestionService
{
    Task<IEnumerable<QuestionDto>> GetAllAsync(long? subjectId = null);
    Task<QuestionDto> GetByIdAsync(long id);
    Task<QuestionDto> CreateAsync(CreateQuestionDto dto);
    Task UpdateAsync(long id, CreateQuestionDto dto);
    Task DeleteAsync(long id);
    
    // Tagging
    Task AddTagAsync(long questionId, long tagId);
    Task RemoveTagAsync(long questionId, long tagId);
    Task<IEnumerable<QuestionDto>> GetByTagAsync(long tagId);
    Task<IEnumerable<QuestionTypeDto>> GetTypesAsync();
}
