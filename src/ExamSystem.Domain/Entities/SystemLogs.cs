namespace ExamSystem.Domain.Entities;

public class ActivityLog
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Metadata { get; set; } // JSON string
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
}

public class SystemSetting
{
    public long Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
