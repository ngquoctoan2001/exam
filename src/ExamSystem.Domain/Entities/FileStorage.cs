namespace ExamSystem.Domain.Entities;

public class FileEntry
{
    public long Id { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long UploadedBy { get; set; } // UserId
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
}

public class ExamFile
{
    public long ExamId { get; set; }
    public long FileId { get; set; }

    public virtual Exam Exam { get; set; } = null!;
    public virtual FileEntry File { get; set; } = null!;
}
