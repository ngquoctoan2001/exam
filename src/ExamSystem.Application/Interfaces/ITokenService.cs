using ExamSystem.Domain.Entities;

namespace ExamSystem.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(User user, IList<string> roles);
}
