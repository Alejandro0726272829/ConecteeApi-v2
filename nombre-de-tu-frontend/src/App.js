import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './components/Login';
import logo from './logo.svg';

function App() {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <div style={{ minHeight: '100vh', padding: '20px', textAlign: 'center', color: 'white' }}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Lista de Servicios</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {servicios.map(servicio => (
              <li key={servicio._id || servicio.id}>
                {servicio.nombre || 'Servicio sin nombre'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;








