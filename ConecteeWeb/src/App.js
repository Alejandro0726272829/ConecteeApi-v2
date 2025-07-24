import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Iconos personalizados
const iconCasa = new L.Icon({
  iconUrl: "/icons/casa.png", // asegúrate de tener este archivo
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const iconCamion = new L.Icon({
  iconUrl: "/icons/camion.png", // asegúrate de tener este archivo
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function LocationMarker({ setCoordenadas, tipo }) {
  useMapEvents({
    click(e) {
      setCoordenadas(e.latlng);
    },
  });

  return null;
}

function App() {
  const [origen, setOrigen] = useState({ direccion: "", coordenadas: null });
  const [destino, setDestino] = useState({ direccion: "", coordenadas: null });
  const [descripcion, setDescripcion] = useState("");
  const [cantidadBultos, setCantidadBultos] = useState(1);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [servicios, setServicios] = useState([]);

  const setOrigenCoordenadas = (coords) => setOrigen((prev) => ({ ...prev, coordenadas: coords }));
  const setDestinoCoordenadas = (coords) => setDestino((prev) => ({ ...prev, coordenadas: coords }));

  useEffect(() => {
    obtenerServicios();
  }, []);

  const obtenerServicios = async () => {
    try {
      const response = await axios.get("https://conecteeapi-v3.onrender.com/api/Servicios");
      setServicios(response.data);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
    }
  };

  const enviarServicio = async () => {
    const nuevoServicio = {
      usuarioId: "6876a776c267119877b6e4e8", // este es fijo por ahora
      origen,
      destino,
      descripcion,
      cantidadBultos,
      metodoPago,
    };

    try {
      const response = await axios.post("https://conecteeapi-v3.onrender.com/api/Servicios", nuevoServicio);
      alert("Servicio enviado correctamente");
      setServicios([...servicios, response.data]);
    } catch (error) {
      console.error("Error al enviar servicio:", error);
      alert("Error al enviar el servicio");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Solicitar Servicio</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Dirección de Origen:</label>
        <input
          type="text"
          value={origen.direccion}
          onChange={(e) => setOrigen({ ...origen, direccion: e.target.value })}
          placeholder="Ej. Av. Principal 123"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Dirección de Destino:</label>
        <input
          type="text"
          value={destino.direccion}
          onChange={(e) => setDestino({ ...destino, direccion: e.target.value })}
          placeholder="Ej. Calle Secundaria 456"
        />
      </div>

      <div style={{ height: "400px", marginBottom: "20px" }}>
        <MapContainer center={[25.6866, -100.3161]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker setCoordenadas={setOrigenCoordenadas} tipo="origen" />
          <LocationMarker setCoordenadas={setDestinoCoordenadas} tipo="destino" />
          {origen.coordenadas && <Marker position={origen.coordenadas} icon={iconCasa} />}
          {destino.coordenadas && <Marker position={destino.coordenadas} icon={iconCamion} />}
        </MapContainer>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción del servicio"
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Cantidad de bultos:</label>
        <input
          type="number"
          value={cantidadBultos}
          onChange={(e) => setCantidadBultos(parseInt(e.target.value))}
          min={1}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Método de pago:</label>
        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <button onClick={enviarServicio}>Enviar Servicio</button>

      <h2 style={{ marginTop: "40px" }}>Servicios Enviados</h2>
      <ul>
        {servicios.map((servicio, index) => (
          <li key={index}>
            <strong>Origen:</strong> {servicio.origen?.direccion || "Sin dirección"} <br />
            <strong>Destino:</strong> {servicio.destino?.direccion || "Sin dirección"} <br />
            <strong>Descripción:</strong> {servicio.descripcion} <br />
            <strong>Bultos:</strong> {servicio.cantidadBultos} <br />
            <strong>Método de Pago:</strong> {servicio.metodoPago}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

