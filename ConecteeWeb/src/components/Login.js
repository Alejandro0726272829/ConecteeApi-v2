import React, { useState } from 'react';
import axios from 'axios';
import logo from '../logo.svg';

function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = process.env.REACT_APP_API_URL + '/api/Auth/login';
      const response = await axios.post(url, { correo, password });

      console.log('Respuesta del backend:', response.data);

      const token = response.data.token;
      localStorage.setItem('token', token);

      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      setLoading(false);
      console.error('Error al iniciar sesión:', err);

      if (err.response && err.response.data) {
        setError(err.response.data); // muestra el mensaje real del backend
      } else {
        setError('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 40, backgroundColor: '#000', color: 'white', textAlign: 'center' }}>
      <img src={logo} className="App-logo" alt="logo" />
      <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: 'auto' }}>
        <h2>Iniciar sesión</h2>
        <div style={{ marginBottom: 10, textAlign: 'left' }}>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10, textAlign: 'left' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: 10, width: '100%' }}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;



