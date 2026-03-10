using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamSystem.Domain.Entities;

public class StudentScore
{
    public long Id { get; set; }

    public long StudentId { get; set; }
    public virtual Student Student { get; set; } = null!;

    public long SubjectId { get; set; }
    public virtual Subject Subject { get; set; } = null!;

    public string Semester { get; set; } = "Học kỳ 1"; // Học kỳ 1, Học kỳ 2
    public string AcademicYear { get; set; } = string.Empty; // e.g., 2023-2024

    // Điểm 15 phút (3 cột)
    public double? Score15p1 { get; set; }
    public double? Score15p2 { get; set; }
    public double? Score15p3 { get; set; }

    // Điểm giữa kỳ (2 cột)
    public double? ScoreMidterm1 { get; set; }
    public double? ScoreMidterm2 { get; set; }

    // Điểm cuối kỳ (1 cột)
    public double? ScoreFinal { get; set; }

    public double? AverageScore { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? UpdatedBy { get; set; }
}
