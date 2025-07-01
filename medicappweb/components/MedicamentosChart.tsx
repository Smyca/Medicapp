"use client";

import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Medicamento = { nombre: string };

function getMedicamentoStats(datos: Medicamento[]) {
  const stats: Record<string, number> = {};
  datos.forEach((d) => {
    if (d.nombre) {
      stats[d.nombre] = (stats[d.nombre] || 0) + 1;
    }
  });
  return stats;
}

export default function MedicamentosChart({ datos }: { datos: Medicamento[] }) {
  const stats = getMedicamentoStats(datos);
  const labels = Object.keys(stats);
  const values = Object.values(stats);

  const data = {
    labels,
    datasets: [
      {
        label: "Cantidad de usuarios",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Usuarios por medicamento importante" },
        },
      }}
    />
  );
}