using Microsoft.Extensions.Configuration;

namespace ConecteeApi.Models
{
    public class MongoDBSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string UsuarioCollectionName { get; set; } = null!;
        public string ServicioCollectionName { get; set; } = null!;
    }
}

