using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ConecteeApi.Models
{
    public class Servicio
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("usuarioId")]
        public string UsuarioId { get; set; } = null!;

        [BsonElement("descripcion")]
        public string Descripcion { get; set; } = null!;

        [BsonElement("origen")]
        public string Origen { get; set; } = null!;

        [BsonElement("destino")]
        public string Destino { get; set; } = null!;

        [BsonElement("costo")]
        public decimal Costo { get; set; }

        [BsonElement("estado")]
        public string Estado { get; set; } = null!;

        [BsonElement("coordenadaOrigen")]
        public Punto CoordenadaOrigen { get; set; } = null!;

        [BsonElement("coordenadaDestino")]
        public Punto CoordenadaDestino { get; set; } = null!;
    }
}



