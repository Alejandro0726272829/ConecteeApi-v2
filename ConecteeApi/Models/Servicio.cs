using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ConecteeApi.Models
{
    public class Servicio
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Descripcion { get; set; } = null!;
        public string UsuarioId { get; set; } = null!;
        public DateTime Fecha { get; set; }
    }
}
