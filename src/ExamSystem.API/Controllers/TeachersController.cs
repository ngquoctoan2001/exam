using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class TeachersController : BaseApiController
{
    private readonly ITeacherService _teacherService;

    public TeachersController(ITeacherService teacherService)
    {
        _teacherService = teacherService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeacherDto>>> GetAll()
    {
        return Ok(await _teacherService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeacherDto>> GetById(long id)
    {
        var teacher = await _teacherService.GetByIdAsync(id);
        if (teacher == null) return NotFound();
        return Ok(teacher);
    }

    [HttpPost]
    public async Task<ActionResult<TeacherDto>> Create(RegisterDto dto)
    {
        var teacher = await _teacherService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = teacher.Id }, teacher);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, TeacherDto dto)
    {
        await _teacherService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _teacherService.DeleteAsync(id);
        return NoContent();
    }
}
