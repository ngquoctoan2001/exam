using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class SubjectsController : BaseApiController
{
    private readonly ISubjectService _subjectService;

    public SubjectsController(ISubjectService subjectService)
    {
        _subjectService = subjectService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubjectDto>>> GetAll()
    {
        return Ok(await _subjectService.GetAllAsync());
    }

    [HttpPost]
    public async Task<ActionResult<SubjectDto>> Create(CreateSubjectDto dto)
    {
        var subject = await _subjectService.CreateAsync(dto);
        return Ok(subject);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, CreateSubjectDto dto)
    {
        await _subjectService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _subjectService.DeleteAsync(id);
        return NoContent();
    }
}
