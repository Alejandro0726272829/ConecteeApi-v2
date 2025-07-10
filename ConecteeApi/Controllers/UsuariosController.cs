using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ConecteeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IBaseService<Usuario> _usuarioService;
        private readonly IConfiguration _configuration;

        public UsuariosController(IBaseService<Usuario> usuarioService, IConfiguration configuration)
        {
            _usuarioService = usuarioService;
            _configuration = configuration;
        }

        // LOGIN - público, sin candado
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await AuthenticateUserAsync(login.Correo, login.Password);
            if (user == null)
                return Unauthorized("Usuario o contraseña incorrectos");

            var tokenString = GenerateJWT(user);
            return Ok(new { Token = tokenString });
        }

        // Métodos protegidos con autorización
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _usuarioService.GetAllAsync());

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            return usuario is null ? NotFound() : Ok(usuario);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Usuario usuario)
        {
            await _usuarioService.CreateAsync(usuario);
            return CreatedAtAction(nameof(Get), new { id = usuario.Id }, usuario);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Usuario usuario)
        {
            var existing = await _usuarioService.GetByIdAsync(id);
            if (existing is null) return NotFound();
            usuario.Id = id;
            await _usuarioService.UpdateAsync(id, usuario);
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario is null) return NotFound();
            await _usuarioService.DeleteAsync(id);
            return NoContent();
        }

        // Método para validar usuario (async)
        private async Task<Usuario?> AuthenticateUserAsync(string correo, string password)
        {
            var users = await _usuarioService.GetAllAsync();
            return users.FirstOrDefault(u => u.Correo == correo && u.Contrasena == password);
        }

        // Método para generar JWT
        private string GenerateJWT(Usuario user)
        {
            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new Exception("JWT Key no configurada en appsettings.json");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Correo!),
                new Claim(ClaimTypes.NameIdentifier, user.Id!)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

