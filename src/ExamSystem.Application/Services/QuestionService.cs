using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class QuestionService : IQuestionService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public QuestionService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<QuestionDto>> GetAllAsync(long? subjectId = null)
    {
        var query = _context.Questions
            .Include(q => q.QuestionType)
            .Include(q => q.Subject)
            .Include(q => q.Options)
            .AsQueryable();

        if (subjectId.HasValue)
        {
            query = query.Where(q => q.SubjectId == subjectId.Value);
        }

        var questions = await query.ToListAsync();
        return _mapper.Map<IEnumerable<QuestionDto>>(questions);
    }

    public async Task<QuestionDto> GetByIdAsync(long id)
    {
        var question = await _context.Questions
            .Include(q => q.QuestionType)
            .Include(q => q.Subject)
            .Include(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == id);

        return _mapper.Map<QuestionDto>(question);
    }

    public async Task<QuestionDto> CreateAsync(CreateQuestionDto dto)
    {
        var question = _mapper.Map<Question>(dto);
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();
        
        return await GetByIdAsync(question.Id);
    }

    public async Task UpdateAsync(long id, CreateQuestionDto dto)
    {
        var question = await _context.Questions
            .Include(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question != null)
        {
            _mapper.Map(dto, question);
            
            // Handle options update (simple approach: clear and re-add)
            _context.QuestionOptions.RemoveRange(question.Options);
            question.Options = _mapper.Map<List<QuestionOption>>(dto.Options);

            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(long id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question != null)
        {
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
        }
    }

    public async Task AddTagAsync(long questionId, long tagId)
    {
        if (!await _context.QuestionTagMap.AnyAsync(m => m.QuestionId == questionId && m.TagId == tagId))
        {
            _context.QuestionTagMap.Add(new QuestionTagMap { QuestionId = questionId, TagId = tagId });
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveTagAsync(long questionId, long tagId)
    {
        var map = await _context.QuestionTagMap.FirstOrDefaultAsync(m => m.QuestionId == questionId && m.TagId == tagId);
        if (map != null)
        {
            _context.QuestionTagMap.Remove(map);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<QuestionDto>> GetByTagAsync(long tagId)
    {
        var questions = await _context.QuestionTagMap
            .Where(m => m.TagId == tagId)
            .Select(m => m.Question)
            .Include(q => q.Options)
            .Include(q => q.QuestionType)
            .ToListAsync();
            
        return _mapper.Map<IEnumerable<QuestionDto>>(questions);
    }

    public async Task<IEnumerable<QuestionTypeDto>> GetTypesAsync()
    {
        var types = await _context.QuestionTypes.ToListAsync();
        return _mapper.Map<IEnumerable<QuestionTypeDto>>(types);
    }
}
