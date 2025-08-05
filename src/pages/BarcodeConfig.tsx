import React, { useState, useEffect } from 'react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import BarcodeScanner from '../components/UI/BarcodeScanner';
import { Product } from '../types';
import api from '../services/api';
import { notify } from '../utils/notificationUtils';

const BarcodeConfig: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scannedCode, setScannedCode] = useState('');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    description: '',
    category: 'Sin categoría',
    unit: 'unidades',
    minStock: 0
  });

  // Categorías predeterminadas (comentado porque no se usa en esta página)
  // const categories = [
  //   { value: 'todas', label: 'Todas las categorías' },
  //   { value: 'cerveza', label: 'Cerveza' },
  //   { value: 'aguardiente', label: 'Aguardiente' },
  //   { value: 'gaseosa', label: 'Gaseosa' },
  // ];

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      notify.error('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle barcode scan success
  const handleScanSuccess = async (decodedText: string) => {
    setScannedCode(decodedText);
    setIsScanning(false);
    
    // Verificar si el código ya existe
    try {
      const response = await api.get(`/products/by-barcode/${decodedText}`);
      notify.warning(`⚠️ Este código de barras ya está asignado al producto: ${response.data.name}`);
      return;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Código no existe, podemos usarlo
        notify.success(`✅ Código escaneado: ${decodedText}. Listo para asignar.`);
      } else {
        notify.error('❌ Error al verificar el código de barras');
        return;
      }
    }
  };

  // Handle barcode scan failure
  const handleScanFailure = (error: string) => {
    console.warn('Error de escaneo:', error);
  };

  // Assign barcode to selected product
  const handleAssignBarcode = async () => {
    if (!selectedProduct || !scannedCode) {
      notify.error('Selecciona un producto y escanea un código de barras');
      return;
    }

    try {
      await api.put(`/products/${selectedProduct.id}`, {
        ...selectedProduct,
        barcode: scannedCode
      });

      notify.success(`✅ Código de barras asignado a ${selectedProduct.name}`);
      
      // Refresh products list
      await fetchProducts();
      
      // Reset form
      setSelectedProduct(null);
      setScannedCode('');
    } catch (err: any) {
      console.error('Error assigning barcode:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('duplicate')) {
        notify.error('❌ Este código de barras ya está asignado a otro producto');
      } else {
        notify.error('❌ Error al asignar el código de barras');
      }
    }
  };

  // Create new product with barcode
  const handleCreateProductWithBarcode = async () => {
    if (!scannedCode || !newProductData.name.trim()) {
      notify.error('❌ Escanea un código de barras y completa el nombre del producto');
      return;
    }

    try {
      const productData = {
        ...newProductData,
        barcode: scannedCode,
        stock: 0, // Se iniciará con stock 0
        price: 0  // Se definirá al agregar al inventario
      };

      await api.post('/products', productData);
      notify.success(`✅ Producto "${newProductData.name}" creado con código de barras`);
      
      // Reset form and refresh
      setNewProductData({
        name: '',
        description: '',
        category: 'Sin categoría',
        unit: 'unidades',
        minStock: 0
      });
      setScannedCode('');
      setIsCreatingProduct(false);
      await fetchProducts();
      
    } catch (err: any) {
      console.error('Error creating product:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('duplicate')) {
        notify.error('❌ Este código de barras ya está en uso');
      } else {
        notify.error('❌ Error al crear el producto');
      }
    }
  };

  // Remove barcode from product
  const handleRemoveBarcode = async (product: Product) => {
    if (!product.barcode) return;

    try {
      await api.put(`/products/${product.id}`, {
        ...product,
        barcode: undefined
      });

      notify.success(`✅ Código de barras removido de ${product.name}`);
      await fetchProducts();
    } catch (err) {
      console.error('Error removing barcode:', err);
      notify.error('❌ Error al remover el código de barras');
    }
  };

  const productsWithoutBarcode = products.filter(p => !p.barcode);
  const productsWithBarcode = products.filter(p => p.barcode);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuración de Códigos de Barras
        </h1>
        <p className="text-gray-600">
          Asigna códigos de barras a tus productos para acelerar la gestión de inventario
        </p>
      </div>

      {/* Scanner Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Escanear y Asignar Código de Barras
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <div>
            {!isScanning ? (
              <div className="text-center">
                <Button
                  onClick={() => setIsScanning(true)}
                  className="mb-4"
                >
                  📷 Escanear Código de Barras
                </Button>
                {scannedCode && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm text-green-800">
                      <strong>Código escaneado:</strong> {scannedCode}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <BarcodeScanner
                  onScanSuccess={handleScanSuccess}
                  onScanFailure={handleScanFailure}
                />
                <div className="text-center mt-4">
                  <Button
                    onClick={() => setIsScanning(false)}
                    variant="secondary"
                  >
                    Cancelar Escaneo
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Product Options */}
          <div>
            <div className="space-y-4">
              {/* Toggle between modes */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setIsCreatingProduct(false)}
                  variant={!isCreatingProduct ? "primary" : "secondary"}
                  className="flex-1"
                >
                  📋 Asignar a Producto Existente
                </Button>
                <Button
                  onClick={() => setIsCreatingProduct(true)}
                  variant={isCreatingProduct ? "primary" : "secondary"}
                  className="flex-1"
                >
                  ✨ Crear Producto Nuevo
                </Button>
              </div>

              {!isCreatingProduct ? (
                /* Assign to existing product */
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Seleccionar Producto Existente
                  </h3>
                  
                  <div className="space-y-4">
                    <Select
                      value={selectedProduct?.id || ''}
                      onChange={(value) => {
                        const product = products.find(p => p.id === value);
                        setSelectedProduct(product || null);
                      }}
                      options={[
                        { value: '', label: 'Selecciona un producto...' },
                        ...productsWithoutBarcode.map(p => ({
                          value: p.id,
                          label: `${p.name} (${p.category})`
                        }))
                      ]}

                    />

                    {selectedProduct && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <h4 className="font-medium text-blue-900">{selectedProduct.name}</h4>
                        <p className="text-sm text-blue-700">{selectedProduct.description}</p>
                        <p className="text-sm text-blue-700">
                          Categoría: {selectedProduct.category}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleAssignBarcode}
                      disabled={!selectedProduct || !scannedCode}
                      className="w-full"
                    >
                      ✅ Asignar Código de Barras
                    </Button>
                  </div>
                </div>
              ) : (
                /* Create new product */
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Crear Producto Nuevo
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Producto *
                      </label>
                      <Input
                        type="text"
                        value={newProductData.name}
                        onChange={(e) => setNewProductData(prev => ({...prev, name: e.target.value}))}
                        placeholder="Nombre del producto"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <Input
                        type="text"
                        value={newProductData.description}
                        onChange={(e) => setNewProductData(prev => ({...prev, description: e.target.value}))}
                        placeholder="Descripción del producto (opcional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría
                        </label>
                        <Select
                          value={newProductData.category}
                          onChange={(value) => setNewProductData(prev => ({...prev, category: value}))}
                          options={[
                            { value: 'Sin categoría', label: 'Sin categoría' },
                            { value: 'cerveza', label: 'Cerveza' },
                            { value: 'aguardiente', label: 'Aguardiente' },
                            { value: 'gaseosa', label: 'Gaseosa' },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unidad
                        </label>
                        <Input
                          type="text"
                          value={newProductData.unit}
                          onChange={(e) => setNewProductData(prev => ({...prev, unit: e.target.value}))}
                          placeholder="unidades"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Mínimo
                      </label>
                      <Input
                        type="number"
                        value={newProductData.minStock}
                        onChange={(e) => setNewProductData(prev => ({...prev, minStock: parseInt(e.target.value) || 0}))}
                        min="0"
                      />
                    </div>

                    <Button
                      onClick={handleCreateProductWithBarcode}
                      disabled={!scannedCode || !newProductData.name.trim()}
                      className="w-full"
                    >
                      ✨ Crear Producto con Código de Barras
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products with Barcodes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Productos con Códigos de Barras ({productsWithBarcode.length})
        </h2>

        {productsWithBarcode.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay productos con códigos de barras asignados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código de Barras
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsWithBarcode.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {product.barcode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => handleRemoveBarcode(product)}
                        variant="secondary"
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Products without Barcodes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Productos sin Códigos de Barras ({productsWithoutBarcode.length})
        </h2>

        {productsWithoutBarcode.length === 0 ? (
          <div className="text-center py-8 text-green-600">
            ¡Excelente! Todos los productos tienen códigos de barras asignados
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productsWithoutBarcode.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                <p className="text-sm text-gray-500">Categoría: {product.category}</p>
                <div className="mt-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Sin código de barras
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeConfig;