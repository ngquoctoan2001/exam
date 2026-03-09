using AutoMapper;
using ExamSystem.Application.DTOs;
using ExamSystem.Domain.Entities;

namespace ExamSystem.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.Role, opt => opt.Ignore());

        CreateMap<Subject, SubjectDto>().ReverseMap();
        CreateMap<CreateSubjectDto, Subject>();

        CreateMap<Class, ClassDto>()
            .ForMember(dest => dest.HomeroomTeacherName, opt => opt.Ignore()); // Will handle later
        CreateMap<CreateClassDto, Class>();

        CreateMap<Teacher, TeacherDto>()
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name));
        CreateMap<Student, StudentDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class.Name));

        CreateMap<Question, QuestionDto>()
            .ForMember(dest => dest.QuestionTypeName, opt => opt.MapFrom(src => src.QuestionType.Name))
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name));
        CreateMap<CreateQuestionDto, Question>();
        
        CreateMap<QuestionOption, QuestionOptionDto>().ReverseMap();
        CreateMap<CreateQuestionOptionDto, QuestionOption>();

        CreateMap<QuestionType, QuestionTypeDto>().ReverseMap();

        CreateMap<Exam, ExamDto>()
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name))
            .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher.FullName));
        CreateMap<CreateExamDto, Exam>()
            .ForMember(dest => dest.ExamClasses, opt => opt.Ignore()); // Handled in service
        
        CreateMap<ExamSettings, ExamSettingsDto>().ReverseMap();

        CreateMap<ExamAttempt, ExamAttemptDto>()
            .ForMember(dest => dest.ExamTitle, opt => opt.MapFrom(src => src.Exam.Title))
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Exam.ExamQuestions));

        CreateMap<ExamQuestion, ExamQuestionDto>()
            .ForMember(dest => dest.QuestionId, opt => opt.MapFrom(src => src.QuestionId))
            .ForMember(dest => dest.QuestionTypeId, opt => opt.MapFrom(src => src.Question.QuestionTypeId))
            .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Question.Content))
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.Question.Options));

        CreateMap<QuestionOption, ExamQuestionOptionDto>();

        CreateMap<ExamResult, ExamResultDto>()
            .ForMember(dest => dest.ExamTitle, opt => opt.MapFrom(src => src.Attempt.Exam.Title))
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Attempt.Student.FullName))
            .ForMember(dest => dest.Score, opt => opt.MapFrom(src => src.TotalScore));

        CreateMap<GradingResult, QuestionGradeDto>()
            .ForMember(dest => dest.QuestionContent, opt => opt.MapFrom(src => src.Question.Content));
    }
}
