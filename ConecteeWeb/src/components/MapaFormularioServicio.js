import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Fix para los íconos del mapa
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Componente que permite seleccionar origen/destino con clic en mapa
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

export default function MapaFormularioServicio() {
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [material, setMaterial] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [origenTexto, setOrigenTexto] = useState("");
  const [destinoTexto, setDestinoTexto] = useState("");

  const handleEnviarServicio = async () => {
    if (!origen || !destino) {
      alert("Selecciona origen y destino (en mapa o manual).");
      return;
    }

    const servicio = {
      usuarioId: "1234567890abcdef", // Aquí puedes usar localStorage o tu estado global
      origen: {
        lat: origen.lat,
        lng: origen.lng,
        direccion: origenTexto,
      },
      destino: {
        lat: destino.lat,
        lng: destino.lng,
        direccion: destinoTexto,
      },
      descripcion,
      material,
      cantidad,
      unidad,
      metodoPago,
      fechaServicio: new Date().toISOString(),
      estado: "Pendiente",
    };

    try {
      console.log("Enviando servicio:", servicio);
      const response = await axios.post("https://conecteeapi-v3.onrender.com/api/Servicios", servicio, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer TU_TOKEN_JWT" // si ya lo manejas
        },
      });
      alert("Servicio enviado correctamente.");
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al enviar servicio.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Solicita un Servicio de Flete</h2>
      <p>Selecciona el origen y destino en el mapa o escribe las direcciones.</p>

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

      <div style={{ marginTop: 20 }}>
        <label>
          Dirección Origen (opcional):
          <input
            type="text"
            value={origenTexto}
            onChange={(e) => setOrigenTexto(e.target.value)}
            placeholder="Ej: Calle 1 #123, Monterrey"
            style={{ width: "100%", marginTop: 5 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Dirección Destino (opcional):
          <input
            type="text"
            value={destinoTexto}
            onChange={(e) => setDestinoTexto(e.target.value)}
            placeholder="Ej: Av. Principal #456, San Nicolás"
            style={{ width: "100%", marginTop: 5 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 15 }}>
        <label>
          Descripción del servicio:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            style={{ width: "100%", marginTop: 5 }}
            placeholder="Ej: Mudanza de muebles, urgente"
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Material a transportar:
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            style={{ width: "100%", marginTop: 5 }}
            placeholder="Ej: Muebles, cajas, electrodomésticos"
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Cantidad de bultos:
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            style={{ width: "100%", marginTop: 5 }}
            placeholder="Ej: 8"
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Unidad requerida:
          <select
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            style={{ width: "100%", marginTop: 5 }}
          >
            <option value="">Selecciona</option>
            <option value="Camión 3.5 Ton Abierto">Camión 3.5 Ton Abierto</option>
            <option value="Camión 3.5 Ton Cerrado">Camión 3.5 Ton Cerrado</option>
            <option value="Camioneta">Camioneta</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Método de pago:
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            style={{ width: "100%", marginTop: 5 }}
          >
            <option value="">Selecciona</option>
            <option value="Transferencia">Transferencia</option>
            <option value="PayPal">PayPal</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleEnviarServicio}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          backgroundColor: "#28a745",
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
