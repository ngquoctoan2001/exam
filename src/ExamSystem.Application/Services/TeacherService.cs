using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class TeacherService : ITeacherService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuthService _authService;

    public TeacherService(IApplicationDbContext context, IMapper mapper, IAuthService authService)
    {
        _context = context;
        _mapper = mapper;
        _authService = authService;
    }

    public async Task<IEnumerable<TeacherDto>> GetAllAsync()
    {
        var teachers = await _context.Teachers
            .Include(t => t.User)
            .Include(t => t.Subject)
            .ToListAsync();
        
        return teachers.Select(t => new TeacherDto(
            t.Id,
            t.TeacherCode,
            t.FullName,
            t.Subject?.Name ?? "N/A",
            t.Position
        ));
    }

    public async Task<TeacherDto> GetByIdAsync(long id)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .Include(t => t.Subject)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (teacher == null) return null!;

        return new TeacherDto(
            teacher.Id,
            teacher.TeacherCode,
            teacher.FullName,
            teacher.Subject?.Name ?? "N/A",
            teacher.Position
        );
    }

    public async Task<TeacherDto> CreateAsync(RegisterDto dto)
    {
        // Use AuthService to create user with TEACHER role
        dto = dto with { Role = "TEACHER" };
        var authResponse = await _authService.RegisterAsync(dto);
        
        // The RegisterAsync in AuthService already creates the Teacher record if role is TEACHER
        // We just need to retrieve it to return the DTO
        var teacher = await _context.Teachers
            .Include(t => t.Subject)
            .FirstOrDefaultAsync(t => t.UserId == authResponse.User.Id);

        return new TeacherDto(
            teacher!.Id,
            teacher.TeacherCode,
            teacher.FullName,
            teacher.Subject?.Name ?? "N/A",
            teacher.Position
        );
    }

    public async Task UpdateAsync(long id, TeacherDto dto)
    {
        var teacher = await _context.Teachers.FindAsync(id);
        if (teacher != null)
        {
            teacher.TeacherCode = dto.TeacherCode;
            teacher.FullName = dto.FullName;
            teacher.Position = dto.Position;
            // Subject update logic could be more complex (finding by name or adding SubjectId to DTO)
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(long id)
    {
        var teacher = await _context.Teachers.FindAsync(id);
        if (teacher != null)
        {
            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
        }
    }
}
