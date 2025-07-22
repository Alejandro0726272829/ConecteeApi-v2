namespace ConecteeApi.Models
{
    public class ServicioCreateDTO
    {
        public string UsuarioId { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Origen { get; set; } = string.Empty;
        public string Destino { get; set; } = string.Empty;
        public decimal Costo { get; set; }
        public string Estado { get; set; } = string.Empty;

        public double OrigenLat { get; set; }
        public double OrigenLng { get; set; }
        public double DestinoLat { get; set; }
        public double DestinoLng { get; set; }
    }
}

