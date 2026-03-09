using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly IApplicationDbContext _context;

    public AuthService(
        UserManager<User> userManager, 
        RoleManager<Role> roleManager, 
        ITokenService tokenService, 
        IMapper mapper,
        IApplicationDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
        _mapper = mapper;
        _context = context;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user == null) throw new UnauthorizedAccessException("Tên đăng nhập hoặc mật khẩu không chính xác.");

        var result = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!result) throw new UnauthorizedAccessException("Tên đăng nhập hoặc mật khẩu không chính xác.");

        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.CreateToken(user, roles);

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = roles.FirstOrDefault() ?? "";

        return new AuthResponseDto(
            token, 
            "dummy_refresh_token", 
            DateTime.UtcNow.AddDays(7), 
            userDto
        );
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var user = new User
        {
            UserName = dto.Username,
            Email = dto.Email,
            FullName = dto.FullName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            throw new Exception($"Đăng ký thất bại: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        await _userManager.AddToRoleAsync(user, dto.Role);

        // Link to Teacher/Student entities if necessary
        if (dto.Role == "TEACHER" && !string.IsNullOrEmpty(dto.Code))
        {
             _context.Teachers.Add(new Teacher { UserId = user.Id, TeacherCode = dto.Code, FullName = dto.FullName });
        }
        else if (dto.Role == "STUDENT" && !string.IsNullOrEmpty(dto.Code))
        {
            _context.Students.Add(new Student { UserId = user.Id, StudentCode = dto.Code, FullName = dto.FullName });
        }
        await _context.SaveChangesAsync();

        var roles = new List<string> { dto.Role };
        var token = _tokenService.CreateToken(user, roles);

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Role = dto.Role;

        return new AuthResponseDto(
            token, 
            "dummy_refresh_token", 
            DateTime.UtcNow.AddDays(7), 
            userDto
        );
    }

    public async Task<UserDto> GetProfileAsync(long userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        return _mapper.Map<UserDto>(user);
    }

    public async Task UpdateProfileAsync(long userId, UserDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return;

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        
        await _userManager.UpdateAsync(user);
    }

    public async Task ChangePasswordAsync(long userId, ChangePasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return;

        var result = await _userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return;

        var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }
}
