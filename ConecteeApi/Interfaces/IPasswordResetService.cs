using ConecteeApi.Models;
using System.Threading.Tasks;

namespace ConecteeApi.Interfaces
{
    public interface IPasswordResetService
    {
        Task CrearTokenAsync(string correo);
        Task<PasswordResetToken> ObtenerTokenAsync(string token);
        Task EliminarTokenAsync(string token);
    }
}
