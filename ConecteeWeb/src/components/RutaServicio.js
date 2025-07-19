import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// ICONOS PERSONALIZADOS (Fácil cambiar los URLs o importarlos)
const truckIconUrl = "https://cdn-icons-png.flaticon.com/512/1995/1995523.png"; // camión
const homeIconUrl = "https://cdn-icons-png.flaticon.com/512/25/25694.png";      // casa/bodega

const truckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const homeIcon = new L.Icon({
  iconUrl: homeIconUrl,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Componente para controlar la ruta con Leaflet Routing Machine
function RoutingMachine({ origen, destino, onRouteChange }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!origen || !destino) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(origen.lat, origen.lng),
        L.latLng(destino.lat, destino.lng),
      ],
      lineOptions: {
        styles: [{ color: "#007bff", weight: 5 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: () => null, // no crear markers automáticos, usamos los personalizados abajo
    }).addTo(map);

    routingControlRef.current.on("routesfound", (e) => {
      const route = e.routes[0];
      // Enviar distancia y duración a componente padre
      onRouteChange({
        distance: route.summary.totalDistance, // metros
        time: route.summary.totalTime,         // segundos
        coordinates: route.coordinates,        // para animación
      });
    });

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [origen, destino, map, onRouteChange]);

  return null;
}

// Componente para animar el movimiento del camión
function MovingMarker({ coordinates }) {
  const markerRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;
    setIndex(0);

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= coordinates.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500); // mueve el marcador cada 500ms (ajustable)

    return () => clearInterval(interval);
  }, [coordinates]);

  if (!coordinates || coordinates.length === 0) return null;

  return (
    <Marker
      position={[coordinates[index].lat, coordinates[index].lng]}
      icon={truckIcon}
      ref={markerRef}
    >
      <Popup>Conductor en movimiento</Popup>
    </Marker>
  );
}

// Formatear segundos a h:mm:ss
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const segs = Math.floor(seconds % 60);
  return `${hrs > 0 ? hrs + "h " : ""}${mins}m ${segs}s`;
}

export default function RutaServicio({
  origen,
  destino,
  onCerrar,
  conductorNombre = "Conductor",
  clienteNombre = "Cliente",
  tiempoRecolectaSeg = 300, // 5 min estimado de espera/recolecta
}) {
  const [routeInfo, setRouteInfo] = useState(null);
  const [actualizarKey, setActualizarKey] = useState(0); // para forzar rerender ruta

  // Simulación seguimiento camión (en producción esto vendría via socket o polling)
  // Aquí lo simulamos con coords en ruta
  const [camionCoords, setCamionCoords] = useState([]);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);

  // Cuando cambia la ruta, actualizamos coords para animación y reiniciamos marcador
  useEffect(() => {
    if (routeInfo?.coordinates) {
      setCamionCoords(routeInfo.coordinates);
      setMostrarAnimacion(true);
    }
  }, [routeInfo]);

  const handleActualizarRuta = () => {
    setActualizarKey((k) => k + 1); // cambiar key para reiniciar RoutingMachine
    setMostrarAnimacion(false);
    setCamionCoords([]);
  };

  // Cálculos de tiempo aproximados
  // Tiempo tránsito en ruta (en minutos)
  const tiempoTransito = routeInfo ? routeInfo.time : 0;
  // Tiempo estimado para llegar a recolectar (conduce a origen)
  const tiempoLlegadaRecolecta = tiempoTransito / 2; // suposición: mitad del camino (ajustable)
  // Tiempo estimado entrega (origen->destino + espera)
  const tiempoEntrega = tiempoTransito + tiempoRecolectaSeg;

  // Punto medio para mostrar info tiempo aproximado (en popup o abajo)
  const puntoMedio = routeInfo
    ? routeInfo.coordinates[Math.floor(routeInfo.coordinates.length / 2)]
    : null;

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#121212",
        color: "white",
        padding: 10,
        position: "relative",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <button
        onClick={onCerrar}
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          zIndex: 1000,
          backgroundColor: "#ff4444",
          border: "none",
          borderRadius: 5,
          padding: "8px 12px",
          cursor: "pointer",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Cerrar ruta
      </button>

      <button
        onClick={handleActualizarRuta}
        style={{
          position: "absolute",
          top: 15,
          right: 15,
          zIndex: 1000,
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: 5,
          padding: "8px 12px",
          cursor: "pointer",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Actualizar Ruta
      </button>

      <MapContainer
        key={actualizarKey} // fuerza rerender del mapa para refrescar ruta
        center={[origen.lat, origen.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[origen.lat, origen.lng]} icon={homeIcon}>
          <Popup>{clienteNombre} - Origen</Popup>
        </Marker>

        <Marker position={[destino.lat, destino.lng]} icon={homeIcon}>
          <Popup>{clienteNombre} - Destino</Popup>
        </Marker>

        <RoutingMachine
          key={actualizarKey}
          origen={origen}
          destino={destino}
          onRouteChange={setRouteInfo}
        />

        {/* Animación camión */}
        {mostrarAnimacion && (
          <MovingMarker coordinates={camionCoords} />
        )}
      </MapContainer>

      <div
        style={{
          marginTop: 10,
          backgroundColor: "#222",
          padding: 15,
          borderRadius: 8,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 16,
        }}
      >
        <p><b>Conductor:</b> {conductorNombre}</p>
        <p><b>Tiempo de tránsito estimado:</b> {formatTime(tiempoTransito)}</p>
        <p><b>Tiempo estimado llegada a recolectar:</b> {formatTime(tiempoLlegadaRecolecta)}</p>
        <p><b>Tiempo estimado entrega:</b> {formatTime(tiempoEntrega)}</p>
      </div>
    </div>
  );
}

