import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para íconos que no cargan correctamente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Componente para detectar clics y setear puntos
function LocationSelector({ setOrigen, setDestino, origen, destino }) {
  useMapEvents({
    click(e) {
      if (!origen) {
        setOrigen(e.latlng);
      } else if (!destino) {
        setDestino(e.latlng);
      } else {
        // Si ya hay origen y destino, al siguiente clic resetea y comienza de nuevo
        setOrigen(e.latlng);
        setDestino(null);
      }
    },
  });
  return null;
}

export default function MapaSelectorServicio() {
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [descripcion, setDescripcion] = useState("");

  const handleEnviarServicio = () => {
    if (!origen || !destino) {
      alert("Selecciona origen y destino antes de enviar el servicio.");
      return;
    }
    // Aquí podrías llamar a tu backend con fetch o axios
    const nuevoServicio = {
      origen: { lat: origen.lat, lng: origen.lng },
      destino: { lat: destino.lat, lng: destino.lng },
      descripcion: descripcion || "Servicio sin descripción",
      fechaServicio: new Date().toISOString(),
      estado: "Pendiente",
      // agrega lo que necesites, clienteId, conductorId etc.
    };
    console.log("Servicio a enviar:", nuevoServicio);
    alert("Servicio listo para enviar. Revisa consola.");
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>Selecciona Origen y Destino</h2>
      <p>Haz clic en el mapa para elegir origen y destino. El tercer clic reinicia.</p>

      <MapContainer
        center={[25.6866, -100.3161]}
        zoom={13}
        style={{ height: "400px", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationSelector
          setOrigen={setOrigen}
          setDestino={setDestino}
          origen={origen}
          destino={destino}
        />
        {origen && (
          <Marker position={origen}>
            <Popup>Origen</Popup>
          </Marker>
        )}
        {destino && (
          <Marker position={destino}>
            <Popup>Destino</Popup>
          </Marker>
        )}
      </MapContainer>

      <div style={{ marginTop: 15 }}>
        <label>
          Descripción del servicio (opcional):
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            style={{ width: "100%", marginTop: 5 }}
            placeholder="Ej: Mudanza pequeña"
          />
        </label>
      </div>

      <button
        onClick={handleEnviarServicio}
        style={{
          marginTop: 15,
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        Enviar Servicio
      </button>
    </div>
  );
}
