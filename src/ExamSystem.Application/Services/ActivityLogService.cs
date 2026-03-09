using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ExamSystem.Application.Services;

public class ActivityLogService : IActivityLogService
{
    private readonly IApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ActivityLogService(IApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogActionAsync(long userId, string action, string? metadata = null)
    {
        var log = new ActivityLog
        {
            UserId = userId,
            Action = action,
            Details = metadata ?? string.Empty,
            Timestamp = DateTime.UtcNow,
            IpAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Unknown"
        };

        _context.ActivityLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ActivityLogDto>> GetLogsAsync(int count = 100)
    {
        var logs = await _context.ActivityLogs
            .Include(l => l.User)
            .OrderByDescending(l => l.Timestamp)
            .Take(count)
            .ToListAsync();

        return logs.Select(l => new ActivityLogDto(
            l.Id,
            l.UserId,
            l.User?.UserName ?? "Unknown",
            l.Action,
            l.Details,
            l.Timestamp,
            l.IpAddress
        ));
    }
}
