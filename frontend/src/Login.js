import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Inicio de sesión simulado');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
    fontSize: '18px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: darkMode ? '#2c2c2c' : '#fff',
    color: darkMode ? '#f5f5f5' : '#000',
    paddingRight: '160px', 
  };

  const buttonStyle = {
    padding: '14px',
    fontSize: '18px',
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

      <h1 style={titleStyle}>Medicapp</h1>

      <div style={cardStyle}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <img
              onClick={() => setShowPassword(!showPassword)}
              src={showPassword ? "/openeye.png" : "/closedeye.png"} 
              alt="Mostrar/Ocultar contraseña"
              style={{
                position: 'absolute',
                right: '1px',
                top: '55%',
                transform: 'translateY(-50%)',
                width: '80px',
                height: '80px',
                cursor: 'pointer',
              }}
            />
          </div>
          <button type="submit" style={buttonStyle}>Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
