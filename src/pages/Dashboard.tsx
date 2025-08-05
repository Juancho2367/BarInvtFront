import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // Sample data for the chart
  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ventas Mensuales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const stats = [
    { name: 'Ventas Totales', value: '$12,345', change: '+12%' },
    { name: 'Ingresos Totales', value: '$45,678', change: '+8%' },
    { name: 'Productos con Bajo Stock', value: '5', change: '-2' },
    { name: 'Pagos Pendientes', value: '$2,345', change: '+3%' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Panel de Control</h1>
      
      {/* Stats Grid - More Mobile Friendly */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Chart - Responsive */}
      <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Resumen de Ventas</h2>
        <div className="mt-4 sm:mt-6" style={{ height: '250px' }}>
          <Line 
            data={chartData} 
            options={{ 
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  display: window.innerWidth > 640
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Recent Activity - Responsive */}
      <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
        <div className="mt-4 sm:mt-6 flow-root">
          <ul role="list" className="-my-3 sm:-my-5 divide-y divide-gray-200">
            {[1, 2, 3].map((item) => (
              <li key={item} className="py-3 sm:py-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                      <span className="text-sm font-medium leading-none text-primary-600">
                        {item}
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      Venta #{item} completada
                    </p>
                    <p className="truncate text-xs sm:text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Completada
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 