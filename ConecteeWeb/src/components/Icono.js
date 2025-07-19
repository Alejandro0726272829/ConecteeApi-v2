import React from 'react';
import camion from '../icons/2C57DF38-D09A-443A-9902-215C302AE188.jpeg';
import casa from '../icons/CE9D8C36-2DE0-4FDC-8F7D-492A517E2003.png';

function Icono() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <img src={camion} alt="Camión" width={64} height={64} />
        <p style={{ color: 'white', marginTop: '8px' }}>Camión</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <img src={casa} alt="Casa" width={64} height={64} />
        <p style={{ color: 'white', marginTop: '8px' }}>Casa</p>
      </div>
    </div>
  );
}

export default Icono;



