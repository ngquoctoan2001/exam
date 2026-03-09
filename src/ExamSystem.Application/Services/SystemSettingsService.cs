using ExamSystem.Application.Interfaces;
using ExamSystem.Application.DTOs;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class SystemSettingsService : ISystemSettingsService
{
    private readonly IApplicationDbContext _context;

    public SystemSettingsService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GetSettingAsync(string key)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        return setting?.Value ?? string.Empty;
    }

    public async Task UpdateSettingAsync(string key, string value)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
        {
            setting = new SystemSetting { Key = key, Value = value };
            _context.SystemSettings.Add(setting);
        }
        else
        {
            setting.Value = value;
        }
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<SystemSettingDto>> GetAllSettingsAsync()
    {
        var settings = await _context.SystemSettings.ToListAsync();
        return settings.Select(s => new SystemSettingDto(s.Key, s.Value));
    }
}
