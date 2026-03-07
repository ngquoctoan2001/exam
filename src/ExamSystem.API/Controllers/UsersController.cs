using ExamSystem.Application.DTOs;
using ExamSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class UsersController : BaseApiController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("import-students")]
    public async Task<IActionResult> ImportStudents(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("File is empty");
        
        using var stream = file.OpenReadStream();
        var result = await _userService.ImportStudentsAsync(stream);
        return Ok(result);
    }

    [HttpPost("import-teachers")]
    public async Task<IActionResult> ImportTeachers(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("File is empty");

        using var stream = file.OpenReadStream();
        var result = await _userService.ImportTeachersAsync(stream);
        return Ok(result);
    }

    [HttpGet("students")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllStudents()
    {
        return Ok(await _userService.GetAllStudentsAsync());
    }

    [HttpGet("teachers")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllTeachers()
    {
        return Ok(await _userService.GetAllTeachersAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(long id)
    {
        var user = await _userService.GetUserDetailAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _userService.DeleteUserAsync(id);
        return NoContent();
    }
}
