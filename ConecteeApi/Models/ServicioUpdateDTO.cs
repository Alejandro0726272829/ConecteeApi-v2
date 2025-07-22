namespace ConecteeApi.Models
{
    public class ServicioUpdateDTO
    {
        public string UsuarioId { get; set; }
        public string Descripcion { get; set; }
        public string Origen { get; set; }
        public string Destino { get; set; }
        public decimal Costo { get; set; }
        public string Estado { get; set; }

        public double OrigenLat { get; set; }
        public double OrigenLng { get; set; }
        public double DestinoLat { get; set; }
        public double DestinoLng { get; set; }
    }
}
