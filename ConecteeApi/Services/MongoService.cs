using ConecteeApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ConecteeApi.Services
{
    public class MongoService
    {
        private readonly IMongoDatabase _database;
        private readonly MongoDBSettings _settings;

        public MongoService(IOptions<MongoDBSettings> settings)
        {
            _settings = settings.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);
        }

        public IMongoDatabase GetDatabase()
        {
            return _database;
        }

        public string UsuarioCollectionName => _settings.UsuarioCollectionName;
        public string ServicioCollectionName => _settings.ServicioCollectionName;
    }
}
