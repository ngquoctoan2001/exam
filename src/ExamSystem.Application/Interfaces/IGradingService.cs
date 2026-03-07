using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IGradingService
{
    Task AutoGradeAttemptAsync(long attemptId);
    Task ManualGradeQuestionAsync(ManualGradingDto dto);
    Task<ExamResultDto> GetExamResultAsync(long attemptId);
    Task<IEnumerable<QuestionGradeDto>> GetQuestionsForGradingAsync(long examId);
    Task<IEnumerable<ExamResultDto>> SearchExamResultsAsync(long examId, decimal? minScore, decimal? maxScore);
}
