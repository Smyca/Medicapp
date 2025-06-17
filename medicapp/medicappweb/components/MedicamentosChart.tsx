"use client";

import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Usuario = { medicamentoImportante: string };

function getMedicamentoStats(datos: Usuario[]) {
  const stats: Record<string, number> = {};
  datos.forEach((d) => {
    stats[d.medicamentoImportante] = (stats[d.medicamentoImportante] || 0) + 1;
  });
  return stats;
}

export default function MedicamentosChart({ datos }: { datos: Usuario[] }) {
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