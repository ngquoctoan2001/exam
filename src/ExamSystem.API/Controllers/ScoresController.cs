using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ScoresController : ControllerBase
{
    private readonly IScoreService _scoreService;

    public ScoresController(IScoreService scoreService)
    {
        _scoreService = scoreService;
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetByStudent(long studentId)
    {
        var scores = await _scoreService.GetScoresByStudentAsync(studentId);
        return Ok(scores);
    }

    [HttpGet("class-subject")]
    public async Task<IActionResult> GetByClassAndSubject(long classId, long subjectId, string semester, string academicYear)
    {
        var scores = await _scoreService.GetScoresByClassAndSubjectAsync(classId, subjectId, semester, academicYear);
        return Ok(scores);
    }

    [HttpPost("update")]
    [Authorize(Roles = "TEACHER,ADMIN")]
    public async Task<IActionResult> Update(UpdateScoreDto dto)
    {
        await _scoreService.UpdateScoreAsync(dto);
        return Ok(new { message = "Cập nhật điểm thành công" });
    }

    [HttpGet("export/{studentId}")]
    public async Task<IActionResult> Export(long studentId, string academicYear)
    {
        var data = await _scoreService.ExportTranscriptAsync(studentId, academicYear);
        return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "hoc-ba.xlsx");
    }
}
