using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class SchoolService : ISchoolService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SchoolService(IApplicationDbContext context, IMapper _mapper)
    {
        _context = context;
        this._mapper = _mapper;
    }

    public async Task<IEnumerable<SchoolDto>> GetAllAsync()
    {
        var schools = await _context.Schools.ToListAsync();
        return _mapper.Map<IEnumerable<SchoolDto>>(schools);
    }

    public async Task<SchoolDto> GetByIdAsync(long id)
    {
        var school = await _context.Schools.FindAsync(id);
        return _mapper.Map<SchoolDto>(school);
    }

    public async Task<SchoolDto> CreateAsync(CreateSchoolDto dto)
    {
        var school = _mapper.Map<School>(dto);
        _context.Schools.Add(school);
        await _context.SaveChangesAsync();
        return _mapper.Map<SchoolDto>(school);
    }

    public async Task UpdateAsync(long id, CreateSchoolDto dto)
    {
        var school = await _context.Schools.FindAsync(id);
        if (school != null)
        {
            _mapper.Map(dto, school);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(long id)
    {
        var school = await _context.Schools.FindAsync(id);
        if (school != null)
        {
            _context.Schools.Remove(school);
            await _context.SaveChangesAsync();
        }
    }
}
