import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

function RutaServicio() {
  const [ruta, setRuta] = useState(null);
  const [infoRuta, setInfoRuta] = useState(null);

  // Coordenadas simuladas de dos usuarios
  const origen = [25.6866, -100.3161]; // Monterrey
  const destino = [25.5377, -100.9258]; // García, NL

  useEffect(() => {
    const fetchRuta = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${origen[1]},${origen[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map(c => [c[1], c[0]]); // Convertir a [lat, lng]
          setRuta(coords);
          setInfoRuta({
            distancia: (route.distance / 1000).toFixed(2), // km
            duracion: Math.round(route.duration / 60), // minutos
          });
        }
      } catch (error) {
        console.error('Error al obtener la ruta:', error);
      }
    };

    fetchRuta();
  }, []);

  return (
    <div>
      <h2>Ruta del Servicio</h2>
      {infoRuta && (
        <p>
          Distancia: {infoRuta.distancia} km | Tiempo estimado: {infoRuta.duracion} min
        </p>
      )}
      <MapContainer center={origen} zoom={11} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={origen}>
          <Popup>Origen</Popup>
        </Marker>
        <Marker position={destino}>
          <Popup>Destino</Popup>
        </Marker>
        {ruta && <Polyline positions={ruta} color='blue' />}
      </MapContainer>
    </div>
  );
}

export default RutaServicio;
