import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Registro simulado');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const [fontSize, setFontSize] = useState(16);

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
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    width: '70px',
    height: '50px',
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
    padding: '15px',
    fontSize: `${fontSize}px`,
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: darkMode ? '#2c2c2c' : '#fff',
    color: darkMode ? '#f5f5f5' : '#000',
    width: '92%',
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

  const passwordContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const eyeIconStyle = {
    position: 'absolute',
    right: '1px',
    cursor: 'pointer',
    width: '80px',
    height: '80px',
  };

  return (
    <div style={containerStyle}>
      <img
        onClick={toggleDarkMode}
        src={darkMode ? "/lightmode.png" : "/darkmode.png"}
        alt="Modo oscuro"
        style={{ ...toggleButtonStyle }}
      />
      <h1 style={titleStyle}>Medicapp</h1>

      <div style={cardStyle}>
        <h2>Registro</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
  <button type="button" onClick={disminuirFuente} style={buttonStyle}>A-</button>
  <button type="button" onClick={aumentarFuente} style={buttonStyle}>A+</button>
      </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={passwordContainerStyle}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '40px' }}
            />
            <img
              onClick={togglePasswordVisibility}
              src={showPassword ? "/openeye.png" : "/closedeye.png"}
              alt="Mostrar contraseña"
              style={eyeIconStyle}
              
            />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Registrarse</button>
        </form>
        <p>
  ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
</p>

      </div>
    </div>
  );
}

export default Registro;
