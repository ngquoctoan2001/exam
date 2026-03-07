using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class ClassesController : BaseApiController
{
    private readonly IClassService _classService;

    public ClassesController(IClassService classService)
    {
        _classService = classService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClassDto>>> GetAll()
    {
        return Ok(await _classService.GetAllAsync());
    }

    [HttpPost]
    public async Task<ActionResult<ClassDto>> Create(CreateClassDto dto)
    {
        var @class = await _classService.CreateAsync(dto);
        return Ok(@class);
    }

    [HttpPost("{id}/students")]
    public async Task<IActionResult> AssignStudents(long id, [FromBody] IEnumerable<long> studentIds)
    {
        await _classService.AssignStudentsAsync(id, studentIds);
        return NoContent();
    }

    [HttpGet("{id}/students")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetStudents(long id)
    {
        return Ok(await _classService.GetStudentsInClassAsync(id));
    }

    [HttpDelete("{id}/students/{studentId}")]
    public async Task<IActionResult> RemoveStudent(long id, long studentId)
    {
        await _classService.RemoveStudentFromClassAsync(id, studentId);
        return NoContent();
    }
}
