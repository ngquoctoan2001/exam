namespace ExamSystem.Domain.Entities;

public class ClassSubjectTeacher
{
    public long Id { get; set; }
    public long ClassId { get; set; }
    public long SubjectId { get; set; }
    public long TeacherId { get; set; }

    public virtual Class Class { get; set; } = null!;
    public virtual Subject Subject { get; set; } = null!;
    public virtual Teacher Teacher { get; set; } = null!;
}
