using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamSystem.Domain.Entities;

public class Exam
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public long SubjectId { get; set; }
    public long TeacherId { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Published, Ongoing, Finished
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Subject Subject { get; set; } = null!;
    public virtual Teacher Teacher { get; set; } = null!;
    public virtual ExamSettings Settings { get; set; } = null!;
    public virtual ICollection<ExamClass> ExamClasses { get; set; } = new List<ExamClass>();
    public virtual ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
}

public class ExamClass
{
    public long ExamId { get; set; }
    public long ClassId { get; set; }

    public virtual Exam Exam { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
}

public class ExamSettings
{
    [Key]
    [ForeignKey("Exam")]
    public long ExamId { get; set; }
    public bool ShuffleQuestions { get; set; }
    public bool ShuffleAnswers { get; set; }
    public bool ShowResultImmediately { get; set; }
    public bool AllowReview { get; set; }

    public virtual Exam Exam { get; set; } = null!;
}

public class ExamAttempt
{
    public long Id { get; set; }
    public long ExamId { get; set; }
    public long StudentId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Status { get; set; } = "Ongoing"; // Ongoing, Submitted, Graded
    public decimal? TotalScore { get; set; }

    public virtual Exam Exam { get; set; } = null!;
    public virtual Student Student { get; set; } = null!;
    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public virtual ICollection<GradingResult> GradingResults { get; set; } = new List<GradingResult>();
}
