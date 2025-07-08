using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConecteeApi.Interfaces
{
    public interface IBaseService<T>
    {
        Task<List<T>> GetAllAsync();
        Task<T?> GetByIdAsync(string id);
        Task CreateAsync(T entity);
        Task UpdateAsync(string id, T entity);
        Task DeleteAsync(string id);
    }
}
