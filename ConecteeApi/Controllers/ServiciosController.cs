using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace ConecteeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosController : ControllerBase
    {
        private readonly IBaseService<Servicio> _servicioService;

        public ServiciosController(IBaseService<Servicio> servicioService)
        {
            _servicioService = servicioService;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _servicioService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var servicio = await _servicioService.GetByIdAsync(id);
            return servicio is null ? NotFound() : Ok(servicio);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Servicio servicio)
        {
            await _servicioService.CreateAsync(servicio);
            return CreatedAtAction(nameof(Get), new { id = servicio.Id }, servicio);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Servicio servicio)
        {
            var existing = await _servicioService.GetByIdAsync(id);
            if (existing is null) return NotFound();
            servicio.Id = id;
            await _servicioService.UpdateAsync(id, servicio);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var servicio = await _servicioService.GetByIdAsync(id);
            if (servicio is null) return NotFound();
            await _servicioService.DeleteAsync(id);
            return NoContent();
        }
    }
}
