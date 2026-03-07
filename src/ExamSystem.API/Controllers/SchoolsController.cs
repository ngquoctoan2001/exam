using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class SchoolsController : BaseApiController
{
    private readonly ISchoolService _schoolService;

    public SchoolsController(ISchoolService schoolService)
    {
        _schoolService = schoolService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SchoolDto>>> GetAll()
    {
        return Ok(await _schoolService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SchoolDto>> GetById(long id)
    {
        var school = await _schoolService.GetByIdAsync(id);
        if (school == null) return NotFound();
        return Ok(school);
    }

    [HttpPost]
    public async Task<ActionResult<SchoolDto>> Create(CreateSchoolDto dto)
    {
        var school = await _schoolService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = school.Id }, school);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, CreateSchoolDto dto)
    {
        await _schoolService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _schoolService.DeleteAsync(id);
        return NoContent();
    }
}
