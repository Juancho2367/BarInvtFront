import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports: React.FC = () => {
  const [mostConsumedProducts, setMostConsumedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch most consumed products from API
  const fetchMostConsumedProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products/most-consumed');
      setMostConsumedProducts(response.data);
    } catch (error) {
      console.error('Error fetching most consumed products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMostConsumedProducts();
  }, []);

  // Sample data for sales chart
  const salesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ventas',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Dynamic data for most consumed products
  const mostConsumedData = {
    labels: mostConsumedProducts.map(product => product.name),
    datasets: [
      {
        label: 'Unidades Consumidas',
        data: mostConsumedProducts.map(product => product.consumption),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const stats = [
    {
      name: 'Ventas Totales',
      value: '$12,345',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Valor Promedio de Orden',
      value: '$45.67',
      change: '+8%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Reportes y Análisis</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Trend */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Tendencia de Ventas</h2>
          <div className="mt-6" style={{ height: '300px' }}>
            <Line data={salesData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Most Consumed Products */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Productos Más Consumidos</h2>
              <p className="text-sm text-gray-500 mt-1">Basado en cambios de inventario</p>
            </div>
            <button
              onClick={fetchMostConsumedProducts}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
          <div className="mt-6" style={{ height: '300px' }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Cargando datos...</div>
              </div>
            ) : mostConsumedProducts.length > 0 ? (
              <Bar data={mostConsumedData} options={{ maintainAspectRatio: false }} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">No hay datos disponibles</div>
              </div>
            )}
          </div>
          
          {/* Consumption Details Table */}
          {!isLoading && mostConsumedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Detalles de Consumo</h3>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Consumo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock Actual</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mostConsumedProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 capitalize">{product.category}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.consumption} unidades</td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          <span className={`${product.currentStock <= product.minStock ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {product.currentStock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Reports */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Reportes Adicionales</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-900">Reporte de Inventario</span>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-900">Reporte de Clientes</span>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
            <span className="text-sm font-medium text-gray-900">Reporte de Impacto de Eventos</span>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports; 