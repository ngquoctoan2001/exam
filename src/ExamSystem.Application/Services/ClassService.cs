using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class ClassService : IClassService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ClassService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ClassDto>> GetAllAsync()
    {
        var classes = await _context.Classes
            .Include(c => c.HomeroomTeacher)
            .ToListAsync();
        
        return classes.Select(c => new ClassDto(
            c.Id, 
            c.Name, 
            c.HomeroomTeacherId, 
            c.HomeroomTeacher?.FullName
        ));
    }

    public async Task<ClassDto> CreateAsync(CreateClassDto dto)
    {
        var @class = _mapper.Map<Class>(dto);
        _context.Classes.Add(@class);
        await _context.SaveChangesAsync();
        return _mapper.Map<ClassDto>(@class);
    }

    public async Task AssignStudentsAsync(long classId, IEnumerable<long> studentIds)
    {
        var students = await _context.Students
            .Where(s => studentIds.Contains(s.Id))
            .ToListAsync();

        foreach (var student in students)
        {
            student.ClassId = classId;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<UserDto>> GetStudentsInClassAsync(long classId)
    {
        var students = await _context.Students
            .Where(s => s.ClassId == classId)
            .Include(s => s.User)
            .Select(s => s.User)
            .ToListAsync();
        return _mapper.Map<IEnumerable<UserDto>>(students);
    }

    public async Task RemoveStudentFromClassAsync(long classId, long studentId)
    {
        var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId && s.ClassId == classId);
        if (student != null)
        {
            student.ClassId = null; // Unassign
            await _context.SaveChangesAsync();
        }
    }
}
