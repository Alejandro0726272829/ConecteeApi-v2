using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace ConecteeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IBaseService<Usuario> _usuarioService;

        public UsuariosController(IBaseService<Usuario> usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _usuarioService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            return usuario is null ? NotFound() : Ok(usuario);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Usuario usuario)
        {
            await _usuarioService.CreateAsync(usuario);
            return CreatedAtAction(nameof(Get), new { id = usuario.Id }, usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Usuario usuario)
        {
            var existing = await _usuarioService.GetByIdAsync(id);
            if (existing is null) return NotFound();
            usuario.Id = id;
            await _usuarioService.UpdateAsync(id, usuario);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario is null) return NotFound();
            await _usuarioService.DeleteAsync(id);
            return NoContent();
        }
    }
}
