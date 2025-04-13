import React from 'react';


function Medicamentos() {
    const [darkMode, setDarkMode] = React.useState(false);
    const [medicamentos, setMedicamentos] = React.useState([]);
    const [fontSize, setFontSize] = React.useState(16);
    const [nuevo, setNuevo] = React.useState({
      nombre: '',
      dosisCompleta: '',
      hora: '',
      frecuencia: ''
    });
  
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
    };
  
    const handleChange = (e) => {
      setNuevo({ ...nuevo, [e.target.name]: e.target.value });
    };
  
    const aumentarTexto = () => setFontSize(prev => Math.min(prev + 2, 32));
    const disminuirTexto = () => setFontSize(prev => Math.max(prev - 2, 10));
  
    const agregarMedicamento = () => {
      const camposLlenos = Object.values(nuevo).every((campo) => campo.trim() !== '');
      if (camposLlenos) {
        setMedicamentos([...medicamentos, nuevo]);
        setNuevo({ nombre: '', dosisCompleta: '', hora: '', frecuencia: '' });
      } else {
        alert('Por favor completa todos los campos.');
      }
    };
  
    const containerStyle = {
      minHeight: '100vh',
      paddingTop: '80px',
      backgroundColor: darkMode ? '#121212' : '#f0f2f5',
      color: darkMode ? '#f5f5f5' : '#121212',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      transition: 'all 0.3s ease',
      position: 'relative'
    };
    const eliminarMedicamento = (index) => {
        const nuevaLista = medicamentos.filter((_, i) => i !== index);
        setMedicamentos(nuevaLista);
      };
      
    const toggleStyle = {
      position: 'absolute',
      top: '20px',
      right: '20px',
      cursor: 'pointer',
      width: '70px',
      height: '50px'
    };
  
    const titleStyle = {
      textAlign: 'center',
      fontSize: '48px',
      marginBottom: '30px',
      fontWeight: 'bold'
    };
  
    const formStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    };
  
    const inputStyle = {
      padding: '14px',
      fontSize: `${fontSize}px`,
      borderRadius: '8px',
      border: '1px solid #ccc',
      backgroundColor: darkMode ? '#2c2c2c' : '#fff',
      color: darkMode ? '#f5f5f5' : '#000'
    };
  
    const buttonStyle = {
      padding: '14px',
      fontSize: `${fontSize}px`,
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    };
  
    const listaStyle = {
      maxWidth: '600px',
      margin: '40px auto 0',
      listStyle: 'none',
      padding: 0
    };
  
    const itemStyle = {
      backgroundColor: darkMode ? '#2c2c2c' : '#e0e0e0',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '12px'
    };
  
    return (
        <div style={containerStyle}>
          <img
            onClick={toggleDarkMode}
            src={darkMode ? "/lightmode.png" : "/darkmode.png"}
            alt="Alternar modo"
            style={toggleStyle}
          />
      
          <h1 style={titleStyle}> Registro de Medicamentos</h1>
      
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button onClick={disminuirTexto} style={{ ...buttonStyle, marginRight: '10px' }}>A–</button>
            <button onClick={aumentarTexto} style={buttonStyle}>A+</button>
          </div>
      
          
          <ul style={listaStyle}>
  {medicamentos.length === 0 ? (
    <p style={{ textAlign: 'center', marginTop: '30px' }}>No hay medicamentos registrados.</p>
  ) : (
    medicamentos.map((med, index) => (
      <li key={index} style={{ ...itemStyle, position: 'relative' }}>
        <strong>{med.nombre}</strong> - {med.dosisCompleta}<br />
        <span>🕒 {med.hora} | ⏱️ {med.frecuencia}</span>
        <button
          onClick={() => eliminarMedicamento(index)}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: darkMode ? '#f5f5f5' : '#121212',
            fontSize: '18px',
            cursor: 'pointer'
          }}
          title="Eliminar"
        >
          ❌
        </button>
      </li>
    ))
  )}
</ul>

      
          
          <div style={formStyle}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del medicamento"
              value={nuevo.nombre}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="dosisCompleta"
              placeholder="Ej: 2 pastillas de 500mg"
              value={nuevo.dosisCompleta}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="time"
              name="hora"
              value={nuevo.hora}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="frecuencia"
              placeholder="Frecuencia (ej: cada 8 horas)"
              value={nuevo.frecuencia}
              onChange={handleChange}
              style={inputStyle}
            />
            <button onClick={agregarMedicamento} style={buttonStyle}>Agregar Medicamento</button>
          </div>
        </div>
      );}
      
  
  export default Medicamentos;
  