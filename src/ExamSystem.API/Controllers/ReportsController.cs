using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExamSystem.API.Controllers;

public class ReportsController : BaseApiController
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("exam/{examId}")]
    public async Task<ActionResult<IEnumerable<ExamResultDto>>> GetExamResults(long examId)
    {
        return Ok(await _reportService.GetResultsByExamAsync(examId));
    }

    [HttpGet("exam/{examId}/export")]
    public async Task<IActionResult> ExportExamReport(long examId)
    {
        var data = await _reportService.GenerateExamReportAsync(examId);
        return File(data, "application/pdf", $"ExamReport_{examId}.pdf");
    }

    [HttpGet("class/{classId}/exam/{examId}/export")]
    public async Task<IActionResult> ExportClassReport(long classId, long examId)
    {
        var data = await _reportService.GenerateClassReportAsync(classId, examId);
        return File(data, "application/pdf", $"ClassReport_{classId}_{examId}.pdf");
    }

    [HttpGet("dashboard-stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        var userId = long.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
        return Ok(await _reportService.GetDashboardStatsAsync(userId));
    }
}
