"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

export type IncomeChartType = 'line' | 'bar';

export function IncomeExpenseChart({
  type,
  data,
  options
}: {
  type: IncomeChartType;
  data: ChartData<'line'> | ChartData<'bar'>;
  options: ChartOptions<'line'> | ChartOptions<'bar'>;
}) {
  if (type === 'bar') {
    return <Bar data={data as ChartData<'bar'>} options={options as ChartOptions<'bar'>} />;
  }
  return <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} />;
}

export function CategoryChart({
  data,
  options
}: {
  data: ChartData<'doughnut'>;
  options: ChartOptions<'doughnut'>;
}) {
  return <Doughnut data={data} options={options} />;
}
