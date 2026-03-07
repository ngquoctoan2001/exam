using ExamSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
    {
        // 1. Ensure Database is created
        await context.Database.EnsureCreatedAsync();

        // 2. Seed Roles
        string[] roles = { "ADMIN", "TEACHER", "STUDENT" };

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new Role { Name = roleName });
            }
        }

        // 3. Seed Admin
        var adminEmail = "admin@examsystem.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new User
            {
                UserName = "admin",
                Email = adminEmail,
                FullName = "System Administrator",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "ADMIN");
            }
        }

        // 4. Seed Teacher
        var teacherEmail = "teacher@examsystem.com";
        var teacherUser = await userManager.FindByEmailAsync(teacherEmail);
        if (teacherUser == null)
        {
            teacherUser = new User
            {
                UserName = "teacher",
                Email = teacherEmail,
                FullName = "Nguyễn Văn Giáo Viên",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(teacherUser, "Teacher123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(teacherUser, "TEACHER");
                
                if (!context.Teachers.Any(t => t.UserId == teacherUser.Id))
                {
                    context.Teachers.Add(new Teacher 
                    { 
                        UserId = teacherUser.Id, 
                        TeacherCode = "GV001", 
                        FullName = "Nguyễn Văn Giáo Viên" 
                    });
                }
            }
        }

        // 5. Seed Student
        var studentEmail = "student@examsystem.com";
        var studentUser = await userManager.FindByEmailAsync(studentEmail);
        if (studentUser == null)
        {
            studentUser = new User
            {
                UserName = "student",
                Email = studentEmail,
                FullName = "Trần Văn Học Sinh",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(studentUser, "Student123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(studentUser, "STUDENT");

                if (!context.Students.Any(s => s.UserId == studentUser.Id))
                {
                    context.Students.Add(new Student 
                    { 
                        UserId = studentUser.Id, 
                        StudentCode = "HS001", 
                        FullName = "Trần Văn Học Sinh" 
                    });
                }
            }
        }

        await context.SaveChangesAsync();
    }
}
