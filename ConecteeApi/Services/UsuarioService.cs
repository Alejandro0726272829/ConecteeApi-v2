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

        // --- CRUD estándar ---
        public async Task<List<Usuario>> GetAllAsync() =>
            await _usuarios.Find(_ => true).ToListAsync();

        public async Task<Usuario?> GetByIdAsync(string id) =>
            await _usuarios.Find(u => u.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Usuario usuario)
        {
            usuario.Contrasena = HashPassword(usuario.Contrasena); // Hashear contraseña
            await _usuarios.InsertOneAsync(usuario);
        }

        public async Task UpdateAsync(string id, Usuario usuario) =>
            await _usuarios.ReplaceOneAsync(u => u.Id == id, usuario);

        public async Task DeleteAsync(string id) =>
            await _usuarios.DeleteOneAsync(u => u.Id == id);

        // --- Métodos adicionales de autenticación y usuarios ---

        public async Task<Usuario?> GetByCorreoAsync(string correo) =>
            await _usuarios.Find(u => u.Correo == correo).FirstOrDefaultAsync();

        public async Task AddUsuarioAsync(Usuario usuario) =>
            await _usuarios.InsertOneAsync(usuario);

        // Método para actualizar usuario desde AuthController
        public async Task ActualizarAsync(string id, Usuario usuarioActualizado)
        {
            await _usuarios.ReplaceOneAsync(u => u.Id == id, usuarioActualizado);
        }

        // --- Seguridad de contraseñas ---

        public string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];

            }


