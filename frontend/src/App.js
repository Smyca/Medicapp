import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Medicamentos from './Medicamentos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
      </Routes>
    </Router>
  );
}

export default App;
