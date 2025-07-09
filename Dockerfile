# Etapa 1: Build con SDK .NET 8
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar archivo de proyecto y restaurar dependencias
COPY ConecteeApi/*.csproj ./ConecteeApi/
WORKDIR /app/ConecteeApi
RUN dotnet restore

# Copiar todo el código
COPY ConecteeApi/. ./

# Publicar la app (con restore por seguridad)
RUN dotnet publish -c Release -o /app/out

# Etapa 2: Runtime con ASP.NET Core Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copiar los archivos publicados desde build
COPY --from=build /app/out .

# Exponer el puerto 80
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

# Iniciar la app
ENTRYPOINT ["dotnet", "ConecteeApi.dll"]


