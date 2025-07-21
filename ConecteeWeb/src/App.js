import './App.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './components/Login';
import logo from './logo.svg';
import MapaFormularioServicio from './components/MapaFormularioServicio'; // ✅ Nombre corregido
import UbicacionUsuario from './components/UbicacionUsuario';
import RutaServicio from './components/RutaServicio';
import Icono from './components/Icono';

function App() {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [servicioCreado, setServicioCreado] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setError(null);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay token de autenticación');
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/api/Servicios`;
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setServicios(response.data);
      setError(null);
    })
    .catch(err => {
      setError('Error al cargar los servicios');
      console.error(err);
    });
  }, [isLoggedIn]);

  const handleServicioCreado = (nuevoServicio) => {
    setServicioCreado(nuevoServicio);
    setServicios(prev => [...prev, nuevoServicio]);
  };

  const marcadoresServicios = servicios
    .filter(s => s.origenLat && s.origenLng)
    .map(s => ({
      lat: Number(s.origenLat),
      lng: Number(s.origenLng),
      nombre: s.nombre || 'Origen',
    }));

  const marcadorUsuario = ubicacionUsuario
    ? [{ ...ubicacionUsuario, nombre: 'Tu ubicación 📍' }]
    : [];

  const marcadores = [...marcadoresServicios, ...marcadorUsuario];

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setServicios([]);
    setUbicacionUsuario(null);
    setServicioCreado(null);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', textAlign: 'center', color: 'white' }}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <button
            onClick={cerrarSesion}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              padding: '8px 12px',
              backgroundColor: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Cerrar sesión
          </button>

          <img src={logo} className="App-logo" alt="logo" />
          <h1>Crear nuevo servicio</h1>

          <Icono />
          <RutaServicio onServicioCreado={handleServicioCreado} />
          <UbicacionUsuario onUbicacionObtenida={setUbicacionUsuario} />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <h2>Lista de Servicios</h2>
          <ul>
            {servicios.map(servicio => (
              <li key={servicio._id || servicio.id}>
                {servicio.nombre || 'Servicio sin nombre'}
              </li>
            ))}
          </ul>

          {marcadores.length > 0 && (
            <>
              <h2>Mapa</h2>
              <MapaFormularioServicio marcadores={marcadores} zoom={13} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
