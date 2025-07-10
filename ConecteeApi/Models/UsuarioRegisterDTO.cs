namespace ConecteeApi.Models
{
    public class UsuarioRegisterDTO
    {
        public string Nombre { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Telefono { get; set; } = null!;
        public string Contrasena { get; set; } = null!;
    }
}
