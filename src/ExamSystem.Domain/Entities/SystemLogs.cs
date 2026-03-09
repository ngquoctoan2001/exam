namespace ExamSystem.Domain.Entities;

public class ActivityLog
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string IpAddress { get; set; } = string.Empty;

    public virtual User User { get; set; } = null!;
}

public class SystemSetting
{
    public long Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
