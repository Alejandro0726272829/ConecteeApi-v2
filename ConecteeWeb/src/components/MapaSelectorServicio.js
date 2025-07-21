import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios"; // 👈 nuevo import
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
  const [enviando, setEnviando] = useState(false);

  const handleEnviarServicio = async () => {
    if (!origen || !destino) {
      alert("Selecciona origen y destino antes de enviar el servicio.");
      return;
    }

    const nuevoServicio = {
      usuarioId: "6876a776c267119877b6e4e8", // ⚠️ reemplazar por dinámico si es necesario
      origen: { lat: origen.lat, lng: origen.lng },
      destino: { lat: destino.lat, lng: destino.lng },
      descripcion: descripcion || "Servicio sin descripción",
      fechaServicio: new Date().toISOString(),
      estado: "Pendiente",
    };

    try {
      setEnviando(true);

      const response = await axios.post(
        "https://conecteeapi-v3.onrender.com/api/Servicios",
        nuevoServicio,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`, // si usas JWT
          },
        }
      );

      console.log("✅ Servicio creado:", response.data);
      alert("Servicio enviado correctamente.");

      // Resetear formulario
      setOrigen(null);
      setDestino(null);
      setDescripcion("");
    } catch (error) {
      console.error("❌ Error al enviar servicio:", error);
      alert("Hubo un error al enviar el servicio.");
    } finally {
      setEnviando(false);
    }
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
        disabled={enviando}
        style={{
          marginTop: 15,
          padding: "10px 20px",
          backgroundColor: enviando ? "#999" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: enviando ? "not-allowed" : "pointer",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        {enviando ? "Enviando..." : "Enviar Servicio"}
      </button>
    </div>
  );
}

