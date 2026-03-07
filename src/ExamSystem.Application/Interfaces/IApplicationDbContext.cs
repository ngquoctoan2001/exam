using ExamSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamSystem.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<School> Schools { get; }
    DbSet<Subject> Subjects { get; }
    DbSet<Class> Classes { get; }
    DbSet<Teacher> Teachers { get; }
    DbSet<Student> Students { get; }
    DbSet<ClassSubjectTeacher> ClassSubjectTeachers { get; }
    DbSet<Exam> Exams { get; }
    DbSet<ExamClass> ExamClasses { get; }
    DbSet<ExamSettings> ExamSettings { get; }
    DbSet<ExamAttempt> ExamAttempts { get; }
    DbSet<QuestionType> QuestionTypes { get; }
    DbSet<Question> Questions { get; }
    DbSet<QuestionOption> QuestionOptions { get; }
    DbSet<QuestionTag> QuestionTags { get; }
    DbSet<QuestionTagMap> QuestionTagMap { get; }
    DbSet<ExamQuestion> ExamQuestions { get; }
    DbSet<Answer> Answers { get; }
    DbSet<AnswerOption> AnswerOptions { get; }
    DbSet<AnswerCanvas> AnswerCanvases { get; }
    DbSet<AutosaveAnswer> AutosaveAnswers { get; }
    DbSet<GradingResult> GradingResults { get; }
    DbSet<GradingAnnotation> GradingAnnotations { get; }
    DbSet<GradingComment> GradingComments { get; }
    DbSet<ExamResult> ExamResults { get; }
    DbSet<ClassExamResult> ClassExamResults { get; }
    DbSet<ExamStatistic> ExamStatistics { get; }
    DbSet<FileEntry> Files { get; }
    DbSet<ExamFile> ExamFiles { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<NotificationUser> NotificationUsers { get; }
    DbSet<ActivityLog> ActivityLogs { get; }
    DbSet<SystemSetting> SystemSettings { get; }
    DbSet<UserSession> UserSessions { get; }
    DbSet<UserLoginLog> UserLoginLogs { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<RolePermission> RolePermissions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
