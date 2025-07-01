import React, { useState } from 'react';
import Button from '../components/UI/Button';
import { Sale, Product } from '../types';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      products: [
        {
          productId: '1',
          quantity: 2,
          price: 5.99,
          subtotal: 11.98,
        },
      ],
      total: 11.98,
      paymentMethod: 'efectivo',
      status: 'completada',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more sample sales here
  ]);

  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number }[]>([]);

  const handleNewSale = () => {
    setIsNewSaleModalOpen(true);
  };

  const handleCompleteSale = () => {
    const newSale: Sale = {
      id: String(sales.length + 1),
      products: selectedProducts.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity
      })),
      total: calculateTotal(),
      paymentMethod: 'efectivo',
      status: 'completada',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSales([...sales, newSale]);
    setSelectedProducts([]);
    setIsNewSaleModalOpen(false);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Ventas</h1>
        <Button onClick={handleNewSale}>Registrar Nueva Venta</Button>
      </div>

      {/* Sales Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Método de Pago
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        #{sale.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${sale.total.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            sale.status === 'completada'
                              ? 'bg-green-100 text-green-800'
                              : sale.status === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-primary-600 hover:text-primary-900">
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Sale Modal */}
      {isNewSaleModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Nueva Venta</h2>
            
            {/* Product Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                  <option>Seleccionar un producto</option>
                  {/* Add product options here */}
                </select>
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <Button>Agregar</Button>
              </div>

              {/* Selected Products */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Productos Seleccionados</h3>
                <div className="mt-2">
                  {selectedProducts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsNewSaleModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCompleteSale}>Completar Venta</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales; 