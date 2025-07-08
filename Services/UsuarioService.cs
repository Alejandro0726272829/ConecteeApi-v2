using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

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

        public async Task<List<Usuario>> GetAllAsync() => await _usuarios.Find(_ => true).ToListAsync();
        public async Task<Usuario?> GetByIdAsync(string id) => await _usuarios.Find(u => u.Id == id).FirstOrDefaultAsync();
        public async Task CreateAsync(Usuario usuario) => await _usuarios.InsertOneAsync(usuario);
        public async Task UpdateAsync(string id, Usuario usuario) => await _usuarios.ReplaceOneAsync(u => u.Id == id, usuario);
        public async Task DeleteAsync(string id) => await _usuarios.DeleteOneAsync(u => u.Id == id);
    }
}
