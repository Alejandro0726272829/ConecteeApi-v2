import React from 'react';

function Dashboard({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111',
      color: '#fff',
      padding: 40,
      textAlign: 'center'
    }}>
      <h1>Bienvenido a tu Dashboard 🚀</h1>
      <p>Estás autenticado correctamente.</p>

      <button onClick={handleLogout} style={{ marginTop: 20, padding: 10 }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
