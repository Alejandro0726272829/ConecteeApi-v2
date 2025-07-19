import React from 'react';
import camion from '../icons/camion.png';
import casa from '../icons/casa.png';

function Icono() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <img src={camion} alt="Camión" width="64" height="64" />
        <p style={{ color: 'white' }}>Camión</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <img src={casa} alt="Casa" width="64" height="64" />
        <p style={{ color: 'white' }}>Casa</p>
      </div>
    </div>
  );
}

export default Icono;


