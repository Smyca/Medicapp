import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Informacion from './Informacion';
import Registro from './Registro';
import Medicamentos from './Medicamentos';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/informacion" element={<Informacion />} />
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/medicamentos" element={<Medicamentos />} />
    </Routes>
  </BrowserRouter>
);


reportWebVitals();
