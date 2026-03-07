using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IReportService
{
    Task<ClassStatsDto> GetClassStatsAsync(long examId, long classId);
    Task<IEnumerable<StudentProgressDto>> GetStudentProgressAsync(long classId);
    Task<byte[]> ExportExamResultsToExcelAsync(long examId);
    Task<byte[]> ExportExamResultsToPdfAsync(long examId);
}
