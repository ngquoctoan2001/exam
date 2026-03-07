using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class ExamService : IExamService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ExamService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ExamDto>> GetAllAsync(long? teacherId = null, long? classId = null)
    {
        var query = _context.Exams
            .Include(e => e.Subject)
            .Include(e => e.Teacher)
            .Include(e => e.Settings)
            .AsQueryable();

        if (teacherId.HasValue) query = query.Where(e => e.TeacherId == teacherId.Value);
        if (classId.HasValue) query = query.Where(e => e.ExamClasses.Any(ec => ec.ClassId == classId.Value));

        var exams = await query.ToListAsync();
        return _mapper.Map<IEnumerable<ExamDto>>(exams);
    }

    public async Task<ExamDto> GetByIdAsync(long id)
    {
        var exam = await _context.Exams
            .Include(e => e.Subject)
            .Include(e => e.Teacher)
            .Include(e => e.Settings)
            .Include(e => e.ExamQuestions)
            .FirstOrDefaultAsync(e => e.Id == id);

        return _mapper.Map<ExamDto>(exam);
    }

    public async Task<ExamDto> CreateAsync(CreateExamDto dto)
    {
        var exam = _mapper.Map<Exam>(dto);
        
        _context.Exams.Add(exam);
        
        // Add class mappings
        foreach (var classId in dto.ClassIds)
        {
            _context.ExamClasses.Add(new ExamClass { Exam = exam, ClassId = classId });
        }

        await _context.SaveChangesAsync();
        return await GetByIdAsync(exam.Id);
    }

    public async Task UpdateStatusAsync(long id, string status)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam != null)
        {
            exam.Status = status;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(long id)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam != null)
        {
            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();
        }
    }

    public async Task AddQuestionsAsync(long examId, IEnumerable<long> questionIds)
    {
        var lastOrder = await _context.ExamQuestions
            .Where(eq => eq.ExamId == examId)
            .Select(eq => (int?)eq.OrderIndex)
            .MaxAsync() ?? 0;

        foreach (var questionId in questionIds)
        {
            _context.ExamQuestions.Add(new ExamQuestion 
            { 
                ExamId = examId, 
                QuestionId = questionId, 
                OrderIndex = ++lastOrder,
                MaxScore = 1 // Default
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task UpdateSettingsAsync(long examId, ExamSettingsDto dto)
    {
        var settings = await _context.ExamSettings.FirstOrDefaultAsync(s => s.ExamId == examId);
        if (settings != null)
        {
            _mapper.Map(dto, settings);
            await _context.SaveChangesAsync();
        }
    }

    public async Task AssignClassesAsync(long examId, IEnumerable<long> classIds)
    {
        foreach (var classId in classIds)
        {
            if (!await _context.ExamClasses.AnyAsync(ec => ec.ExamId == examId && ec.ClassId == classId))
            {
                _context.ExamClasses.Add(new ExamClass { ExamId = examId, ClassId = classId });
            }
        }
        await _context.SaveChangesAsync();
    }

    public async Task UnassignClassAsync(long examId, long classId)
    {
        var map = await _context.ExamClasses.FirstOrDefaultAsync(ec => ec.ExamId == examId && ec.ClassId == classId);
        if (map != null)
        {
            _context.ExamClasses.Remove(map);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<ClassDto>> GetExamClassesAsync(long examId)
    {
        var classes = await _context.ExamClasses
            .Where(ec => ec.ExamId == examId)
            .Select(ec => ec.Class)
            .ToListAsync();
        return _mapper.Map<IEnumerable<ClassDto>>(classes);
    }
}
