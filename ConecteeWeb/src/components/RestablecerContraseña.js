// src/components/RestablecerContraseña.jsx
import React, { useState } from 'react';
import axios from 'axios';

function RestablecerContraseña() {
  const [token, setToken] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleRestablecer = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await axios.post('https://conecteeapi-v2.onrender.com/api/auth/restablecer', {
        token,
        nuevaPassword
      });
      setMensaje(response.data);
    } catch (err) {
      setError(err.response?.data || 'Error al restablecer contraseña.');
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleRestablecer}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token recibido"
          required
        />
        <input
          type="password"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          placeholder="Nueva contraseña"
          required
        />
        <button type="submit">Restablecer</button>
      </form>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RestablecerContraseña;
