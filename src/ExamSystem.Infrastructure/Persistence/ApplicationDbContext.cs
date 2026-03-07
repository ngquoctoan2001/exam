using ExamSystem.Application.Interfaces;
using ExamSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<User, Role, long, IdentityUserClaim<long>, UserRole, IdentityUserLogin<long>, IdentityRoleClaim<long>, IdentityUserToken<long>>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // 2. School Structure
    public DbSet<School> Schools { get; set; } = null!;
    public DbSet<Subject> Subjects { get; set; } = null!;
    public DbSet<Class> Classes { get; set; } = null!;
    public DbSet<Teacher> Teachers { get; set; } = null!;
    public DbSet<Student> Students { get; set; } = null!;
    public DbSet<ClassSubjectTeacher> ClassSubjectTeachers { get; set; } = null!;

    // 3. Exam Management
    public DbSet<Exam> Exams { get; set; } = null!;
    public DbSet<ExamClass> ExamClasses { get; set; } = null!;
    public DbSet<ExamSettings> ExamSettings { get; set; } = null!;
    public DbSet<ExamAttempt> ExamAttempts { get; set; } = null!;

    // 4. Question Bank
    public DbSet<QuestionType> QuestionTypes { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<QuestionOption> QuestionOptions { get; set; } = null!;
    public DbSet<QuestionTag> QuestionTags { get; set; } = null!;
    public DbSet<QuestionTagMap> QuestionTagMap { get; set; } = null!;
    public DbSet<ExamQuestion> ExamQuestions { get; set; } = null!;

    // 5. Student Answers
    public DbSet<Answer> Answers { get; set; } = null!;
    public DbSet<AnswerOption> AnswerOptions { get; set; } = null!;
    public DbSet<AnswerCanvas> AnswerCanvases { get; set; } = null!;
    public DbSet<AutosaveAnswer> AutosaveAnswers { get; set; } = null!;

    // 6. Grading System
    public DbSet<GradingResult> GradingResults { get; set; } = null!;
    public DbSet<GradingAnnotation> GradingAnnotations { get; set; } = null!;
    public DbSet<GradingComment> GradingComments { get; set; } = null!;

    // 7. Results & Statistics
    public DbSet<ExamResult> ExamResults { get; set; } = null!;
    public DbSet<ClassExamResult> ClassExamResults { get; set; } = null!;
    public DbSet<ExamStatistic> ExamStatistics { get; set; } = null!;

    // 8. File Storage
    public DbSet<FileEntry> Files { get; set; } = null!;
    public DbSet<ExamFile> ExamFiles { get; set; } = null!;

    // 9. Notification System
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<NotificationUser> NotificationUsers { get; set; } = null!;

    // 10. System Logs
    public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;

    // Refinement: Auth
    public DbSet<UserSession> UserSessions { get; set; } = null!;
    public DbSet<UserLoginLog> UserLoginLogs { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Core Identity Config
        builder.Entity<UserRole>(userRole =>
        {
            userRole.HasKey(ur => new { ur.UserId, ur.RoleId });
            userRole.HasOne(ur => ur.Role).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.RoleId).IsRequired();
            userRole.HasOne(ur => ur.User).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.UserId).IsRequired();
        });

        // Many-to-many: Exam-Classes
        builder.Entity<ExamClass>()
            .HasKey(ec => new { ec.ExamId, ec.ClassId });

        // Many-to-many: Question-Options
        builder.Entity<AnswerOption>()
            .HasKey(ao => new { ao.AnswerId, ao.OptionId });

        // Class-Subject-Teacher mapping
        builder.Entity<ClassSubjectTeacher>()
            .HasOne(cst => cst.Class).WithMany().HasForeignKey(cst => cst.ClassId);
        builder.Entity<ClassSubjectTeacher>()
            .HasOne(cst => cst.Subject).WithMany().HasForeignKey(cst => cst.SubjectId);
        builder.Entity<ClassSubjectTeacher>()
            .HasOne(cst => cst.Teacher).WithMany().HasForeignKey(cst => cst.TeacherId);

        // Role-Permission mapping
        builder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

        // Exam-Files mapping
        builder.Entity<ExamFile>()
            .HasKey(ef => new { ef.ExamId, ef.FileId });

        // Notification-User mapping
        builder.Entity<NotificationUser>()
            .HasKey(nu => new { nu.NotificationId, nu.UserId });

        // ExamStatistic configuration
        builder.Entity<ExamStatistic>()
            .HasKey(es => es.ExamId);

        // Question-Tag mapping
        builder.Entity<QuestionTagMap>()
            .HasKey(m => new { m.QuestionId, m.TagId });

        // Additional constraints
        builder.Entity<Teacher>().HasIndex(t => t.TeacherCode).IsUnique();
        builder.Entity<Student>().HasIndex(s => s.StudentCode).IsUnique();
    }
}
