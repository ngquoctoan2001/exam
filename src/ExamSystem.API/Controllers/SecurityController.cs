using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.API.Controllers;

public class SecurityController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public SecurityController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("login-logs")]
    public async Task<ActionResult<IEnumerable<UserLoginLogDto>>> GetLoginLogs([FromQuery] long? userId)
    {
        var query = _context.UserLoginLogs.AsQueryable();
        if (userId.HasValue) query = query.Where(l => l.UserId == userId);
        
        var logs = await query.OrderByDescending(l => l.LoginTime).Take(100).ToListAsync();
        return Ok(logs); // Map to DTO if needed
    }

    [HttpGet("active-sessions")]
    public async Task<ActionResult<IEnumerable<UserSessionDto>>> GetActiveSessions([FromQuery] long userId)
    {
        var sessions = await _context.UserSessions
            .Where(s => s.UserId == userId && s.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();
        return Ok(sessions);
    }

    [HttpDelete("sessions/{sessionId}")]
    public async Task<IActionResult> TerminateSession(long sessionId)
    {
        var session = await _context.UserSessions.FindAsync(sessionId);
        if (session != null)
        {
            _context.UserSessions.Remove(session);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }
}

public record UserLoginLogDto(long Id, long UserId, string IpAddress, string DeviceInfo, DateTime LoginTime);
public record UserSessionDto(long Id, long UserId, string RefreshToken, DateTime ExpiresAt);
