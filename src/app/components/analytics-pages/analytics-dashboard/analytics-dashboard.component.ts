import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {BaseChartDirective} from 'ng2-charts';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
  Legend, ChartData, ChartOptions, DoughnutController, ArcElement,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
);

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseChartDirective
  ],
  templateUrl: './analytics-dashboard.component.html',
  styleUrl: './analytics-dashboard.component.css'
})
export class AnalyticsDashboardComponent {
  lineChartData: ChartData<'line'> = {
    labels: ['Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг'],
    datasets: [
      {
        label: 'Активность',
        data: [1000, 1500, 2000, 2500, 3000, 1500, 2000, 2500, 3000, 3200, 3500, 4000],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };


  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000000',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 5,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
          color: '#888888',
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          font: {
            size: 14,
          },
          color: '#888888',
        },
      },
    },
  };



  barChartData: ChartData<'bar'> = {
    labels: ['Ziyatker', '140Online', 'Bolashaq', '125High', 'Maximum', 'Ziyatker'],
    datasets: [
      {
        label: 'Учащиеся',
        data: [110, 130, 120, 125, 135, 110],
        backgroundColor: 'rgba(0, 123, 255, 0.7)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  chartData = {
    labels: [
      '100 - 120 балл',
      '90 - 100 балл',
      '80 - 90 балл',
      '70 - 80 балл',
      '60 - 70 балл',
    ],
    datasets: [
      {
        data: [45, 30, 10, 5, 3],
        backgroundColor: ['#C3BFFA', '#A7EC9B', '#FDB44B', '#FF6B6B', '#F8A5FF'],
        borderWidth: 0,
        borderRadius: 21
      },
    ],
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
}
