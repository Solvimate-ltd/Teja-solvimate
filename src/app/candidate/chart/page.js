"use client";
import { useRef, useEffect } from "react";
import {
  Chart,
  PieController,
  ArcElement,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

export default function PieChart() {
  const chartRef = useRef(null);

  const labels = ["John", "Jane", "Doe", "ABCD", "Gautam", "POIU"];
  const backgroundColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(255, 205, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(0, 128, 0, 0.6)",
  ];
  const borderColors = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgba(0, 128, 0, 0.6)",
  ];

  useEffect(() => {
    Chart.register(
      PieController,
      ArcElement,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );

    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Info",
              data: [32, 16, 75, 15, 78, 11],
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      chartRef.current.chart = newChart;
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto items-center md:items-start gap-6 p-4">
      {/* Chart */}
      <div className="w-full md:w-2/3 aspect-square">
        <canvas ref={chartRef} />
      </div>

      {/* Labels */}
      <div className="w-full md:w-1/3 space-y-2">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: backgroundColors[index] }}
            />
            <span className="text-sm md:text-base">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


