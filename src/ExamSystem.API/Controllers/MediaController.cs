using Microsoft.AspNetCore.Mvc;

namespace ExamSystem.API.Controllers;

public class MediaController : BaseApiController
{
    private readonly IConfiguration _config;

    public MediaController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<string>> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("File is empty");

        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok($"/uploads/{fileName}");
    }

    [HttpDelete("{fileName}")]
    public IActionResult Delete(string fileName)
    {
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
            return NoContent();
        }
        return NotFound();
    }
    
    [HttpGet("list")]
    public IActionResult List()
    {
        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploads)) return Ok(new List<string>());
        
        var files = Directory.GetFiles(uploads).Select(Path.GetFileName);
        return Ok(files);
    }
}
