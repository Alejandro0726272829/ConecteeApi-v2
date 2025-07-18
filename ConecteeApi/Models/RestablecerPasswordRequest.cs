namespace ConecteeApi.Models
{
    public class RestablecerPasswordRequest
    {
        public string Correo { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string NuevaPassword { get; set; } = null!;
    }
}
