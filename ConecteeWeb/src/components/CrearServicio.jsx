import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function LocationSelector({ setOrigenMapa, setDestinoMapa, origenMapa, destinoMapa }) {
  useMapEvents({
    click(e) {
      if (!origenMapa) {
        setOrigenMapa(e.latlng);
      } else if (!destinoMapa) {
        setDestinoMapa(e.latlng);
      } else {
        setOrigenMapa(e.latlng);
        setDestinoMapa(null);
      }
    },
  });
  return null;
}

export default function CrearServicio() {
  const [origenMapa, setOrigenMapa] = useState(null);
  const [destinoMapa, setDestinoMapa] = useState(null);
  const [origenTexto, setOrigenTexto] = useState("");
  const [destinoTexto, setDestinoTexto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [material, setMaterial] = useState("");
  const [bultos, setBultos] = useState(1);
  const [unidad, setUnidad] = useState("Camioneta");
  const [metodoPago, setMetodoPago] = useState("Transferencia");

  const handleEnviarServicio = async () => {
    if (
      (!origenMapa && !origenTexto) ||
      (!destinoMapa && !destinoTexto) ||
      !descripcion ||
      !material ||
      !unidad ||
      !metodoPago
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const nuevoServicio = {
      origen: origenMapa
        ? { lat: origenMapa.lat, lng: origenMapa.lng }
        : { direccion: origenTexto },
      destino: destinoMapa
        ? { lat: destinoMapa.lat, lng: destinoMapa.lng }
        : { direccion: destinoTexto },
      descripcion,
      material,
      cantidadBultos: bultos,
      unidadRequerida: unidad,
      metodoPago,
      fechaServicio: new Date().toISOString(),
      estado: "Pendiente",
      usuarioId: "aquí_va_el_ID_dinamico", // dinámico si lo tienes
    };

    try {
      const response = await axios.post("https://conecteeapi-v3.onrender.com/api/Servicios", nuevoServicio);
      console.log("Servicio creado:", response.data);
      alert("✅ Servicio enviado correctamente.");
    } catch (error) {
      console.error("Error al enviar servicio:", error);
      alert("❌ Error al enviar el servicio.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>Crear Nuevo Servicio</h2>

      <label>🧭 Dirección de Origen (opcional si usas mapa):</label>
      <input
        type="text"
        value={origenTexto}
        onChange={(e) => setOrigenTexto(e.target.value)}
        placeholder="Ej. Av. Juárez 100, Monterrey"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>🎯 Dirección de Destino (opcional si usas mapa):</label>
      <input
        type="text"
        value={destinoTexto}
        onChange={(e) => setDestinoTexto(e.target.value)}
        placeholder="Ej. Calle Hidalgo 200, San Pedro"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <MapContainer
        center={[25.6866, -100.3161]}
        zoom={13}
        style={{ height: "300px", borderRadius: 10, marginBottom: 10 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <LocationSelector
          setOrigenMapa={setOrigenMapa}
          setDestinoMapa={setDestinoMapa}
          origenMapa={origenMapa}
          destinoMapa={destinoMapa}
        />
        {origenMapa && <Marker position={origenMapa}><Popup>Origen</Popup></Marker>}
        {destinoMapa && <Marker position={destinoMapa}><Popup>Destino</Popup></Marker>}
      </MapContainer>

      <label>📝 Descripción del viaje:</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
        placeholder="Ej. Llevar muebles de oficina"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>📦 Material:</label>
      <input
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
        placeholder="Ej. Muebles, cajas, electrónicos"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>🎒 Cantidad de bultos:</label>
      <input
        type="number"
        value={bultos}
        onChange={(e) => setBultos(Number(e.target.value))}
        min={1}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>🚚 Unidad requerida:</label>
      <select
        value={unidad}
        onChange={(e) => setUnidad(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option>Camioneta</option>
        <option>Camión 3.5 Ton. Abierto</option>
        <option>Camión 3.5 Ton. Cerrado</option>
      </select>

      <label>💳 Método de pago:</label>
      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
        style={{ width: "100%", marginBottom: 15 }}
      >
        <option>Transferencia</option>
        <option>PayPal</option>
      </select>

      <button
        onClick={handleEnviarServicio}
        style={{
          padding: "12px 20px",
          width: "100%",
          backgroundColor: "#28a745",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: 8,
        }}
      >
        🚀 Enviar Servicio
      </button>
    </div>
  );
}
