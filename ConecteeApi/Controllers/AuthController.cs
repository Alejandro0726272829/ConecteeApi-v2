using ConecteeApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConecteeApi.Services;
using MongoDB.Bson;
using System.Threading.Tasks;
using System;
using ConecteeApi.Interfaces;

namespace ConecteeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;
        private readonly IConfiguration _configuration;
        private readonly IPasswordResetService _passwordResetService;

        public AuthController(UsuarioService usuarioService, IConfiguration configuration, IPasswordResetService passwordResetService)
        {
            _usuarioService = usuarioService;
            _configuration = configuration;
            _passwordResetService = passwordResetService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var existingUser = await _usuarioService.GetByCorreoAsync(request.Correo);
            if (existingUser != null)
                return BadRequest("El correo ya está registrado.");

            var hashedPassword = _usuarioService.HashPassword(request.Password);

            var usuario = new Usuario
            {
                Id = ObjectId.GenerateNewId().ToString(),
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

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("recuperar-password")]
        public async Task<IActionResult> RecuperarPassword([FromBody] string correo)
        {
            try
            {
                var usuario = await _usuarioService.GetByCorreoAsync(correo);
                if (usuario == null)
                    return NotFound(new { mensaje = "Correo no registrado." });

                await _passwordResetService.CrearTokenAsync(correo);
                return Ok(new { mensaje = "Se ha enviado un enlace para restablecer la contraseña." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno.", detalle = ex.Message });
            }
        }

        [HttpPost("restablecer-password")]
        public async Task<IActionResult> RestablecerPassword([FromBody] RestablecerPasswordRequest request)
        {
            try
            {
                var resetToken = await _passwordResetService.ObtenerTokenAsync(request.Token);
                if (resetToken == null || resetToken.Expiration < DateTime.UtcNow)
                    return BadRequest(new { mensaje = "Token inválido o expirado." });

                var usuario = await _usuarioService.GetByCorreoAsync(resetToken.Correo);
                if (usuario == null)
                    return NotFound(new { mensaje = "Usuario no encontrado." });

                usuario.Contrasena = _usuarioService.HashPassword(request.NuevaPassword);
                await _usuarioService.ActualizarAsync(usuario.Id!, usuario);
                await _passwordResetService.EliminarTokenAsync(request.Token);

                return Ok(new { mensaje = "Contraseña actualizada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno.", detalle = ex.Message });
            }
        }
    }
}


