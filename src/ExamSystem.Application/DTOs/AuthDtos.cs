namespace ExamSystem.Application.DTOs;

public record LoginDto(string Username, string Password);

public record RegisterDto(
    string Username, 
    string Email, 
    string Password, 
    string FullName, 
    string Role, // ADMIN, TEACHER, STUDENT
    string? Code // StudentCode or TeacherCode
);

public record AuthResponseDto(
    string Token, 
    string RefreshToken, 
    DateTime Expiration,
    UserDto User
);

public class UserDto
{
    public long Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public record ChangePasswordDto(string OldPassword, string NewPassword);

public record ResetPasswordDto(string Email, string NewPassword, string Token);

public record ImportUserResult(bool Success, string Message, int Count);
