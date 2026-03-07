using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class GradingController : BaseApiController
{
    private readonly IGradingService _gradingService;

    public GradingController(IGradingService gradingService)
    {
        _gradingService = gradingService;
    }

    [HttpPost("auto-grade/{attemptId}")]
    public async Task<IActionResult> AutoGrade(long attemptId)
    {
        await _gradingService.AutoGradeAttemptAsync(attemptId);
        return NoContent();
    }

    [HttpPost("manual-grade")]
    public async Task<IActionResult> ManualGrade(ManualGradingDto dto)
    {
        await _gradingService.ManualGradeQuestionAsync(dto);
        return NoContent();
    }

    [HttpGet("result/{attemptId}")]
    public async Task<ActionResult<ExamResultDto>> GetResult(long attemptId)
    {
        return Ok(await _gradingService.GetExamResultAsync(attemptId));
    }

    [HttpGet("exam/{examId}/questions-for-grading")]
    public async Task<ActionResult<IEnumerable<QuestionGradeDto>>> GetQuestionsForGrading(long examId)
    {
        return Ok(await _gradingService.GetQuestionsForGradingAsync(examId));
    }

    [HttpGet("exam/{examId}/search")]
    public async Task<ActionResult<IEnumerable<ExamResultDto>>> SearchResults(long examId, [FromQuery] decimal? minScore, [FromQuery] decimal? maxScore)
    {
        return Ok(await _gradingService.SearchExamResultsAsync(examId, minScore, maxScore));
    }
}
