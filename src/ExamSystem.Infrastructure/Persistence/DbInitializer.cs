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

            // 2. Seed Subjects
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
                    new Subject { Name = "Địa lý", Code = "GEOG" },
                    new Subject { Name = "Tin học", Code = "COMP" }
                });
                await context.SaveChangesAsync();
            }

            // 3. Seed Classes
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

            // 4. Seed Admin
            await CreateUser(userManager, "admin", "admin@examsystem.com", "System Administrator", "Admin123!", "ADMIN");

            // 5. Seed Teachers
            var mathSubject = await context.Subjects.FirstAsync(s => s.Code == "MATH");
            var physSubject = await context.Subjects.FirstAsync(s => s.Code == "PHYS");
            var engSubject = await context.Subjects.FirstAsync(s => s.Code == "ENGL");
            var compSubject = await context.Subjects.FirstAsync(s => s.Code == "COMP");

            var t1 = await CreateTeacher(context, userManager, "teacher1", "math.teacher@examsystem.com", "Nguyễn Toán Học", "Teacher123!", "GV001", mathSubject.Id);
            var t2 = await CreateTeacher(context, userManager, "teacher2", "phys.teacher@examsystem.com", "Trần Vật Lý", "Teacher123!", "GV002", physSubject.Id);
            var t3 = await CreateTeacher(context, userManager, "teacher3", "eng.teacher@examsystem.com", "Lê Tiếng Anh", "Teacher123!", "GV003", engSubject.Id);
            var t4 = await CreateTeacher(context, userManager, "teacher4", "comp.teacher@examsystem.com", "Phạm Tin Học", "Teacher123!", "GV004", compSubject.Id);

            // 5.1 Assign Homeroom Teachers
            var classes = await context.Classes.ToListAsync();
            if (classes.Count >= 4)
            {
                classes[0].HomeroomTeacherId = t1.Id; // 10A1
                classes[1].HomeroomTeacherId = t2.Id; // 10A2
                classes[2].HomeroomTeacherId = t3.Id; // 11A1
                classes[3].HomeroomTeacherId = t4.Id; // 11A2
                await context.SaveChangesAsync();
            }

            // 5.2 Assign Subject Teachers (ClassSubjectTeacher)
            if (!context.ClassSubjectTeachers.Any())
            {
                foreach (var cls in classes)
                {
                    context.ClassSubjectTeachers.Add(new ClassSubjectTeacher { ClassId = cls.Id, SubjectId = mathSubject.Id, TeacherId = t1.Id });
                    context.ClassSubjectTeachers.Add(new ClassSubjectTeacher { ClassId = cls.Id, SubjectId = physSubject.Id, TeacherId = t2.Id });
                    context.ClassSubjectTeachers.Add(new ClassSubjectTeacher { ClassId = cls.Id, SubjectId = engSubject.Id, TeacherId = t3.Id });
                    context.ClassSubjectTeachers.Add(new ClassSubjectTeacher { ClassId = cls.Id, SubjectId = compSubject.Id, TeacherId = t4.Id });
                }
                await context.SaveChangesAsync();
            }

            // 6. Seed Students (Expanded to 30 students)
            if (!context.Students.Any())
            {
                var students = new List<Student>();
                for (int i = 1; i <= 30; i++)
                {
                    var targetClass = classes[(i - 1) % classes.Count];
                    var s = await CreateStudent(context, userManager, $"student{i}", $"student{i}@examsystem.com", $"Học Sinh {i}", "Student123!", $"HS{i:D3}", targetClass.Id);
                    students.Add(s);
                }
            }

            // 7. Seed Question Types
            if (!context.QuestionTypes.Any())
            {
                context.QuestionTypes.AddRange(new List<QuestionType>
                {
                    new QuestionType { Name = "Trắc nghiệm một lựa chọn", Code = "MCQ" },
                    new QuestionType { Name = "Tự luận", Code = "ESSAY" }
                });
                await context.SaveChangesAsync();
            }

            // 8. Seed Questions
            if (!context.Questions.Any())
            {
                var mcqType = await context.QuestionTypes.FirstAsync(t => t.Code == "MCQ");
                var essayType = await context.QuestionTypes.FirstAsync(t => t.Code == "ESSAY");

                // Math Questions
                for (int i = 1; i <= 10; i++)
                {
                    context.Questions.Add(new Question
                    {
                        Content = $"Câu hỏi Toán học {i}: Tính giá trị của biểu thức {i}*X + {i*2} = 0?",
                        QuestionTypeId = mcqType.Id,
                        SubjectId = mathSubject.Id,
                        DifficultyLevel = (i % 3) + 1,
                        TeacherId = t1.Id,
                        Options = new List<QuestionOption>
                        {
                            new QuestionOption { Content = $"{i}", IsCorrect = false, OptionLabel = "A" },
                            new QuestionOption { Content = $"-{i*2}", IsCorrect = true, OptionLabel = "B" },
                            new QuestionOption { Content = "0", IsCorrect = false, OptionLabel = "C" },
                            new QuestionOption { Content = "1", IsCorrect = false, OptionLabel = "D" }
                        }
                    });
                }

                // Physics Questions
                context.Questions.Add(new Question
                {
                    Content = "Định luật I Newton còn được gọi là gì?",
                    QuestionTypeId = mcqType.Id,
                    SubjectId = physSubject.Id,
                    DifficultyLevel = 1,
                    TeacherId = t2.Id,
                    Options = new List<QuestionOption>
                    {
                        new QuestionOption { Content = "Định luật bảo toàn", IsCorrect = false, OptionLabel = "A" },
                        new QuestionOption { Content = "Định luật quán tính", IsCorrect = true, OptionLabel = "B" },
                        new QuestionOption { Content = "Định luật vạn vật hấp dẫn", IsCorrect = false, OptionLabel = "C" },
                        new QuestionOption { Content = "Định luật về lực", IsCorrect = false, OptionLabel = "D" }
                    }
                });

                context.Questions.Add(new Question
                {
                    Content = "Hãy trình bày các bước giải bài toán chuyển động thẳng biến đổi đều.",
                    QuestionTypeId = essayType.Id,
                    SubjectId = physSubject.Id,
                    DifficultyLevel = 2,
                    TeacherId = t2.Id
                });

                await context.SaveChangesAsync();
            }

            // 9. Seed Exams
            if (!context.Exams.Any())
            {
                var class10A1 = classes.FirstOrDefault(c => c.Name == "10A1") ?? classes[0];
                var mathExam = new Exam
                {
                    Title = "Kiểm tra Toán 15 phút - Chương 1",
                    SubjectId = mathSubject.Id,
                    TeacherId = t1.Id,
                    DurationMinutes = 15,
                    StartTime = DateTime.UtcNow.AddHours(-1),
                    EndTime = DateTime.UtcNow.AddHours(2),
                    Status = "Published",
                    Settings = new ExamSettings { ShuffleQuestions = true, ShuffleAnswers = true, ShowResultImmediately = true, AllowReview = true }
                };
                mathExam.ExamClasses.Add(new ExamClass { ClassId = class10A1.Id });
                
                // Add questions to exam
                var mathQuestions = await context.Questions.Where(q => q.SubjectId == mathSubject.Id).Take(5).ToListAsync();
                foreach (var q in mathQuestions)
                {
                    mathExam.ExamQuestions.Add(new ExamQuestion { QuestionId = q.Id });
                }

                var physExam = new Exam
                {
                    Title = "Thi cuối kỳ Vật lý 10",
                    SubjectId = physSubject.Id,
                    TeacherId = t2.Id,
                    DurationMinutes = 45,
                    StartTime = DateTime.UtcNow.AddDays(-5),
                    EndTime = DateTime.UtcNow.AddDays(-4),
                    Status = "Finished",
                    Settings = new ExamSettings { ShuffleQuestions = false, ShowResultImmediately = true, AllowReview = true }
                };
                physExam.ExamClasses.Add(new ExamClass { ClassId = class10A1.Id });

                context.Exams.AddRange(mathExam, physExam);
                await context.SaveChangesAsync();

                // 10. Seed Attempts & Statistics for Finished Exam
                var studentsList = await context.Students.ToListAsync();
                var student1 = studentsList.FirstOrDefault();

                if (student1 != null)
                {
                    var attempt = new ExamAttempt
                    {
                        ExamId = physExam.Id,
                        StudentId = student1.Id,
                        StartTime = physExam.StartTime.AddMinutes(5),
                        EndTime = physExam.StartTime.AddMinutes(40),
                        Status = "Graded",
                        TotalScore = 8.5m
                    };
                    context.ExamAttempts.Add(attempt);
                    await context.SaveChangesAsync();

                    context.ExamResults.Add(new ExamResult
                    {
                        AttemptId = attempt.Id,
                        TotalScore = 8.5m,
                        GradedAt = DateTime.UtcNow
                    });

                    context.ExamStatistics.Add(new ExamStatistic
                    {
                        ExamId = physExam.Id,
                        AvgScore = 8.5m,
                        MaxScore = 8.5m,
                        MinScore = 8.5m
                    });
                    await context.SaveChangesAsync();
                }
            }

            Console.WriteLine("DEBUG: Seeding completed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"DEBUG: Seeding failed: {ex.Message}");
            if (ex.InnerException != null) Console.WriteLine($"INNER: {ex.InnerException.Message}");
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
