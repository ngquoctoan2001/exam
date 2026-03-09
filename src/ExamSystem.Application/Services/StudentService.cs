using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class StudentService : IStudentService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IAuthService _authService;

    public StudentService(IApplicationDbContext context, IMapper mapper, IAuthService authService)
    {
        _context = context;
        _mapper = mapper;
        _authService = authService;
    }

    public async Task<IEnumerable<StudentDto>> GetAllAsync()
    {
        var students = await _context.Students
            .Include(s => s.User)
            .Include(s => s.Class)
            .ToListAsync();
        
        return students.Select(s => new StudentDto(
            s.Id,
            s.StudentCode,
            s.FullName,
            s.Class?.Name ?? "Chưa gán lớp"
        ));
    }

    public async Task<StudentDto> GetByIdAsync(long id)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .Include(s => s.Class)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null) return null!;

        return new StudentDto(
            student.Id,
            student.StudentCode,
            student.FullName,
            student.Class?.Name ?? "Chưa gán lớp"
        );
    }

    public async Task<StudentDto> CreateAsync(RegisterDto dto)
    {
        dto = dto with { Role = "STUDENT" };
        var authResponse = await _authService.RegisterAsync(dto);
        
        var student = await _context.Students
            .Include(s => s.Class)
            .FirstOrDefaultAsync(s => s.UserId == authResponse.User.Id);

        return new StudentDto(
            student!.Id,
            student.StudentCode,
            student.FullName,
            student.Class?.Name ?? "Chưa gán lớp"
        );
    }

    public async Task UpdateAsync(long id, StudentDto dto)
    {
        var student = await _context.Students.FindAsync(id);
        if (student != null)
        {
            student.StudentCode = dto.StudentCode;
            student.FullName = dto.FullName;
            // Class update logic
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(long id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student != null)
        {
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ImportFromExcelAsync(Stream fileStream)
    {
        // TODO: Implement Excel parsing using EPPlus or NPOI
        // For now, this is a placeholder
        await Task.CompletedTask;
    }
}
