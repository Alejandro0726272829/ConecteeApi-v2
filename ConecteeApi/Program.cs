using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using ConecteeApi.Services;
using Microsoft.Extensions.Options;

// 🔧 Forzar ASP.NET a usar el puerto 80 dentro del contenedor
Environment.SetEnvironmentVariable("ASPNETCORE_URLS", "http://+:80");

var builder = WebApplication.CreateBuilder(args);

// Leer configuración de MongoDB
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

builder.Services.AddScoped<IBaseService<Usuario>, UsuarioService>();
builder.Services.AddScoped<IBaseService<Servicio>, ServicioService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

