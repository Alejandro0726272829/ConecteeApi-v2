import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const truckIconUrl = "https://cdn-icons-png.flaticon.com/512/1995/1995523.png";
const homeIconUrl = "https://cdn-icons-png.flaticon.com/512/25/25694.png";

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

function RoutingMachine({ origen, destino, onRouteChange }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (
      !origen ||
      !destino ||
      typeof origen.lat !== "number" ||
      typeof origen.lng !== "number" ||
      typeof destino.lat !== "number" ||
      typeof destino.lng !== "number"
    )
      return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(origen.lat, origen.lng), L.latLng(destino.lat, destino.lng)],
      lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: () => null,
    }).addTo(map);

    routingControlRef.current.on("routesfound", (e) => {
      const route = e.routes[0];
      onRouteChange({
        distance: route.summary.totalDistance,
        time: route.summary.totalTime,
        coordinates: route.coordinates,
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
    }, 500);

    return () => clearInterval(interval);
  }, [coordinates]);

  if (!coordinates || coordinates.length === 0) return null;

  return (
    <Marker position={[coordinates[index].lat, coordinates[index].lng]} icon={truckIcon} ref={markerRef}>
      <Popup>Conductor en movimiento</Popup>
    </Marker>
  );
}

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
  tiempoRecolectaSeg = 300,
}) {
  const [routeInfo, setRouteInfo] = useState(null);
  const [actualizarKey, setActualizarKey] = useState(0);
  const [camionCoords, setCamionCoords] = useState([]);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);

  useEffect(() => {
    if (routeInfo?.coordinates) {
      setCamionCoords(routeInfo.coordinates);
      setMostrarAnimacion(true);
    }
  }, [routeInfo]);

  const handleActualizarRuta = () => {
    setActualizarKey((k) => k + 1);
    setMostrarAnimacion(false);
    setCamionCoords([]);
  };

  const tiempoTransito = routeInfo ? routeInfo.time : 0;
  const tiempoLlegadaRecolecta = tiempoTransito / 2;
  const tiempoEntrega = tiempoTransito + tiempoRecolectaSeg;

  if (
    !origen ||
    !destino ||
    typeof origen.lat !== "number" ||
    typeof origen.lng !== "number" ||
    typeof destino.lat !== "number" ||
    typeof destino.lng !== "number"
  ) {
    return (
      <div style={{ color: "white", padding: 20 }}>
        <p>Error: coordenadas de origen o destino inválidas.</p>
      </div>
    );
  }

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
        Actualizar ruta
      </button>

      <MapContainer
        key={actualizarKey}
        center={[origen.lat, origen.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[origen.lat, origen.lng]} icon={homeIcon}>
          <Popup>{clienteNombre} (Origen)</Popup>
        </Marker>

        <Marker position={[destino.lat, destino.lng]} icon={truckIcon}>
          <Popup>{conductorNombre} (Destino)</Popup>
        </Marker>

        <RoutingMachine origen={origen} destino={destino} onRouteChange={setRouteInfo} />

        {mostrarAnimacion && <MovingMarker coordinates={camionCoords} />}
      </MapContainer>

      {routeInfo && (
        <div
          style={{
            position: "absolute",
            bottom: 15,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#222",
            padding: 15,
            borderRadius: 8,
            maxWidth: 400,
            width: "90%",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <h3>Detalles de la ruta</h3>
          <p>
            Distancia: {(routeInfo.distance / 1000).toFixed(2)} km
            <br />
            Tiempo estimado: {formatTime(routeInfo.time)}
            <br />
            Tiempo llegada a recolecta: {formatTime(tiempoLlegadaRecolecta)}
            <br />
            Tiempo entrega estimado: {formatTime(tiempoEntrega)}
          </p>
        </div>
      )}
    </div>
  );
}


  


