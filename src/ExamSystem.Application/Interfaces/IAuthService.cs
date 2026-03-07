using ExamSystem.Application.DTOs;

namespace ExamSystem.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<UserDto> GetProfileAsync(long userId);
    Task UpdateProfileAsync(long userId, UserDto dto);
    Task ChangePasswordAsync(long userId, ChangePasswordDto dto);
    Task ResetPasswordAsync(ResetPasswordDto dto);
}
