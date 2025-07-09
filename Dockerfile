# Etapa 1: Build con SDK .NET 8
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar el archivo de proyecto y restaurar dependencias
COPY ConecteeApi/*.csproj ./ConecteeApi/
WORKDIR /app/ConecteeApi
RUN dotnet restore

# Copiar el resto del código fuente de la app
COPY ConecteeApi/. ./

# Publicar la aplicación en modo Release en la carpeta 'out'
RUN dotnet publish -c Release -o /app/out --no-restore

# Etapa 2: Runtime con ASP.NET Core Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copiar los archivos publicados desde la etapa de build
COPY --from=build /app/out ./

# Exponer el puerto 80
EXPOSE 80

# Escuchar en todas las interfaces
ENV ASPNETCORE_URLS=http://+:80

# Ejecutar la aplicación
ENTRYPOINT ["dotnet", "ConecteeApi.dll"]

