namespace ExamSystem.Application.DTOs;

public record StudentScoreDto(
    long Id,
    long StudentId,
    string StudentName,
    long SubjectId,
    string SubjectName,
    string Semester,
    string AcademicYear,
    double? Score15p1,
    double? Score15p2,
    double? Score15p3,
    double? ScoreMidterm1,
    double? ScoreMidterm2,
    double? ScoreFinal,
    double? AverageScore
);

public record UpdateScoreDto(
    long StudentId,
    long SubjectId,
    string Semester,
    string AcademicYear,
    double? Score15p1,
    double? Score15p2,
    double? Score15p3,
    double? ScoreMidterm1,
    double? ScoreMidterm2,
    double? ScoreFinal
);
