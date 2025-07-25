using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConecteeApi.Services
{
    public class ServicioService : IBaseService<Servicio>
    {
        private readonly IMongoCollection<Servicio> _servicios;

        public ServicioService(MongoService mongoService)
        {
            _servicios = mongoService.GetCollectionFromSettings<Servicio>("Servicio");
        }

        public async Task<List<Servicio>> GetAllAsync() =>
            await _servicios.Find(_ => true).ToListAsync();

        public async Task<Servicio?> GetByIdAsync(string id) =>
            await _servicios.Find(s => s.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Servicio servicio) =>
            await _servicios.InsertOneAsync(servicio);

        public async Task UpdateAsync(string id, Servicio servicio) =>
            await _servicios.ReplaceOneAsync(s => s.Id == id, servicio);

        public async Task DeleteAsync(string id) =>
            await _servicios.DeleteOneAsync(s => s.Id == id);
    }
}


