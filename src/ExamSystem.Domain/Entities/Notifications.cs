namespace ExamSystem.Domain.Entities;

public class Notification
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class NotificationUser
{
    public long NotificationId { get; set; }
    public long UserId { get; set; }
    public bool IsRead { get; set; } = false;

    public virtual Notification Notification { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
