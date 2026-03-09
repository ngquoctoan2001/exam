using ExamSystem.Application.DTOs;
using System.IO;
using System.Threading.Tasks;

namespace ExamSystem.Application.Interfaces;

public interface IStudentService
{
    Task<IEnumerable<StudentDto>> GetAllAsync();
    Task<StudentDto> GetByIdAsync(long id);
    Task<StudentDto> CreateAsync(RegisterDto dto);
    Task UpdateAsync(long id, StudentDto dto);
    Task DeleteAsync(long id);
    Task ImportFromExcelAsync(Stream fileStream);
}
