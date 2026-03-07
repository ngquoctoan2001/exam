namespace ExamSystem.Domain.Entities;

public class UserSession
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
}

public class UserLoginLog
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string? IpAddress { get; set; }
    public string? DeviceInfo { get; set; }
    public DateTime LoginTime { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
}

public class Permission
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class RolePermission
{
    public long RoleId { get; set; }
    public long PermissionId { get; set; }

    public virtual Role Role { get; set; } = null!;
    public virtual Permission Permission { get; set; } = null!;
}
