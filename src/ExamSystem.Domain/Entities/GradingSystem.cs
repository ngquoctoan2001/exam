using System.ComponentModel.DataAnnotations.Schema;

namespace ExamSystem.Domain.Entities;

public class GradingResult
{
    public long Id { get; set; }
    public long AttemptId { get; set; }
    public long QuestionId { get; set; }
    public decimal Score { get; set; }
    public long? GradedBy { get; set; }
    public DateTime GradedAt { get; set; } = DateTime.UtcNow;

    public virtual ExamAttempt Attempt { get; set; } = null!;
    public virtual Question Question { get; set; } = null!;
    public virtual Teacher? Teacher { get; set; }
}

public class GradingAnnotation
{
    public long Id { get; set; }
    public long GradingResultId { get; set; }
    public string AnnotationData { get; set; } = string.Empty; // JSON format

    public virtual GradingResult GradingResult { get; set; } = null!;
}

public class GradingComment
{
    public long Id { get; set; }
    public long GradingResultId { get; set; }
    public string Comment { get; set; } = string.Empty;

    public virtual GradingResult GradingResult { get; set; } = null!;
}
