import React, { useState } from 'react';
import Button from '../components/UI/Button';
import { Product } from '../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Cerveza',
      description: 'Cerveza artesanal local',
      stock: 100,
      unit: 'botellas',
      supplier: 'Cervecería Local',
      price: 5.99,
      minStock: 20,
      category: 'Bebidas',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more sample products here
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(products.map(p => p.id === selectedProduct.id ? selectedProduct : p));
    } else {
      const newProduct: Product = {
        id: String(products.length + 1),
        name: 'Nuevo Producto',
        description: '',
        stock: 0,
        unit: 'unidades',
        supplier: '',
        price: 0,
        minStock: 0,
        category: 'Sin categoría',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProducts([...products, newProduct]);
    }
    setIsAddModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
        <Button onClick={handleAddProduct}>Agregar Producto</Button>
      </div>

      {/* Products Table */}
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
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Categoría
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
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.stock} {product.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            product.stock <= product.minStock
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {product.stock <= product.minStock ? 'Stock Bajo' : 'En Stock'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Editar
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

      {/* Add/Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            {/* Add form fields here */}
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedProduct(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveProduct}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory; 