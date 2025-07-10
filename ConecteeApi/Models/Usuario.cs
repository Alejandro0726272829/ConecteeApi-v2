using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ConecteeApi.Models
{
    public class Usuario
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]  // Espera string hex de 24 chars
        public string? Id { get; set; }

        [BsonElement("nombre")]
        public string Nombre { get; set; } = null!;

        [BsonElement("correo")]
        public string Correo { get; set; } = null!;

        [BsonElement("telefono")]
        public string Telefono { get; set; } = null!;

        [BsonElement("contrasena")]
        public string Contrasena { get; set; } = null!;
    }
}

