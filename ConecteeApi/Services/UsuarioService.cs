using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace ConecteeApi.Services
{
    public class UsuarioService : IBaseService<Usuario>
    {
        private readonly IMongoCollection<Usuario> _usuarios;

        public UsuarioService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _usuarios = database.GetCollection<Usuario>(settings.Value.UsuarioCollectionName);
        }

        public async Task<List<Usuario>> GetAllAsync() =>
            await _usuarios.Find(_ => true).ToListAsync();

        public async Task<Usuario?> GetByIdAsync(string id) =>
            await _usuarios.Find(u => u.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Usuario usuario)
        {
            usuario.Contrasena = HashPassword(usuario.Contrasena);
            await _usuarios.InsertOneAsync(usuario);
        }

        public async Task UpdateAsync(string id, Usuario usuario) =>
            await _usuarios.ReplaceOneAsync(u => u.Id == id, usuario);

        public async Task DeleteAsync(string id) =>
            await _usuarios.DeleteOneAsync(u => u.Id == id);

        // ------------------------------
        // Métodos personalizados
        // ------------------------------

        public async Task<Usuario?> GetByCorreoAsync(string correo) =>
            await _usuarios.Find(u => u.Correo == correo).FirstOrDefaultAsync();

        public async Task AddUsuarioAsync(Usuario usuario) =>
            await _usuarios.InsertOneAsync(usuario);

        public async Task ActualizarAsync(string id, Usuario usuario) =>
            await _usuarios.ReplaceOneAsync(u => u.Id == id, usuario);

        public string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(salt);

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return $"{Convert.ToBase64String(salt)}.{hashed}";
        }

        public bool VerifyPassword(string hashedPasswordWithSalt, string providedPassword)
        {
            var parts = hashedPasswordWithSalt.Split('.');
            if (parts.Length != 2) return false;

            var salt = Convert.FromBase64String(parts[0]);
            var storedHash = parts[1];

            string computedHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: providedPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return computedHash == storedHash;
        }
    }
}



