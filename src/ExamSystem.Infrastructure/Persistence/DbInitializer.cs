using ExamSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
    {
        try 
        {

            // 1. Seed Roles
            string[] roles = { "ADMIN", "TEACHER", "STUDENT" };
            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new Role { Name = roleName });
                }
            }
            Console.WriteLine("DEBUG: Roles seeded.");

            // 3. Seed Subjects
            if (!context.Subjects.Any())
            {
                context.Subjects.AddRange(new List<Subject>
                {
                    new Subject { Name = "Toán học", Code = "MATH" },
                    new Subject { Name = "Vật lý", Code = "PHYS" },
                    new Subject { Name = "Hóa học", Code = "CHEM" },
                    new Subject { Name = "Tiếng Anh", Code = "ENGL" },
                    new Subject { Name = "Ngữ văn", Code = "LITE" },
                    new Subject { Name = "Sinh học", Code = "BIOL" },
                    new Subject { Name = "Lịch sử", Code = "HIST" },
                    new Subject { Name = "Địa lý", Code = "GEOG" }
                });
                await context.SaveChangesAsync();
                Console.WriteLine("DEBUG: Subjects seeded.");
            }

            // 4. Seed Classes
            if (!context.Classes.Any())
            {
                context.Classes.AddRange(new List<Class>
                {
                    new Class { Name = "10A1", Grade = 10 },
                    new Class { Name = "10A2", Grade = 10 },
                    new Class { Name = "11A1", Grade = 11 },
                    new Class { Name = "11A2", Grade = 11 },
                    new Class { Name = "12A1", Grade = 12 },
                    new Class { Name = "12A2", Grade = 12 }
                });
                await context.SaveChangesAsync();
                
            }

            // 5. Seed Admin
            await CreateUser(userManager, "admin", "admin@examsystem.com", "System Administrator", "Admin123!", "ADMIN");
            

            // 6. Seed Teachers
            var mathSubject = await context.Subjects.FirstOrDefaultAsync(s => s.Code == "MATH");
            var physSubject = await context.Subjects.FirstOrDefaultAsync(s => s.Code == "PHYS");
            
            if (mathSubject != null)
                await CreateTeacher(context, userManager, "teacher1", "math.teacher@examsystem.com", "Nguyễn Toán Học", "Teacher123!", "GV001", mathSubject.Id);
            
            if (physSubject != null)
                await CreateTeacher(context, userManager, "teacher2", "phys.teacher@examsystem.com", "Trần Vật Lý", "Teacher123!", "GV002", physSubject.Id);

            // 7. Seed Students
            var class10A1 = await context.Classes.FirstOrDefaultAsync(c => c.Name == "10A1");
            if (class10A1 != null)
            {
                for (int i = 1; i <= 5; i++)
                {
                    await CreateStudent(context, userManager, $"student{i}", $"student{i}@examsystem.com", $"Học Sinh {i}", "Student123!", $"HS{i:D3}", class10A1.Id);
                }
            }

            // 8. Seed Question Types
            if (!context.QuestionTypes.Any())
            {
                context.QuestionTypes.AddRange(new List<QuestionType>
                {
                    new QuestionType { Name = "Trắc nghiệm một lựa chọn", Code = "MCQ" },
                    new QuestionType { Name = "Tự luận", Code = "ESSAY" },
                    new QuestionType { Name = "Vẽ đồ thị/Hình học", Code = "DRAWING" }
                });
                await context.SaveChangesAsync();
            }

            // 9. Seed Questions
            if (!context.Questions.Any())
            {
                var mcqType = context.QuestionTypes.First(t => t.Code == "MCQ");
                var teacher1 = context.Teachers.First(t => t.TeacherCode == "GV001");
                
                context.Questions.Add(new Question
                {
                    Content = "Câu hỏi 1: 1 + 1 bằng mấy?",
                    QuestionTypeId = mcqType.Id,
                    SubjectId = mathSubject.Id,
                    DifficultyLevel = 1,
                    TeacherId = teacher1.Id,
                    Options = new List<QuestionOption>
                    {
                        new QuestionOption { Content = "1", IsCorrect = false, OptionLabel = "A" },
                        new QuestionOption { Content = "2", IsCorrect = true, OptionLabel = "B" },
                        new QuestionOption { Content = "3", IsCorrect = false, OptionLabel = "C" },
                        new QuestionOption { Content = "4", IsCorrect = false, OptionLabel = "D" }
                    }
                });
                await context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"DEBUG: Seeding failed: {ex.Message}");
            throw;
        }
    }

    private static async Task<User> CreateUser(UserManager<User> userManager, string username, string email, string fullName, string password, string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new User { UserName = username, Email = email, FullName = fullName, Role = role, EmailConfirmed = true, IsActive = true };
            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            await userManager.AddToRoleAsync(user, role);
        }
        return user;
    }

    private static async Task<Teacher> CreateTeacher(ApplicationDbContext context, UserManager<User> userManager, string username, string email, string fullName, string password, string code, long subjectId)
    {
        var user = await CreateUser(userManager, username, email, fullName, password, "TEACHER");
        var teacher = await context.Teachers.FirstOrDefaultAsync(t => t.UserId == user.Id);
        if (teacher == null)
        {
            teacher = new Teacher { UserId = user.Id, TeacherCode = code, FullName = fullName, SubjectId = subjectId, Position = "Giáo viên bộ môn" };
            context.Teachers.Add(teacher);
            await context.SaveChangesAsync();
        }
        return teacher;
    }

    private static async Task<Student> CreateStudent(ApplicationDbContext context, UserManager<User> userManager, string username, string email, string fullName, string password, string code, long classId)
    {
        var user = await CreateUser(userManager, username, email, fullName, password, "STUDENT");
        var student = await context.Students.FirstOrDefaultAsync(s => s.UserId == user.Id);
        if (student == null)
        {
            student = new Student { UserId = user.Id, StudentCode = code, FullName = fullName, ClassId = classId };
            context.Students.Add(student);
            await context.SaveChangesAsync();
        }
        return student;
    }
}
