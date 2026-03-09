using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class GradingService : IGradingService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GradingService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task AutoGradeAttemptAsync(long attemptId)
    {
        var attempt = await _context.ExamAttempts
            .Include(a => a.Exam)
                .ThenInclude(e => e.ExamQuestions)
                .ThenInclude(eq => eq.Question)
                .ThenInclude(q => q.Options)
            .Include(a => a.Answers)
                .ThenInclude(ans => ans.SelectedOptions)
            .FirstOrDefaultAsync(a => a.Id == attemptId);

        if (attempt == null) return;

        decimal totalScore = 0;

        foreach (var examQuestion in attempt.Exam.ExamQuestions)
        {
            var answer = attempt.Answers.FirstOrDefault(a => a.QuestionId == examQuestion.QuestionId);
            decimal questionScore = 0;

            if (answer != null)
            {
                // MCQ (Type 1) or TrueFalse (Type 3)
                if (examQuestion.Question.QuestionTypeId == 1 || examQuestion.Question.QuestionTypeId == 3)
                {
                    var correctOptionIds = examQuestion.Question.Options
                        .Where(o => o.IsCorrect)
                        .Select(o => o.Id)
                        .ToList();

                    var selectedOptionIds = answer.SelectedOptions
                        .Select(so => so.OptionId)
                        .ToList();

                    // Basic matching: all correct options selected and no wrong options
                    if (correctOptionIds.Count > 0 && 
                        correctOptionIds.All(id => selectedOptionIds.Contains(id)) && 
                        selectedOptionIds.All(id => correctOptionIds.Contains(id)))
                    {
                        questionScore = examQuestion.MaxScore;
                    }
                }
                // ShortAnswer (Type 4)
                else if (examQuestion.Question.QuestionTypeId == 4)
                {
                    var correctText = examQuestion.Question.Options.FirstOrDefault(o => o.IsCorrect)?.Content;
                    if (!string.IsNullOrEmpty(correctText) && 
                        string.Equals(answer.AnswerText?.Trim(), correctText.Trim(), StringComparison.OrdinalIgnoreCase))
                    {
                        questionScore = examQuestion.MaxScore;
                    }
                }
                // Essay (2) or Drawing (5) require manual grading - initial score is 0
            }

            // Save GradingResult
            var gradingResult = await _context.GradingResults
                .FirstOrDefaultAsync(gr => gr.AttemptId == attemptId && gr.QuestionId == examQuestion.QuestionId);

            if (gradingResult == null)
            {
                gradingResult = new GradingResult
                {
                    AttemptId = attemptId,
                    QuestionId = examQuestion.QuestionId
                };
                _context.GradingResults.Add(gradingResult);
            }

            gradingResult.Score = questionScore;
            gradingResult.GradedAt = DateTime.UtcNow;

            totalScore += questionScore;
        }

        attempt.TotalScore = totalScore;
        
        // Update ExamResult table
        var examResult = await _context.ExamResults.FirstOrDefaultAsync(er => er.AttemptId == attemptId);
        if (examResult == null)
        {
            examResult = new ExamResult { AttemptId = attemptId };
            _context.ExamResults.Add(examResult);
        }
        examResult.TotalScore = totalScore;
        examResult.GradedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        
        // Update Statistics
        await UpdateExamStatisticsAsync(attempt.ExamId);
    }

    public async Task ManualGradeQuestionAsync(ManualGradingDto dto)
    {
        var gradingResult = await _context.GradingResults
            .FirstOrDefaultAsync(gr => gr.AttemptId == dto.AttemptId && gr.QuestionId == dto.QuestionId);

        if (gradingResult == null)
        {
            gradingResult = new GradingResult
            {
                AttemptId = dto.AttemptId,
                QuestionId = dto.QuestionId
            };
            _context.GradingResults.Add(gradingResult);
        }

        gradingResult.Score = dto.Score;
        gradingResult.GradedAt = DateTime.UtcNow;
        // gradingResult.TeacherId = ... (Set if teacher context available)

        // Handle comment
        if (!string.IsNullOrEmpty(dto.Comment))
        {
            var commentEntity = await _context.GradingComments
                .FirstOrDefaultAsync(gc => gc.GradingResultId == gradingResult.Id);
            if (commentEntity == null)
            {
                commentEntity = new GradingComment { GradingResult = gradingResult };
                _context.GradingComments.Add(commentEntity);
            }
            commentEntity.Comment = dto.Comment;
        }

        // Handle annotation (for drawing/canvas)
        if (!string.IsNullOrEmpty(dto.AnnotationData))
        {
            var annotation = await _context.GradingAnnotations
                .FirstOrDefaultAsync(ga => ga.GradingResultId == gradingResult.Id);
            if (annotation == null)
            {
                annotation = new GradingAnnotation { GradingResult = gradingResult };
                _context.GradingAnnotations.Add(annotation);
            }
            annotation.AnnotationData = dto.AnnotationData;
        }

        await _context.SaveChangesAsync();

        // Recalculate total score for attempt
        var attempt = await _context.ExamAttempts.FindAsync(dto.AttemptId);
        if (attempt != null)
        {
            attempt.TotalScore = await _context.GradingResults
                .Where(gr => gr.AttemptId == dto.AttemptId)
                .SumAsync(gr => gr.Score);
            
            var examResult = await _context.ExamResults.FirstOrDefaultAsync(er => er.AttemptId == dto.AttemptId);
            if (examResult != null) examResult.TotalScore = attempt.TotalScore;

            await _context.SaveChangesAsync();
            await UpdateExamStatisticsAsync(attempt.ExamId);
        }
    }

    public async Task<DetailedExamResultDto> GetDetailedExamResultAsync(long attemptId)
    {
        var attempt = await _context.ExamAttempts
            .Include(a => a.Exam).ThenInclude(e => e.ExamQuestions).ThenInclude(eq => eq.Question)
            .Include(a => a.GradingResults)
            .FirstOrDefaultAsync(a => a.Id == attemptId);

        if (attempt == null) return null!;

        var questionGrades = attempt.Exam.ExamQuestions.Select(eq => new QuestionGradeDto(
            eq.QuestionId,
            eq.Question.Content,
            eq.MaxScore,
            attempt.GradingResults.FirstOrDefault(gr => gr.QuestionId == eq.QuestionId)?.Score ?? 0,
            eq.Question.QuestionTypeId == 2 || eq.Question.QuestionTypeId == 5 // Essay or Drawing
        )).ToList();

        return new DetailedExamResultDto(attemptId, attempt.TotalScore ?? 0, questionGrades);
    }

    public async Task<IEnumerable<QuestionGradeDto>> GetQuestionsForGradingAsync(long examId)
    {
        // For teacher review: get all questions that need manual grading across all attempts
        var questions = await _context.ExamQuestions
            .Include(eq => eq.Question)
            .Where(eq => eq.ExamId == examId && (eq.Question.QuestionTypeId == 2 || eq.Question.QuestionTypeId == 5))
            .ToListAsync();

        return questions.Select(eq => new QuestionGradeDto(
            eq.QuestionId, 
            eq.Question.Content, 
            eq.MaxScore, 
            0, 
            true));
    }

    private async Task UpdateExamStatisticsAsync(long examId)
    {
        var results = await _context.ExamResults
            .Where(er => er.Attempt.ExamId == examId)
            .Select(er => er.TotalScore)
            .ToListAsync();

        if (!results.Any()) return;

        var stats = await _context.ExamStatistics.FindAsync(examId);
        if (stats == null)
        {
            stats = new ExamStatistic { ExamId = examId };
            _context.ExamStatistics.Add(stats);
        }

        stats.AvgScore = results.Average() ?? 0;
        stats.MaxScore = results.Max() ?? 0;
        stats.MinScore = results.Min() ?? 0;

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ExamResultDto>> SearchExamResultsAsync(long examId, decimal? minScore, decimal? maxScore)
    {
        var query = _context.ExamResults
            .Include(r => r.Attempt).ThenInclude(a => a.Student)
            .Where(r => r.Attempt.ExamId == examId);

        if (minScore.HasValue) query = query.Where(r => r.TotalScore >= minScore.Value);
        if (maxScore.HasValue) query = query.Where(r => r.TotalScore <= maxScore.Value);

        var results = await query.ToListAsync();
        return _mapper.Map<IEnumerable<ExamResultDto>>(results);
    }
}
