import React, { useState } from 'react';
import MapaFormularioServicio from './components/MapaFormularioServicio';
import RutaServicio from './components/RutaServicio';

function App() {
  const [mostrarRuta, setMostrarRuta] = useState(false);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);

  const handleServicioCreado = ({ origen, destino }) => {
    setOrigen(origen);
    setDestino(destino);
    setMostrarRuta(true);
  };

  const handleCerrarRuta = () => {
    setMostrarRuta(false);
    setOrigen(null);
    setDestino(null);
  };

  return (
    <div>
      {!mostrarRuta ? (
        <MapaFormularioServicio onServicioCreado={handleServicioCreado} />
      ) : (
        <RutaServicio
          origen={origen}
          destino={destino}
          onCerrar={handleCerrarRuta}
          conductorNombre="Conductor Ejemplo"
          clienteNombre="Cliente Ejemplo"
        />
      )}
    </div>
  );
}

export default App;

