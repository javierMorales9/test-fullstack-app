import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import styles from "pages/stats.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const LineChart = () => {
  return (
    <>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>Total and Saved</span>
        <div className={styles.legends}>
          <span>Total</span> <span>Saved</span>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <Line
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            interaction: {
              mode: "index",
              // axis: 'y',
              intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                // min: 0,
                // max: 400,
                beginAtZero: true,
                grid: {
                  borderDash: [1, 3],
                },
                ticks: {
                  stepSize: 100,
                },
              },
            },
          }}
          data={{
            labels: [
              "Jan",
              "Feb",
              "March",
              "April",
              "May",
              "June",
              "July",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Saved",
                data: [
                  133, 253, 385, 241, 344, 165, 243, 125, 335, 251, 154, 276,
                ],
                lineTension: 0.5,
                borderColor: "#20C9AC",
              },
              {
                label: "Total",
                data: [
                  243, 125, 335, 251, 154, 276, 133, 253, 385, 241, 344, 165,
                ],
                lineTension: 0.5,
                borderColor: "#5542F6",
              },
            ],
          }}
        />
      </div>
    </>
  );
};

export default LineChart;
