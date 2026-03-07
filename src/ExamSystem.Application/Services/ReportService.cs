using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using MiniExcelLibs;

namespace ExamSystem.Application.Services;

public class ReportService : IReportService
{
    private readonly IApplicationDbContext _context;

    public ReportService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ClassStatsDto> GetClassStatsAsync(long examId, long classId)
    {
        var results = await _context.ExamResults
            .Include(er => er.Attempt)
            .Where(er => er.Attempt.ExamId == examId && er.Attempt.Student.ClassId == classId)
            .ToListAsync();

        var totalStudents = await _context.Students.CountAsync(s => s.ClassId == classId);
        var participatedCount = results.Count;

        if (participatedCount == 0)
        {
            return new ClassStatsDto(classId, "Unknown", totalStudents, 0, 0, 0, 0, new List<ScoreRangeDto>());
        }

        var avgScore = results.Average(r => r.TotalScore ?? 0);
        var maxScore = results.Max(r => r.TotalScore ?? 0);
        var minScore = results.Min(r => r.TotalScore ?? 0);

        // Score distribution
        var distribution = new List<ScoreRangeDto>
        {
            new ScoreRangeDto("0-2", results.Count(r => (r.TotalScore ?? 0) < 2)),
            new ScoreRangeDto("2-4", results.Count(r => (r.TotalScore ?? 0) >= 2 && (r.TotalScore ?? 0) < 4)),
            new ScoreRangeDto("4-6", results.Count(r => (r.TotalScore ?? 0) >= 4 && (r.TotalScore ?? 0) < 6)),
            new ScoreRangeDto("6-8", results.Count(r => (r.TotalScore ?? 0) >= 6 && (r.TotalScore ?? 0) < 8)),
            new ScoreRangeDto("8-10", results.Count(r => (r.TotalScore ?? 0) >= 8))
        };

        var className = (await _context.Classes.FindAsync(classId))?.Name ?? "N/A";

        return new ClassStatsDto(
            classId, 
            className, 
            totalStudents, 
            participatedCount, 
            avgScore, 
            maxScore, 
            minScore, 
            distribution
        );
    }

    public async Task<IEnumerable<StudentProgressDto>> GetStudentProgressAsync(long classId)
    {
        var students = await _context.Students
            .Where(s => s.ClassId == classId)
            .Include(s => s.User)
            .ToListAsync();

        var progressList = new List<StudentProgressDto>();

        foreach (var student in students)
        {
            var results = await _context.ExamResults
                .Include(er => er.Attempt).ThenInclude(a => a.Exam)
                .Where(er => er.Attempt.StudentId == student.Id)
                .OrderByDescending(er => er.Attempt.StartTime)
                .ToListAsync();

            if (results.Any())
            {
                progressList.Add(new StudentProgressDto(
                    student.Id,
                    student.FullName,
                    results.Count,
                    results.Average(r => r.TotalScore ?? 0),
                    results.Take(5).Select(r => new ExamScoreDto(r.Attempt.Exam.Title, r.TotalScore ?? 0, r.Attempt.StartTime)).ToList()
                ));
            }
        }

        return progressList;
    }

    public async Task<byte[]> ExportExamResultsToExcelAsync(long examId)
    {
        var results = await _context.ExamResults
            .Include(er => er.Attempt).ThenInclude(a => a.Student)
            .Where(er => er.Attempt.ExamId == examId)
            .Select(er => new 
            {
                MaHS = er.Attempt.Student.StudentCode,
                HoTen = er.Attempt.Student.FullName,
                Diem = er.Attempt.TotalScore,
                ThoiGianNop = er.Attempt.EndTime
            })
            .ToListAsync();

        using var memoryStream = new System.IO.MemoryStream();
        memoryStream.SaveAs(results);
        return memoryStream.ToArray();
    }

    public async Task<byte[]> ExportExamResultsToPdfAsync(long examId)
    {
        // For production, use QuestPDF or similar. 
        // Mocking for now as it requires specific library setup.
        return await Task.FromResult(System.Text.Encoding.UTF8.GetBytes("PDF Export - Standard A4 Format (Mock)"));
    }
}
