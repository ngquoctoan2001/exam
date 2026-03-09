using System.Reflection;
using ExamSystem.Application.Interfaces;
using ExamSystem.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ExamSystem.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ISubjectService, SubjectService>();
        services.AddScoped<IClassService, ClassService>();
        services.AddScoped<ITeacherService, TeacherService>();
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<IActivityLogService, ActivityLogService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IQuestionService, QuestionService>();
        services.AddScoped<IExamService, ExamService>();
        services.AddScoped<IExamAttemptService, ExamAttemptService>();
        services.AddScoped<IGradingService, GradingService>();
        services.AddScoped<ISystemSettingsService, SystemSettingsService>();

        return services;
    }
}
