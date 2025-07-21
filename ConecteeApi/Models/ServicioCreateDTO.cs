using System.ComponentModel.DataAnnotations;

namespace ConecteeApi.Models
{
    public class ServicioCreateDTO
    {
        [Required]
        public string UsuarioId { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Descripcion { get; set; } = null!;

        [Required]
        public string Origen { get; set; } = null!;

        [Required]
        public string Destino { get; set; } = null!;

        [Range(0.01, double.MaxValue, ErrorMessage = "El costo debe ser mayor que cero.")]
        public decimal Costo { get; set; }

        [Required]
        public string Estado { get; set; } = null!;

        // 👇 Coordenadas necesarias para mapa
        public double OrigenLat { get; set; }
        public double OrigenLng { get; set; }
        public double DestinoLat { get; set; }
        public double DestinoLng { get; set; }
    }
}


