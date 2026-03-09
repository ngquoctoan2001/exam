using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace ExamSystem.Application.Services;

public class UserService : IUserService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UserService(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UserDto> GetUserByIdAsync(long id)
    {
        var user = await _context.Users.FindAsync(id);
        return _mapper.Map<UserDto>(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _context.Users.ToListAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto> CreateUserAsync(UserDto userDto)
    {
        var user = _mapper.Map<User>(userDto);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return _mapper.Map<UserDto>(user);
    }

    public async Task UpdateUserAsync(long id, UserDto userDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _mapper.Map(userDto, user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteUserAsync(long id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<ImportUserResult> ImportStudentsAsync(Stream excelStream)
    {
        // TODO: Implement Excel import logic
        return new ImportUserResult(true, "Mock import success", 0);
    }

    public async Task<ImportUserResult> ImportTeachersAsync(Stream excelStream)
    {
        // TODO: Implement Excel import logic
        return new ImportUserResult(true, "Mock import success", 0);
    }

    public async Task<IEnumerable<UserDto>> GetAllStudentsAsync()
    {
        var students = await _context.Users.Where(u => u.UserRoles.Any(ur => ur.Role.Name == "STUDENT")).ToListAsync();
        return _mapper.Map<IEnumerable<UserDto>>(students);
    }

    public async Task<IEnumerable<UserDto>> GetAllTeachersAsync()
    {
        var teachers = await _context.Users.Where(u => u.UserRoles.Any(ur => ur.Role.Name == "TEACHER")).ToListAsync();
        return _mapper.Map<IEnumerable<UserDto>>(teachers);
    }

    public async Task<UserDto> GetUserDetailAsync(long id)
    {
        var user = await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Id == id);
        return _mapper.Map<UserDto>(user);
    }
}
