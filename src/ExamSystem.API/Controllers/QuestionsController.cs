using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class QuestionsController : BaseApiController
{
    private readonly IQuestionService _questionService;

    public QuestionsController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAll([FromQuery] long? subjectId)
    {
        return Ok(await _questionService.GetAllAsync(subjectId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionDto>> GetById(long id)
    {
        var question = await _questionService.GetByIdAsync(id);
        if (question == null) return NotFound();
        return Ok(question);
    }

    [HttpGet("types")]
    public async Task<ActionResult<IEnumerable<QuestionTypeDto>>> GetTypes()
    {
        return Ok(await _questionService.GetTypesAsync());
    }

    [HttpPost]
    public async Task<ActionResult<QuestionDto>> Create(CreateQuestionDto dto)
    {
        var question = await _questionService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = question.Id }, question);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, CreateQuestionDto dto)
    {
        await _questionService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _questionService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/tags/{tagId}")]
    public async Task<IActionResult> AddTag(long id, long tagId)
    {
        await _questionService.AddTagAsync(id, tagId);
        return NoContent();
    }

    [HttpDelete("{id}/tags/{tagId}")]
    public async Task<IActionResult> RemoveTag(long id, long tagId)
    {
        await _questionService.RemoveTagAsync(id, tagId);
        return NoContent();
    }

    [HttpGet("tag/{tagId}")]
    public async Task<ActionResult<IEnumerable<QuestionDto>>> GetByTag(long tagId)
    {
        return Ok(await _questionService.GetByTagAsync(tagId));
    }
}
