"use client"; // Es crucial para componentes de cliente en Next.js App Router

import React from 'react';
import { Bar } from 'react-chartjs-2'; // Importa el tipo de gráfico que usarás
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js que vas a usar.
// Esto es importante para que Chart.js sepa cómo dibujar los elementos del gráfico.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Definir las props si tu gráfico va a ser dinámico
interface MyChartProps {
  chartTitle?: string;
  labels?: string[];
  dataValues?: number[];
  datasetLabel?: string;
}

export function MyChart({
  chartTitle = 'Mi Gráfico por Defecto',
  labels = ['Dato A', 'Dato B', 'Dato C', 'Dato D'],
  dataValues = [10, 20, 15, 25],
  datasetLabel = 'Valores'
}: MyChartProps) {

  // Los datos de tu gráfico
  const data = {
    labels: labels, // Usará las labels de las props o las por defecto
    datasets: [
      {
        label: datasetLabel, // Usará el label de las props o el por defecto
        data: dataValues, // Usará los valores de las props o los por defecto
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Las opciones de tu gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite controlar el tamaño del contenedor
    plugins: {
      title: {
        display: true,
        text: chartTitle, // Usará el título de las props
        font: {
          size: 18,
        },
      },
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}> {/* Contenedor para el gráfico */}
      <Bar data={data} options={options} />
    </div>
  );
}