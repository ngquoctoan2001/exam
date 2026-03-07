using ExamSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.API.Controllers;

public class DashboardsController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public DashboardsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("admin-stats")]
    public async Task<ActionResult> GetAdminStats()
    {
        var stats = new
        {
            TotalSchools = await _context.Schools.CountAsync(),
            TotalTeachers = await _context.Teachers.CountAsync(),
            TotalStudents = await _context.Students.CountAsync(),
            TotalExams = await _context.Exams.CountAsync(),
            TotalAttempts = await _context.ExamAttempts.CountAsync()
        };
        return Ok(stats);
    }

    [HttpGet("recent-activities")]
    public async Task<ActionResult> GetRecentActivities()
    {
        var logs = await _context.ActivityLogs
            .OrderByDescending(l => l.CreatedAt)
            .Take(10)
            .ToListAsync();
        return Ok(logs);
    }

    [HttpGet("exam-trends")]
    public async Task<ActionResult> GetExamTrends()
    {
        // Mocking trend data for last 7 days
        var trends = new List<object>
        {
            new { Date = DateTime.UtcNow.AddDays(-6), Count = 12 },
            new { Date = DateTime.UtcNow.AddDays(-5), Count = 15 },
            new { Date = DateTime.UtcNow.AddDays(-4), Count = 45 },
            new { Date = DateTime.UtcNow.AddDays(-3), Count = 30 },
            new { Date = DateTime.UtcNow.AddDays(-2), Count = 55 },
            new { Date = DateTime.UtcNow.AddDays(-1), Count = 80 },
            new { Date = DateTime.UtcNow, Count = 25 }
        };
        return Ok(trends);
    }
}
