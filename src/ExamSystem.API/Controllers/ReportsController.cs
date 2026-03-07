using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class ReportsController : BaseApiController
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("class-stats")]
    public async Task<ActionResult<ClassStatsDto>> GetClassStats([FromQuery] long examId, [FromQuery] long classId)
    {
        return Ok(await _reportService.GetClassStatsAsync(examId, classId));
    }

    [HttpGet("student-progress/{classId}")]
    public async Task<ActionResult<IEnumerable<StudentProgressDto>>> GetStudentProgress(long classId)
    {
        return Ok(await _reportService.GetStudentProgressAsync(classId));
    }

    [HttpGet("export/excel/{examId}")]
    public async Task<IActionResult> ExportExcel(long examId)
    {
        var data = await _reportService.ExportExamResultsToExcelAsync(examId);
        return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"KetQua_KyThi_{examId}.xlsx");
    }

    [HttpGet("export/pdf/{examId}")]
    public async Task<IActionResult> ExportPdf(long examId)
    {
        var data = await _reportService.ExportExamResultsToPdfAsync(examId);
        return File(data, "application/pdf", $"KetQua_KyThi_{examId}.pdf");
    }
}
