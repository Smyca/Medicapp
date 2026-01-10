import React, { createContext, useState } from 'react';

export const MedicamentosContext = createContext({
  medicamentos: [],
  agregarMedicamento: () => {},
  eliminarMedicamento: () => {},
});

export const MedicamentosProvider = ({ children }) => {
  const [medicamentos, setMedicamentos] = useState([]);

  const agregarMedicamento = (medicamento) => {
    setMedicamentos([...medicamentos, {
      ...medicamento,
      id: Date.now(),
      ultimaDosis: new Date(),
      proximaDosis: calcularProximaDosis(medicamento),
    }]);
  };

  const eliminarMedicamento = (id) => {
    setMedicamentos(medicamentos.filter(med => med.id !== id));
  };

  const calcularProximaDosis = (medicamento) => {
    const ahora = new Date();
    const frecuencia = medicamento.frecuencia;
    
    switch(frecuencia) {
      case 'Cada 8 horas':
        return new Date(ahora.getTime() + 8 * 60 * 60 * 1000);
      case 'Cada 12 horas':
        return new Date(ahora.getTime() + 12 * 60 * 60 * 1000);
      case 'Una vez al día':
        return new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
      default:
        return new Date(ahora.getTime() + 8 * 60 * 60 * 1000);
    }
  };

  return (
    <MedicamentosContext.Provider value={{ medicamentos, agregarMedicamento, eliminarMedicamento }}>
      {children}
    </MedicamentosContext.Provider>
  );
}; 