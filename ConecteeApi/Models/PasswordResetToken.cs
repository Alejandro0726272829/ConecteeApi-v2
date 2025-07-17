// Models/PasswordResetToken.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace ConecteeApi.Models
{
    public class PasswordResetToken
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("correo")]
        public string Correo { get; set; }

        [BsonElement("token")]
        public string Token { get; set; }

        [BsonElement("expiration")]
        public DateTime Expiration { get; set; }
    }
}
