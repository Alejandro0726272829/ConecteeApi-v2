using ConecteeApi.Helpers;
using ConecteeApi.Interfaces;
using ConecteeApi.Models;
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await AuthenticateUserAsync(login.Correo, login.Password);
            if (user == null)
                return Unauthorized("Usuario o contraseña incorrectos");

            var tokenString = GenerateJWT(user);
            return Ok(new { Token = tokenString });
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
            usuario.Contrasena = PasswordHasher.HashPassword(usuario.Contrasena);
            await _usuarioService.CreateAsync(usuario);
            return CreatedAtAction(nameof(Get), new { id = usuario.Id }, usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Usuario usuario)
        {
            var existing = await _usuarioService.GetByIdAsync(id);
            if (existing is null) return NotFound();

            usuario.Id = id;

            if (!string.IsNullOrEmpty(usuario.Contrasena))
                usuario.Contrasena = PasswordHasher.HashPassword(usuario.Contrasena);

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

        private async Task<Usuario?> AuthenticateUserAsync(string correo, string password)
        {
            var users = await _usuarioService.GetAllAsync();

            foreach (var user in users)
            {
                if (user.Correo == correo && PasswordHasher.VerifyPassword(password, user.Contrasena))
                    return user;
            }
            return null;
        }

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


