using ExamSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamSystem.Domain.Entities;

namespace ExamSystem.API.Controllers;

public class TagsController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public TagsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetAll()
    {
        return Ok(await _context.QuestionTags.ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] string name)
    {
        if (await _context.QuestionTags.AnyAsync(t => t.Name == name))
            return BadRequest("Tag already exists");

        var tag = new QuestionTag { Name = name };
        _context.QuestionTags.Add(tag);
        await _context.SaveChangesAsync();
        return Ok(tag);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var tag = await _context.QuestionTags.FindAsync(id);
        if (tag != null)
        {
            _context.QuestionTags.Remove(tag);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }
}
