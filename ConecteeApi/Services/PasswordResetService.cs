using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace ConecteeApi.Services
{
    public class PasswordResetService : IPasswordResetService
    {
        private readonly IMongoCollection<Usuario> _usuarios;
        private readonly IMongoCollection<PasswordResetToken> _tokens;

        public PasswordResetService(IOptions<MongoDBSettings> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            var database = client.GetDatabase(config.Value.DatabaseName);

            _usuarios = database.GetCollection<Usuario>("Usuarios");
            _tokens = database.GetCollection<PasswordResetToken>("PasswordResetTokens");
        }

        public async Task CrearTokenAsync(string correo)
        {
            var usuario = await _usuarios.Find(u => u.Correo == correo).FirstOrDefaultAsync();
            if (usuario == null)
                return;

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

            var resetToken = new PasswordResetToken
            {
                Correo = correo,
                Token = token,
                Expiration = DateTime.UtcNow.AddHours(1)
            };

            await _tokens.InsertOneAsync(resetToken);

            // Simular envío de correo
            Console.WriteLine($"Enlace de recuperación: https://tusitio.com/reset-password?token={token}");
        }

        public async Task<PasswordResetToken> ObtenerTokenAsync(string token)
        {
            return await _tokens.Find(t => t.Token == token && t.Expiration > DateTime.UtcNow).FirstOrDefaultAsync();
        }

        public async Task EliminarTokenAsync(string token)
        {
            await _tokens.DeleteOneAsync(t => t.Token == token);
        }
    }
}
