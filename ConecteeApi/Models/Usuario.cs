using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ConecteeApi.Models
{
    public class Usuario
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("nombre")]
        public string Nombre { get; set; } = null!;

        [BsonElement("correo")]
        public string Correo { get; set; } = null!;

        [BsonElement("telefono")]
        public string Telefono { get; set; } = null!;
    }
}
