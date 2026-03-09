using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace ExamSystem.Application.Services;

public class ReportService : IReportService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ReportService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<byte[]> GenerateExamReportAsync(long examId)
    {
        return await Task.FromResult(Array.Empty<byte>());
    }

    public async Task<byte[]> GenerateClassReportAsync(long classId, long examId)
    {
        return await Task.FromResult(Array.Empty<byte>());
    }

    public async Task<IEnumerable<ExamResultDto>> GetResultsByExamAsync(long examId)
    {
        var attempts = await _context.ExamAttempts
            .Include(a => a.Student)
            .Where(a => a.ExamId == examId && (a.Status == "Submitted" || a.Status == "Graded"))
            .ToListAsync();
        
        return attempts.Select(a => new ExamResultDto(
            a.Id,
            a.ExamId,
            "", 
            a.StudentId,
            a.Student?.FullName ?? "Unknown",
            a.TotalScore ?? 0,
            a.EndTime ?? DateTime.UtcNow
        ));
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync(long userId)
    {
        var user = await _context.Users.FindAsync(userId);
        var totalTeachers = await _context.Users.CountAsync(u => u.Role.ToUpper() == "TEACHER");
        var totalStudents = await _context.Users.CountAsync(u => u.Role.ToUpper() == "STUDENT");
        var ongoingExams = await _context.Exams.CountAsync(e => e.Status == "Ongoing");
        
        var totalAttempts = await _context.ExamAttempts.CountAsync();
        var completedAttempts = await _context.ExamAttempts.CountAsync(a => a.Status == "Submitted" || a.Status == "Graded");
        decimal completionRate = totalAttempts > 0 ? (decimal)completedAttempts / totalAttempts * 100 : 0;

        var upcomingExams = await _context.Exams
            .Include(e => e.Subject)
            .Where(e => e.StartTime > DateTime.UtcNow && e.Status == "Published")
            .OrderBy(e => e.StartTime)
            .Take(5)
            .Select(e => new UpcomingExamDto(e.Id, e.Title, e.Subject.Name, e.StartTime))
            .ToListAsync();

        return new DashboardStatsDto(
            user?.FullName ?? "Admin",
            totalTeachers,
            totalStudents,
            ongoingExams,
            Math.Round(completionRate, 1),
            upcomingExams
        );
    }
}
