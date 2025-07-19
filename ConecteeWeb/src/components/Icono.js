import React from 'react';
import barnIcon from '../icons/barn_5988720.png';
import truckIcon from '../icons/truck_713311.png';

function Iconos() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div>
        <img src={barnIcon} alt="Icono de bodega" width={64} height={64} />
        <p>Bodega</p>
      </div>
      <div>
        <img src={truckIcon} alt="Icono de camión" width={64} height={64} />
        <p>Camión</p>
      </div>
    </div>
  );
}

export default Iconos;
