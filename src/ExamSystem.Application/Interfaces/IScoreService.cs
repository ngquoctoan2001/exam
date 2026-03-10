using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IScoreService
{
    Task<IEnumerable<StudentScoreDto>> GetScoresByStudentAsync(long studentId);
    Task<IEnumerable<StudentScoreDto>> GetScoresByClassAndSubjectAsync(long classId, long subjectId, string semester, string academicYear);
    Task UpdateScoreAsync(UpdateScoreDto dto);
    Task<byte[]> ExportTranscriptAsync(long studentId, string academicYear);
}
