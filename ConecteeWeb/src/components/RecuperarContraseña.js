// src/components/RecuperarContraseña.jsx
import React, { useState } from 'react';
import axios from 'axios';

function RecuperarContraseña() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleEnviar = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const response = await axios.post('https://conecteeapi-v2.onrender.com/api/auth/recuperar', { correo });
      setMensaje(response.data);
    } catch (err) {
      setError(err.response?.data || 'Error al enviar la solicitud.');
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleEnviar}>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo"
          required
        />
        <button type="submit">Enviar enlace</button>
      </form>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RecuperarContraseña;
