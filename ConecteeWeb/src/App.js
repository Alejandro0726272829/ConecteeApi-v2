import './App.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './components/Login';
import logo from './logo.svg';
import MapaConectee from './components/MapaConectee';
import UbicacionUsuario from './components/UbicacionUsuario';

function App() {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);

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

    const url = process.env.REACT_APP_API_URL + '/api/Servicios';
    console.log('Llamando a:', url);

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

  const marcadoresServicios = servicios
    .filter(s => s.lat && s.lng)
    .map(s => ({
      lat: Number(s.lat),
      lng: Number(s.lng),
      nombre: s.nombre || 'Sin nombre',
    }));

  const marcadores = ubicacionUsuario
    ? [...marcadoresServicios, { ...ubicacionUsuario, nombre: 'Tu ubicación 📍' }]
    : marcadoresServicios;

  return (
    <div style={{ minHeight: '100vh', padding: '20px', textAlign: 'center', color: 'white' }}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Botón para cerrar sesión */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              setIsLoggedIn(false);
            }}
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
          <h1>Lista de Servicios</h1>

          {/* Mostrar componente de ubicación */}
          <UbicacionUsuario onUbicacionObtenida={setUbicacionUsuario} />

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {servicios.map(servicio => (
              <li key={servicio._id || servicio.id}>
                {servicio.nombre || 'Servicio sin nombre'}
              </li>
            ))}
          </ul>

          {/* Mostrar el mapa solo si hay marcadores */}
          {marcadores.length > 0 && (
            <>
              <h2>Mapa de Servicios</h2>
              <MapaConectee marcadores={marcadores} zoom={12} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;











