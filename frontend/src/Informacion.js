import React, { useState } from 'react';

function Informacion() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const aumentarFuente = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const disminuirFuente = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkMode ? '#121212' : '#f0f2f5',
    transition: 'background-color 0.3s ease',
    position: 'relative',
  };

  const titleStyle = {
    position: 'absolute',
    top: '40px',
    width: '100%',
    textAlign: 'center',
    fontSize: '48px',
    color: darkMode ? '#f5f5f5' : '#121212',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 12px',
    fontSize: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: darkMode ? '#f5f5f5' : '#333',
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    color: darkMode ? '#f5f5f5' : '#333',
  };

  const inputStyle = {
    padding: '20px',
    fontSize: `${fontSize}px`,
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: darkMode ? '#2c2c2c' : '#fff',
    color: darkMode ? '#f5f5f5' : '#000',
  };

  const buttonStyle = {
    padding: '14px',
    fontSize: `${fontSize}px`,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <img
        onClick={toggleDarkMode}
        src={darkMode ? "/lightmode.png" : "/darkmode.png"}
        alt="Modo oscuro"
        style={{
          ...toggleButtonStyle,
          width: '70px',
          height: '50px',
          transition: 'all 0.3s ease',
        }}
      />

      <h1 style={titleStyle}>Tu Información</h1>

      <div style={cardStyle}>
        <h2>Detalles</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button type="button" onClick={disminuirFuente} style={buttonStyle}>A-</button>
          <button type="button" onClick={aumentarFuente} style={buttonStyle}>A+</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '350px', 
              height: '180px', 
              margin: '20px auto',
              backgroundColor: '#ddd',
              textAlign: 'center',
              lineHeight: '150px',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '10px', 
              border: '2px solid #bbb', 
            }}>
              Imagen carnet
            </div>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold' }}>RUT</label>
            <input
              type="text"
              placeholder="12345678-9"
              style={inputStyle}
              disabled
            />
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold' }}>Números de emergencia</label>
            <input
              type="text"
              placeholder="Hija: 1234 1234    //    Hijo: 1234 1234"
              style={inputStyle}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Informacion;
