using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class StudentsController : BaseApiController
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetAll()
    {
        return Ok(await _studentService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetById(long id)
    {
        var student = await _studentService.GetByIdAsync(id);
        if (student == null) return NotFound();
        return Ok(student);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> Create(RegisterDto dto)
    {
        var student = await _studentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, StudentDto dto)
    {
        await _studentService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _studentService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("File is empty");
        
        using (var stream = file.OpenReadStream())
        {
            await _studentService.ImportFromExcelAsync(stream);
        }
        
        return Ok(new { message = "Import successful" });
    }
}
