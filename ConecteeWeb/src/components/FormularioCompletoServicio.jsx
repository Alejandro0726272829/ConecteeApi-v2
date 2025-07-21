import React, { useState } from 'react';
import axios from 'axios';
import MapaConectee from './MapaConectee';
import RutaServicio from './RutaServicio';

function FormularioCompletoServicio({ onServicioCreado }) {
  const [nombre, setNombre] = useState('');
  const [origen, setOrigen] = useState({ direccion: '', lat: '', lng: '' });
  const [destino, setDestino] = useState({ direccion: '', lat: '', lng: '' });
  const [mostrarRuta, setMostrarRuta] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const obtenerUbicacion = (tipo) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (tipo === 'origen') {
          setOrigen({ ...origen, lat: latitude, lng: longitude });
        } else {
          setDestino({ ...destino, lat: latitude, lng: longitude });
        }
      },
      (err) => {
        alert('No se pudo obtener tu ubicación');
      }
    );
  };

  const manejarClickMapa = (e, tipo) => {
    const { lat, lng } = e.latlng;
    if (tipo === 'origen') {
      setOrigen({ ...origen, lat, lng });
    } else {
      setDestino({ ...destino, lat, lng });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuario no autenticado');
      return;
    }

    const nuevoServicio = {
      nombre,
      origenDireccion: origen.direccion,
      origenLat: origen.lat,
      origenLng: origen.lng,
      destinoDireccion: destino.direccion,
      destinoLat: destino.lat,
      destinoLng: destino.lng
    };

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/Servicios`;
      const response = await axios.post(url, nuevoServicio, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onServicioCreado(response.data);
      setMensaje('✅ Servicio creado con éxito');
      setNombre('');
      setOrigen({ direccion: '', lat: '', lng: '' });
      setDestino({ direccion: '', lat: '', lng: '' });
      setMostrarRuta(false);
    } catch (err) {
      console.error(err);
      alert('Error al crear el servicio');
    }
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#222', borderRadius: 8 }}>
      <h2>Formulario de Servicio</h2>
      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <div>
          <label>Nombre del servicio:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Dirección de Origen:</label>
          <input
            type="text"
            value={origen.direccion}
            onChange={(e) => setOrigen({ ...origen, direccion: e.target.value })}
          />
          <button type="button" onClick={() => obtenerUbicacion('origen')}>📍 Usar mi ubicación</button>
        </div>

        <div>
          <label>Coordenadas de Origen:</label>
          <input
            type="number"
            placeholder="Lat"
            value={origen.lat}
            onChange={(e) => setOrigen({ ...origen, lat: e.target.value })}
          />
          <input
            type="number"
            placeholder="Lng"
            value={origen.lng}
            onChange={(e) => setOrigen({ ...origen, lng: e.target.value })}
          />
        </div>

        <div>
          <label>Dirección de Destino:</label>
          <input
            type="text"
            value={destino.direccion}
            onChange={(e) => setDestino({ ...destino, direccion: e.target.value })}
          />
          <button type="button" onClick={() => obtenerUbicacion('destino')}>📍 Usar mi ubicación</button>
        </div>

        <div>
          <label>Coordenadas de Destino:</label>
          <input
            type="number"
            placeholder="Lat"
            value={destino.lat}
            onChange={(e) => setDestino({ ...destino, lat: e.target.value })}
          />
          <input
            type="number"
            placeholder="Lng"
            value={destino.lng}
            onChange={(e) => setDestino({ ...destino, lng: e.target.value })}
          />
        </div>

        <button type="button" onClick={() => setMostrarRuta(true)}>
          Ver ruta en el mapa 🚚
        </button>

        <button type="submit" style={{ marginLeft: 10 }}>Crear servicio</button>
      </form>

      {mensaje && <p style={{ color: 'lightgreen' }}>{mensaje}</p>}

      {mostrarRuta && origen.lat && destino.lat && (
        <div style={{ marginTop: 20 }}>
          <h3>Ruta previa:</h3>
          <RutaServicio
            origen={{ lat: origen.lat, lng: origen.lng }}
            destino={{ lat: destino.lat, lng: destino.lng }}
          />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h4>Haz clic en el mapa para establecer coordenadas:</h4>
        <MapaConectee
          onClick={(e) => {
            const tipo = window.confirm('¿Asignar como origen?\n(Cancelar = destino)')
              ? 'origen'
              : 'destino';
            manejarClickMapa(e, tipo);
          }}
          marcadores={[
            origen.lat ? { lat: Number(origen.lat), lng: Number(origen.lng), nombre: 'Origen' } : null,
            destino.lat ? { lat: Number(destino.lat), lng: Number(destino.lng), nombre: 'Destino' } : null,
          ].filter(Boolean)}
          zoom={13}
        />
      </div>
    </div>
  );
}

export default FormularioCompletoServicio;

