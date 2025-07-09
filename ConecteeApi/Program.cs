using ConecteeApi.Interfaces;
using ConecteeApi.Models;
using ConecteeApi.Services;
using ConecteeApi.Middleware;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configurar MongoDB
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// Registrar servicios
builder.Services.AddScoped<IBaseService<Usuario>, UsuarioService>();
builder.Services.AddScoped<IBaseService<Servicio>, ServicioService>();

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Conectee API",
        Version = "v1"
    });
});

var app = builder.Build();

// Mostrar Swagger SIEMPRE
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Conectee API v1");
    c.RoutePrefix = string.Empty; // Swagger en raíz
});

// Middleware de errores
app.UseMiddleware<ErrorHandlerMiddleware>();

// Solo usar HTTPS si NO es Docker (asumiendo entorno desarrollo)
if (!Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER")?.Equals("true") ?? true)
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();




