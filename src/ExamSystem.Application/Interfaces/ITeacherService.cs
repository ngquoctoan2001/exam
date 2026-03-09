using ExamSystem.Application.DTOs;
using System.IO;
using System.Threading.Tasks;

namespace ExamSystem.Application.Interfaces;

public interface ITeacherService
{
    Task<IEnumerable<TeacherDto>> GetAllAsync();
    Task<TeacherDto> GetByIdAsync(long id);
    Task<TeacherDto> CreateAsync(RegisterDto dto);
    Task UpdateAsync(long id, TeacherDto dto);
    Task DeleteAsync(long id);
}
