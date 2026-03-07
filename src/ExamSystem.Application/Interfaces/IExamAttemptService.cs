using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IExamAttemptService
{
    Task<ExamAttemptDto> StartAttemptAsync(long examId, long studentId);
    Task SaveAnswerAsync(long attemptId, SaveAnswerDto dto);
    Task SubmitAttemptAsync(long attemptId);
    Task<ExamAttemptDto> GetCurrentAttemptAsync(long examId, long studentId);
}
