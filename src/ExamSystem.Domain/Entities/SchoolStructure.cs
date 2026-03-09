namespace ExamSystem.Domain.Entities;

public class Subject
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class Class
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Grade { get; set; }
    public long HomeroomTeacherId { get; set; }
    
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}

public class Teacher
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string TeacherCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public long SubjectId { get; set; }
    public string Position { get; set; } = string.Empty;

    public virtual User User { get; set; } = null!;
    public virtual Subject Subject { get; set; } = null!;
}

public class Student
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public long? ClassId { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
}
