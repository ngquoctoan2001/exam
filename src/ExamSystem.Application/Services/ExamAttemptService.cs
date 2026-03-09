using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace ExamSystem.Application.Services;

public class ExamAttemptService : IExamAttemptService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ExamAttemptService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ExamAttemptDto> StartAttemptAsync(long examId, long studentId)
    {
        var exam = await _context.Exams
            .Include(e => e.ExamQuestions)
                .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(e => e.Id == examId);

        if (exam == null) throw new Exception("Exam not found");

        // Check if there's an existing ongoing attempt
        var existingAttempt = await _context.ExamAttempts
            .Include(a => a.Exam)
            .Include(a => a.Answers)
            .FirstOrDefaultAsync(a => a.ExamId == examId && a.StudentId == studentId && a.Status == "Ongoing");

        if (existingAttempt != null)
        {
            return MapToDto(existingAttempt, exam);
        }

        var attempt = new ExamAttempt
        {
            ExamId = examId,
            StudentId = studentId,
            StartTime = DateTime.UtcNow,
            Status = "Ongoing"
        };

        _context.ExamAttempts.Add(attempt);
        await _context.SaveChangesAsync();

        return MapToDto(attempt, exam);
    }

    public async Task SaveAnswerAsync(long attemptId, SaveAnswerDto dto)
    {
        var attempt = await _context.ExamAttempts
            .Include(a => a.Answers)
            .FirstOrDefaultAsync(a => a.Id == attemptId);

        if (attempt == null || attempt.Status != "Ongoing")
            throw new Exception("Attempt not found or already submitted");

        var answer = attempt.Answers.FirstOrDefault(a => a.QuestionId == dto.QuestionId);
        if (answer == null)
        {
            answer = new Answer
            {
                AttemptId = attemptId,
                QuestionId = dto.QuestionId
            };
            _context.Answers.Add(answer);
        }

        answer.AnswerText = dto.TextAnswer;
        answer.UpdatedAt = DateTime.UtcNow;

        if (dto.CanvasDataJson != null)
        {
            if (answer.Canvas == null)
            {
                answer.Canvas = new AnswerCanvas { AnswerId = answer.Id };
            }
            answer.Canvas.JsonData = dto.CanvasDataJson;
        }

        // Handle Selected Options
        var existingOptions = await _context.AnswerOptions
            .Where(ao => ao.AnswerId == answer.Id)
            .ToListAsync();
        _context.AnswerOptions.RemoveRange(existingOptions);

        if (dto.SelectedOptionIds != null)
        {
            foreach (var optId in dto.SelectedOptionIds)
            {
                _context.AnswerOptions.Add(new AnswerOption { AnswerId = answer.Id, OptionId = optId });
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task SubmitAttemptAsync(long attemptId)
    {
        var attempt = await _context.ExamAttempts.FindAsync(attemptId);
        if (attempt == null) throw new Exception("Attempt not found");

        attempt.Status = "Submitted";
        attempt.EndTime = DateTime.UtcNow;

        // Auto Grade MCQ questions here or call GradingService
        await _context.SaveChangesAsync();
    }

    public async Task<ExamAttemptDto> GetCurrentAttemptAsync(long examId, long studentId)
    {
        var attempt = await _context.ExamAttempts
            .Include(a => a.Exam)
            .Include(a => a.Answers)
            .FirstOrDefaultAsync(a => a.ExamId == examId && a.StudentId == studentId && a.Status == "Ongoing");

        if (attempt == null) return null;

        var exam = await _context.Exams
            .Include(e => e.ExamQuestions)
                .ThenInclude(eq => eq.Question)
                    .ThenInclude(q => q.Options)
            .FirstAsync(e => e.Id == examId);

        return MapToDto(attempt, exam);
    }

    private ExamAttemptDto MapToDto(ExamAttempt attempt, Exam exam)
    {
        var remainingSeconds = (int)(exam.StartTime.AddMinutes(exam.DurationMinutes + (attempt.StartTime - exam.StartTime).TotalMinutes) - DateTime.UtcNow).TotalSeconds;
        // Simpler calculation: startTime + duration - now
        var durationMinutes = exam.DurationMinutes;
        var endTime = attempt.StartTime.AddMinutes(durationMinutes);
        remainingSeconds = (int)(endTime - DateTime.UtcNow).TotalSeconds;

        var questions = exam.ExamQuestions.OrderBy(eq => eq.OrderIndex).Select(eq => new ExamQuestionDto(
            eq.Id,
            eq.QuestionId,
            eq.Question.QuestionTypeId,
            eq.Question.Content,
            eq.OrderIndex,
            eq.Question.Options.Select(o => new ExamQuestionOptionDto(o.Id, o.OptionLabel, o.Content)).ToList()
        )).ToList();

        return new ExamAttemptDto(
            attempt.Id,
            attempt.ExamId,
            exam.Title,
            attempt.StartTime,
            attempt.EndTime,
            remainingSeconds > 0 ? remainingSeconds : 0,
            questions
        );
    }
}
