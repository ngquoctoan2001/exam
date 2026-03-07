namespace ExamSystem.Application.DTOs;

public record ClassStatsDto(
    long ClassId,
    string ClassName,
    int TotalStudents,
    int ParticipatedCount,
    decimal AverageScore,
    decimal MaxScore,
    decimal MinScore,
    List<ScoreRangeDto> ScoreDistribution
);

public record ScoreRangeDto(string Range, int Count);

public record StudentProgressDto(
    long StudentId,
    string FullName,
    int ExamsTaken,
    decimal AverageScore,
    List<ExamScoreDto> RecentScores
);

public record ExamScoreDto(string ExamTitle, decimal Score, DateTime Date);
