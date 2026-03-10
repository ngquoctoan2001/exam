using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class ScoreService : IScoreService
{
    private readonly IApplicationDbContext _context;

    public ScoreService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StudentScoreDto>> GetScoresByStudentAsync(long studentId)
    {
        var scores = await _context.StudentScores
            .Include(s => s.Student)
            .Include(s => s.Subject)
            .Where(s => s.StudentId == studentId)
            .ToListAsync();

        return scores.Select(MapToDto);
    }

    public async Task<IEnumerable<StudentScoreDto>> GetScoresByClassAndSubjectAsync(long classId, long subjectId, string semester, string academicYear)
    {
        // Get all students in class
        var students = await _context.Students
            .Where(s => s.ClassId == classId)
            .ToListAsync();

        // Get existing scores
        var scores = await _context.StudentScores
            .Include(s => s.Student)
            .Include(s => s.Subject)
            .Where(s => s.SubjectId == subjectId && s.Semester == semester && s.AcademicYear == academicYear && s.Student.ClassId == classId)
            .ToListAsync();

        // Map and include students without scores yet
        var result = new List<StudentScoreDto>();
        foreach (var student in students)
        {
            var score = scores.FirstOrDefault(s => s.StudentId == student.Id);
            if (score != null)
            {
                result.Add(MapToDto(score));
            }
            else
            {
                result.Add(new StudentScoreDto(0, student.Id, student.FullName, subjectId, "", semester, academicYear, null, null, null, null, null, null, null));
            }
        }

        return result;
    }

    public async Task UpdateScoreAsync(UpdateScoreDto dto)
    {
        var score = await _context.StudentScores
            .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId && 
                                    s.SubjectId == dto.SubjectId && 
                                    s.Semester == dto.Semester && 
                                    s.AcademicYear == dto.AcademicYear);

        if (score == null)
        {
            score = new StudentScore
            {
                StudentId = dto.StudentId,
                SubjectId = dto.SubjectId,
                Semester = dto.Semester,
                AcademicYear = dto.AcademicYear
            };
            _context.StudentScores.Add(score);
        }

        score.Score15p1 = dto.Score15p1;
        score.Score15p2 = dto.Score15p2;
        score.Score15p3 = dto.Score15p3;
        score.ScoreMidterm1 = dto.ScoreMidterm1;
        score.ScoreMidterm2 = dto.ScoreMidterm2;
        score.ScoreFinal = dto.ScoreFinal;
        
        // Calculate average
        score.AverageScore = CalculateAverage(score);
        score.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task<byte[]> ExportTranscriptAsync(long studentId, string academicYear)
    {
        // Placeholder for Excel/PDF export
        await Task.CompletedTask;
        return Array.Empty<byte>();
    }

    private double? CalculateAverage(StudentScore s)
    {
        double sum = 0;
        int count = 0;

        if (s.Score15p1.HasValue) { sum += s.Score15p1.Value; count += 1; }
        if (s.Score15p2.HasValue) { sum += s.Score15p2.Value; count += 1; }
        if (s.Score15p3.HasValue) { sum += s.Score15p3.Value; count += 1; }
        if (s.ScoreMidterm1.HasValue) { sum += s.ScoreMidterm1.Value * 2; count += 2; }
        if (s.ScoreMidterm2.HasValue) { sum += s.ScoreMidterm2.Value * 2; count += 2; }
        if (s.ScoreFinal.HasValue) { sum += s.ScoreFinal.Value * 3; count += 3; }

        return count > 0 ? Math.Round(sum / count, 1) : null;
    }

    private StudentScoreDto MapToDto(StudentScore s) => new StudentScoreDto(
        s.Id,
        s.StudentId,
        s.Student.FullName,
        s.SubjectId,
        s.Subject.Name,
        s.Semester,
        s.AcademicYear,
        s.Score15p1,
        s.Score15p2,
        s.Score15p3,
        s.ScoreMidterm1,
        s.ScoreMidterm2,
        s.ScoreFinal,
        s.AverageScore
    );
}
