import React, { useState } from 'react';
import axios from 'axios';

function FormularioCompletoServicio({ onServicioCreado }) {
  const [datos, setDatos] = useState({
    origen: '',
    destino: '',
    material: '',
    bultos: '',
    descripcion: '',
    unidad: '',
    metodoPago: '',
    origenLat: '',
    origenLng: '',
    destinoLat: '',
    destinoLng: '',
  });

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const obtenerUbicacion = (tipo) => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (tipo === 'origen') {
          setDatos({ ...datos, origenLat: latitude, origenLng: longitude });
        } else {
          setDatos({ ...datos, destinoLat: latitude, destinoLng: longitude });
        }
      },
      () => setError('Error al obtener ubicación'),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Servicios`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje('Servicio creado con éxito');
      setError(null);
      onServicioCreado(response.data);
      setDatos({
        origen: '',
        destino: '',
        material: '',
        bultos: '',
        descripcion: '',
        unidad: '',
        metodoPago: '',
        origenLat: '',
        origenLng: '',
        destinoLat: '',
        destinoLng: '',
      });
    } catch (err) {
      setError('Error al crear servicio');
      setMensaje(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'left', maxWidth: 500, margin: 'auto' }}>
      <h2>Nuevo Servicio Completo</h2>

      <label>Origen:</label>
      <input name="origen" value={datos.origen} onChange={handleChange} required />
      <button type="button" onClick={() => obtenerUbicacion('origen')}>📍 Usar ubicación actual</button>

      <label>Destino:</label>
      <input name="destino" value={datos.destino} onChange={handleChange} required />
      <button type="button" onClick={() => obtenerUbicacion('destino')}>📍 Usar ubicación actual</button>

      <label>Material:</label>
      <input name="material" value={datos.material} onChange={handleChange} required />

      <label>Bultos:</label>
      <input name="bultos" type="number" value={datos.bultos} onChange={handleChange} required />

      <label>Descripción:</label>
      <textarea name="descripcion" value={datos.descripcion} onChange={handleChange} />

      <label>Unidad requerida:</label>
      <select name="unidad" value={datos.unidad} onChange={handleChange} required>
        <option value="">Selecciona</option>
        <option value="Camión 3.5 t">Camión 3.5 t</option>
        <option value="Camión 6 t">Camión 6 t</option>
        <option value="Camioneta">Camioneta</option>
      </select>

      <label>Método de pago:</label>
      <select name="metodoPago" value={datos.metodoPago} onChange={handleChange} required>
        <option value="">Selecciona</option>
        <option value="Transferencia">Transferencia</option>
        <option value="PayPal">PayPal</option>
        <option value="Efectivo">Efectivo</option>
      </select>

      <br /><br />
      <button type="submit" style={{ backgroundColor: '#28a745', color: '#fff', padding: '10px', border: 'none' }}>
        Crear Servicio
      </button>

      {mensaje && <p style={{ color: 'lightgreen' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default FormularioCompletoServicio;
