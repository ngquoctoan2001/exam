using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using MiniExcelLibs;

namespace ExamSystem.Application.Services;

public class UserService : IUserService
{
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    public UserService(UserManager<User> userManager, RoleManager<Role> roleManager, IMapper mapper)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
    }

    public async Task<ImportUserResult> ImportStudentsAsync(Stream excelStream)
    {
        var rows = excelStream.Query<ImportUserRow>().ToList();
        var result = new ImportUserResult(0, 0, new List<string>());

        foreach (var row in rows)
        {
            var user = new User
            {
                UserName = row.Code,
                Email = row.Email,
                FullName = row.FullName,
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await _userManager.CreateAsync(user, "Student@123");
            if (createResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Student");
                // TODO: Link to Student entity and Class
                result = result with { SuccessCount = result.SuccessCount + 1 };
            }
            else
            {
                result.Errors.Add($"Failed to create user {row.Code}: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
                result = result with { FailureCount = result.FailureCount + 1 };
            }
        }

        return result;
    }

    public async Task<ImportUserResult> ImportTeachersAsync(Stream excelStream)
    {
        // Similar logic for teachers
        return new ImportUserResult(0, 0, new List<string>());
    }

    public async Task<IEnumerable<UserDto>> GetAllStudentsAsync()
    {
        var students = await _userManager.GetUsersInRoleAsync("Student");
        return _mapper.Map<IEnumerable<UserDto>>(students);
    }

    public async Task<IEnumerable<UserDto>> GetAllTeachersAsync()
    {
        var teachers = await _userManager.GetUsersInRoleAsync("Teacher");
        return _mapper.Map<IEnumerable<UserDto>>(teachers);
    }

    public async Task<UserDto> GetUserDetailAsync(long id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        return _mapper.Map<UserDto>(user);
    }

    public async Task DeleteUserAsync(long id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user != null)
        {
            user.IsActive = false; // Soft delete
            await _userManager.UpdateAsync(user);
        }
    }

    private class ImportUserRow
    {
        public string Code { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
