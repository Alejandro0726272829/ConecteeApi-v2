namespace ConecteeApi.Models
{
    public class RegisterRequest
    {
        public required string Nombre { get; set; }
        public required string Correo { get; set; }
        public required string Telefono { get; set; }
        public required string Password { get; set; }
    }
}
