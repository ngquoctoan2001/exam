using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IReportService
{
    Task<byte[]> GenerateExamReportAsync(long examId);
    Task<byte[]> GenerateClassReportAsync(long classId, long examId);
    Task<IEnumerable<ExamResultDto>> GetResultsByExamAsync(long examId);
    Task<DashboardStatsDto> GetDashboardStatsAsync(long userId);
}
