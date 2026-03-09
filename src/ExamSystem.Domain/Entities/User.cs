using Microsoft.AspNetCore.Identity;

namespace ExamSystem.Domain.Entities;

public class User : IdentityUser<long>
{
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public class Role : IdentityRole<long>
{
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public class UserRole : IdentityUserRole<long>
{
    public virtual User User { get; set; } = null!;
    public virtual Role Role { get; set; } = null!;
}
