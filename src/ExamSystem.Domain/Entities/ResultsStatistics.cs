namespace ExamSystem.Domain.Entities;

public class ExamResult
{
    public long Id { get; set; }
    public long AttemptId { get; set; }
    public decimal? TotalScore { get; set; }
    public DateTime GradedAt { get; set; } = DateTime.UtcNow;

    public virtual ExamAttempt Attempt { get; set; } = null!;
}

public class ClassExamResult
{
    public long Id { get; set; }
    public long ExamId { get; set; }
    public long ClassId { get; set; }
    public decimal AverageScore { get; set; }

    public virtual Exam Exam { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
}

public class ExamStatistic
{
    public long ExamId { get; set; }
    public decimal AvgScore { get; set; }
    public decimal MaxScore { get; set; }
    public decimal MinScore { get; set; }

    public virtual Exam Exam { get; set; } = null!;
}
