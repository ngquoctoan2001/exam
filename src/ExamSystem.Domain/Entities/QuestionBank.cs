namespace ExamSystem.Domain.Entities;

public class QuestionType
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty; // MCQ, TrueFalse, ShortAnswer, Essay, Drawing
    public string Code { get; set; } = string.Empty;
}

public class Question
{
    public long Id { get; set; }
    public long QuestionTypeId { get; set; }
    public long SubjectId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int DifficultyLevel { get; set; }
    public long TeacherId { get; set; }

    public virtual QuestionType QuestionType { get; set; } = null!;
    public virtual Subject Subject { get; set; } = null!;
    public virtual Teacher Teacher { get; set; } = null!;
    public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
}

public class QuestionOption
{
    public long Id { get; set; }
    public long QuestionId { get; set; }
    public string OptionLabel { get; set; } = string.Empty; // A, B, C, D
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }

    public virtual Question Question { get; set; } = null!;
}

public class QuestionTag
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ExamQuestion
{
    public long Id { get; set; }
    public long ExamId { get; set; }
    public long QuestionId { get; set; }
    public int OrderIndex { get; set; }
    public decimal MaxScore { get; set; }

    public virtual Exam Exam { get; set; } = null!;
    public virtual Question Question { get; set; } = null!;
}

public class QuestionTagMap
{
    public long QuestionId { get; set; }
    public long TagId { get; set; }
    public virtual Question Question { get; set; } = null!;
    public virtual QuestionTag Tag { get; set; } = null!;
}
