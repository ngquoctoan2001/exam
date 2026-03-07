using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class ExamAttemptService : IExamAttemptService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IGradingService _gradingService;

    public ExamAttemptService(IApplicationDbContext context, IMapper mapper, IGradingService gradingService)
    {
        _context = context;
        _mapper = mapper;
        _gradingService = gradingService;
    }

    public async Task<ExamAttemptDto> StartAttemptAsync(long examId, long studentId)
    {
        var attempt = await _context.ExamAttempts
            .Include(a => a.Exam).ThenInclude(e => e.Settings)
            .Include(a => a.Exam).ThenInclude(e => e.Subject)
            .FirstOrDefaultAsync(a => a.ExamId == examId && a.StudentId == studentId && a.EndTime == null);

        if (attempt == null)
        {
            attempt = new ExamAttempt
            {
                ExamId = examId,
                StudentId = studentId,
                StartTime = DateTime.UtcNow
            };
            _context.ExamAttempts.Add(attempt);
            await _context.SaveChangesAsync();
        }

        return await GetAttemptDtoAsync(attempt.Id);
    }

    public async Task SaveAnswerAsync(long attemptId, SaveAnswerDto dto)
    {
        var answer = await _context.Answers
            .Include(a => a.SelectedOptions)
            .Include(a => a.Canvas)
            .FirstOrDefaultAsync(a => a.AttemptId == attemptId && a.QuestionId == dto.QuestionId);

        if (answer == null)
        {
            answer = new Answer
            {
                AttemptId = attemptId,
                QuestionId = dto.QuestionId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Answers.Add(answer);
        }

        answer.AnswerText = dto.TextAnswer;
        answer.UpdatedAt = DateTime.UtcNow;

        // Update Options
        if (dto.SelectedOptionIds != null)
        {
            _context.AnswerOptions.RemoveRange(answer.SelectedOptions);
            foreach (var optId in dto.SelectedOptionIds)
            {
                _context.AnswerOptions.Add(new AnswerOption { Answer = answer, OptionId = optId });
            }
        }

        // Update Canvas
        if (!string.IsNullOrEmpty(dto.CanvasDataJson))
        {
            if (answer.Canvas == null)
            {
                answer.Canvas = new AnswerCanvas { Answer = answer };
            }
            answer.Canvas.JsonData = dto.CanvasDataJson;
        }

        await _context.SaveChangesAsync();

        // Also update autosave record for redundancy
        var autosave = await _context.AutosaveAnswers
            .FirstOrDefaultAsync(asv => asv.AttemptId == attemptId && asv.QuestionId == dto.QuestionId);
        
        if (autosave == null)
        {
            autosave = new AutosaveAnswer { AttemptId = attemptId, QuestionId = dto.QuestionId };
            _context.AutosaveAnswers.Add(autosave);
        }
        autosave.Data = dto.TextAnswer ?? dto.CanvasDataJson ?? string.Join(",", dto.SelectedOptionIds ?? new List<long>());
        autosave.SavedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
    }

    public async Task SubmitAttemptAsync(long attemptId)
    {
        var attempt = await _context.ExamAttempts.FindAsync(attemptId);
        if (attempt != null && attempt.EndTime == null)
        {
            attempt.EndTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            
            // Trigger Auto-grading here
            await _gradingService.AutoGradeAttemptAsync(attemptId);
        }
    }

    public async Task<ExamAttemptDto> GetCurrentAttemptAsync(long examId, long studentId)
    {
        var attempt = await _context.ExamAttempts
            .FirstOrDefaultAsync(a => a.ExamId == examId && a.StudentId == studentId && a.EndTime == null);
        
        return attempt != null ? await GetAttemptDtoAsync(attempt.Id) : null!;
    }

    private async Task<ExamAttemptDto> GetAttemptDtoAsync(long attemptId)
    {
        var attempt = await _context.ExamAttempts
            .Include(a => a.Exam).ThenInclude(e => e.Subject)
            .Include(a => a.Exam).ThenInclude(e => e.Settings)
            .Include(a => a.Exam).ThenInclude(e => e.ExamQuestions).ThenInclude(eq => eq.Question).ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(a => a.Id == attemptId);

        var dto = _mapper.Map<ExamAttemptDto>(attempt);

        // Shuffle questions if enabled
        if (attempt?.Exam?.Settings?.ShuffleQuestions == true && dto.Questions != null)
        {
            var rng = new Random();
            dto = dto with { Questions = dto.Questions.OrderBy(_ => rng.Next()).ToList() };
        }

        // Shuffle options for each question if enabled
        if (attempt?.Exam?.Settings?.ShuffleAnswers == true && dto.Questions != null)
        {
            var rng = new Random();
            foreach (var q in dto.Questions)
            {
                if (q.Options != null)
                {
                    var shuffled = q.Options.OrderBy(_ => rng.Next()).ToList();
                    dto.Questions[dto.Questions.IndexOf(q)] = q with { Options = shuffled };
                }
            }
        }
        
        // Calculate remaining time
        var elapsedSeconds = (int)(DateTime.UtcNow - attempt!.StartTime).TotalSeconds;
        var durationSeconds = attempt.Exam.DurationMinutes * 60;
        dto = dto with { RemainingSeconds = Math.Max(0, durationSeconds - elapsedSeconds) };

        return dto;
    }
}
