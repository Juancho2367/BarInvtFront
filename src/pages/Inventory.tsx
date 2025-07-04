import React, { useState, useEffect } from 'react';
import Button from '../components/UI/Button';
import { Product } from '../types';
import api from '../services/api';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (selectedProduct) {
        // Update existing product
        await api.put(`/products/${selectedProduct.id}`, selectedProduct);
      } else {
        // Create new product
        await api.post('/products', {
          name: 'Nuevo Producto',
          description: '',
          stock: 0,
          unit: 'unidades',
          supplier: '',
          price: 0,
          minStock: 0,
          category: 'Sin categoría',
        });
      }
      
      // Refresh products list
      await fetchProducts();
      setIsAddModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await api.delete(`/products/${productId}`);
        await fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Error al eliminar el producto');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
          <Button onClick={handleAddProduct}>Agregar Producto</Button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <Button onClick={fetchProducts} variant="secondary">
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No hay productos disponibles
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
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
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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