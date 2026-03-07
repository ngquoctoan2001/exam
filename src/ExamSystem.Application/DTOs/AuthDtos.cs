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

public record UserDto(
    long Id, 
    string Username, 
    string Email, 
    string FullName, 
    string Role,
    bool IsActive
);

public record ChangePasswordDto(string OldPassword, string NewPassword);

public record ResetPasswordDto(string Email, string NewPassword, string Token);
