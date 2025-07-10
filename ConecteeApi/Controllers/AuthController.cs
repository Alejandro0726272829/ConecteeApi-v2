using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConecteeApi.Models;
using ConecteeApi.Services;
using MongoDB.Bson;  // <-- Agregar este using

namespace ConecteeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;
        private readonly IConfiguration _configuration;

        public AuthController(UsuarioService usuarioService, IConfiguration configuration)
        {
            _usuarioService = usuarioService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            // Validar si ya existe un usuario con ese correo
            var existingUser = await _usuarioService.GetByCorreoAsync(request.Correo);
            if (existingUser != null)
                return BadRequest("El correo ya está registrado.");

            var hashedPassword = _usuarioService.HashPassword(request.Password);

            var usuario = new Usuario
            {
                Id = ObjectId.GenerateNewId().ToString(),  // <-- Aquí el cambio importante
                Nombre = request.Nombre,
                Correo = request.Correo,
                Telefono = request.Telefono,
                Contrasena = hashedPassword
            };

            await _usuarioService.AddUsuarioAsync(usuario);

            return Ok("Usuario registrado correctamente.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var usuario = await _usuarioService.GetByCorreoAsync(request.Correo);

            if (usuario == null || !_usuarioService.VerifyPassword(usuario.Contrasena, request.Password))
                return Unauthorized("Correo o contraseña incorrectos.");

            var token = GenerateJwtToken(usuario);

            return Ok(new { token });
        }

        private string GenerateJwtToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id ?? ""),
                new Claim(ClaimTypes.Name, usuario.Nombre)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new Exception("JWT Key no configurada")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}


