using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IUserService
{
    Task<UserDto> GetUserByIdAsync(long id);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto> CreateUserAsync(UserDto userDto);
    Task UpdateUserAsync(long id, UserDto userDto);
    Task DeleteUserAsync(long id);

    // Advanced CRUD & Imports
    Task<ImportUserResult> ImportStudentsAsync(Stream excelStream);
    Task<ImportUserResult> ImportTeachersAsync(Stream excelStream);
    Task<IEnumerable<UserDto>> GetAllStudentsAsync();
    Task<IEnumerable<UserDto>> GetAllTeachersAsync();
    Task<UserDto> GetUserDetailAsync(long id);
}
