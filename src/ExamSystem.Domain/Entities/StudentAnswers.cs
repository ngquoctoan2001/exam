namespace ExamSystem.Domain.Entities;

public class Answer
{
    public long Id { get; set; }
    public long AttemptId { get; set; }
    public long QuestionId { get; set; }
    public string? AnswerText { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public virtual ExamAttempt Attempt { get; set; } = null!;
    public virtual Question Question { get; set; } = null!;
    public virtual ICollection<AnswerOption> SelectedOptions { get; set; } = new List<AnswerOption>();
    public virtual AnswerCanvas? Canvas { get; set; }
}

public class AnswerOption
{
    public long AnswerId { get; set; }
    public long OptionId { get; set; }

    public virtual Answer Answer { get; set; } = null!;
    public virtual QuestionOption Option { get; set; } = null!;
}

public class AnswerCanvas
{
    public long Id { get; set; }
    public long AnswerId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string JsonData { get; set; } = string.Empty; // Store Fabric.js/Konva data

    public virtual Answer Answer { get; set; } = null!;
}

public class AutosaveAnswer
{
    public long Id { get; set; }
    public long AttemptId { get; set; }
    public long QuestionId { get; set; }
    public string Data { get; set; } = string.Empty; // JSON format
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}
