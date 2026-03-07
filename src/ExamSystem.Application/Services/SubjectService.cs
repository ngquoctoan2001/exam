using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class SubjectService : ISubjectService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SubjectService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SubjectDto>> GetAllAsync()
    {
        var subjects = await _context.Subjects.ToListAsync();
        return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
    }

    public async Task<SubjectDto> CreateAsync(CreateSubjectDto dto)
    {
        var subject = new Subject { Name = dto.Name };
        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();
        return _mapper.Map<SubjectDto>(subject);
    }

    public async Task UpdateAsync(long id, CreateSubjectDto dto)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject != null)
        {
            subject.Name = dto.Name;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(long id)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject != null)
        {
            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
        }
    }
}
