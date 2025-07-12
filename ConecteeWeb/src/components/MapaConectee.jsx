import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';

// Fix para íconos que no cargan correctamente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const MapaConectee = ({ marcadores, zoom = 12, center = [25.6866, -100.3161] }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {marcadores.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>{m.nombre || 'Sin nombre'}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

MapaConectee.propTypes = {
  marcadores: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      nombre: PropTypes.string,
    })
  ).isRequired,
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
};

export default MapaConectee;
