# Imagen base de .NET SDK para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar archivos de proyecto y restaurar dependencias
COPY *.sln ./
COPY ConecteeApi/*.csproj ./ConecteeApi/
RUN dotnet restore

# Copiar el resto de los archivos y compilar
COPY ConecteeApi/. ./ConecteeApi/
WORKDIR /app/ConecteeApi
RUN dotnet publish -c Release -o out

# Imagen base para runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/ConecteeApi/out ./

# Puerto por defecto
EXPOSE 80

# Comando para ejecutar la aplicación
ENTRYPOINT ["dotnet", "ConecteeApi.dll"]
