import React, { useEffect, useState } from 'react';

function UbicacionUsuario({ onUbicacionObtenida }) {
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por tu navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUbicacion(coords);
        if (onUbicacionObtenida) onUbicacionObtenida(coords); // pasa coords al padre si se necesita
      },
      (err) => {
        console.error(err);
        setError('No se pudo obtener la ubicación. Asegúrate de permitir el acceso.');
      }
    );
  }, [onUbicacionObtenida]); // ✅ agregamos esta dependencia

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Permiso de ubicación</h3>
      {ubicacion && (
        <p>
          Ubicación detectada: Latitud {ubicacion.lat}, Longitud {ubicacion.lng}
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UbicacionUsuario;
