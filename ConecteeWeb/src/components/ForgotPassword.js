// src/components/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword({ onVolverAlLogin }) {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    try {
      const url = process.env.REACT_APP_API_URL + '/api/auth/forgot-password';
      await axios.post(url, { correo });
      setMensaje('Si el correo existe, te enviaremos un enlace de recuperación.');
    } catch (err) {
      setError('Hubo un error al procesar la solicitud.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
      <h2>¿Olvidaste tu contraseña?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={{ padding: 8, width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 10, width: '100%' }}>
          Enviar enlace de recuperación
        </button>
      </form>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={onVolverAlLogin} style={{ marginTop: 20 }}>
        Volver al inicio de sesión
      </button>
    </div>
  );
}

export default ForgotPassword;
