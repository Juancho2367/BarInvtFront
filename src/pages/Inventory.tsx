import React, { useState, useEffect } from 'react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import BarcodeScanner from '../components/UI/BarcodeScanner';
import Modal from '../components/UI/Modal';
import { Product } from '../types';
import api from '../services/api';
import { notify } from '../utils/notificationUtils';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: 0,
    unit: 'unidades',
    price: 0,
    minStock: 0,
    category: 'Sin categoría',
    barcode: '',
  });

  // Categorías predeterminadas
  const categories = [
    { value: 'todas', label: 'Todas las categorías' },
    { value: 'cerveza', label: 'Cerveza' },
    { value: 'aguardiente', label: 'Aguardiente' },
    { value: 'gaseosa', label: 'Gaseosa' },
  ];

  // Verificar y mostrar alertas de stock bajo
  const checkLowStockAlerts = (products: Product[], showSuccessMessage = false) => {
    const lowStockProducts = products.filter(product => product.stock <= product.minStock);
    
    if (lowStockProducts.length > 0) {
      lowStockProducts.forEach(product => {
        notify.warning(
          `🚨 Stock bajo: ${product.name} tiene solo ${product.stock} ${product.unit} (mínimo: ${product.minStock})`,
          8000 // 8 segundos para alertas importantes
        );
      });
    } else if (showSuccessMessage) {
      notify.success(`✅ Perfecto! Todos los productos tienen stock suficiente`, 4000);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/products');
      setProducts(response.data);
      
      // Verificar alertas de stock bajo después de cargar productos
      checkLowStockAlerts(response.data);
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
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      stock: 0,
      unit: 'unidades',
      price: 0,
      minStock: 0,
      category: 'Sin categoría',
      barcode: '',
    });
    setIsAddModalOpen(true);
  };

  // Handle barcode scan for adding products
  const handleBarcodeAddProduct = () => {
    setIsScanModalOpen(true);
    setIsScanning(true);
  };

  // Handle successful barcode scan
  const handleScanSuccess = async (decodedText: string) => {
    setIsScanning(false);
    setIsScanModalOpen(false);
    
    try {
      // First, try to find existing product with this barcode
      const response = await api.get(`/products/by-barcode/${decodedText}`);
      const existingProduct = response.data;
      
      // If product exists, we'll update its stock and price, not create a new product
      setSelectedProduct(existingProduct); // We're editing the existing product
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description || '',
        stock: existingProduct.stock, // Show current stock but allow modification
        unit: existingProduct.unit,
        price: existingProduct.price, // Show current price but allow modification
        minStock: existingProduct.minStock,
        category: existingProduct.category,
        barcode: decodedText,
      });
      setIsAddModalOpen(true);
      
      notify.success(`✅ Producto encontrado: ${existingProduct.name}. Actualiza stock y precio según necesites.`);
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Product not found, redirect to configuration page
        notify.warning(`⚠️ Producto no encontrado con código ${decodedText}. Ve a la página de configuración para crear este producto primero.`);
        notify.info(`💡 Tip: Ve a /configuracionbarras para crear productos con códigos de barras`);
      } else {
        notify.error('❌ Error al buscar el producto');
        console.error('Error scanning barcode:', error);
      }
    }
  };

  // Handle scan failure
  const handleScanFailure = (error: string) => {
    console.warn('Scan error:', error);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      stock: product.stock,
      unit: product.unit,
      price: product.price,
      minStock: product.minStock,
      category: product.category,
      barcode: product.barcode || '',
    });
    setIsAddModalOpen(true);
  };

  // Función auxiliar para limpiar y validar datos
  const prepareDataForSend = () => {
    const data = {
      name: String(formData.name || '').trim(),
      description: formData.description ? String(formData.description).trim() : undefined,
      stock: parseInt(String(formData.stock || '0'), 10) || 0,
      unit: String(formData.unit || '').trim(),
      price: parseFloat(String(formData.price || '0')) || 0,
      minStock: parseInt(String(formData.minStock || '0'), 10) || 0,
      category: String(formData.category || 'Sin categoría'),
      barcode: formData.barcode ? String(formData.barcode).trim() : undefined
    };

    // Remover campos undefined para evitar problemas
    if (data.description === '') {
      data.description = undefined;
    }
    if (!data.barcode) {
      data.barcode = undefined;
    }

    return data;
  };

  const handleSaveProduct = async () => {
    try {
      const dataToSend = prepareDataForSend();

      // Validar que los números son válidos
      if (isNaN(dataToSend.stock) || dataToSend.stock < 0) {
        notify.error('❌ Stock debe ser un número válido mayor o igual a 0');
        return;
      }
      if (isNaN(dataToSend.price) || dataToSend.price < 0) {
        notify.error('❌ Precio debe ser un número válido mayor o igual a 0');
        return;
      }
      if (isNaN(dataToSend.minStock) || dataToSend.minStock < 0) {
        notify.error('❌ Stock mínimo debe ser un número válido mayor o igual a 0');
        return;
      }

      // Validar campos requeridos
      if (!dataToSend.name) {
        notify.error('❌ El nombre del producto es obligatorio');
        return;
      }
      if (!dataToSend.unit) {
        notify.error('❌ La unidad del producto es obligatoria');
        return;
      }

      // Log para debug
      console.log('Datos a enviar:', dataToSend);

      if (selectedProduct) {
        // Update existing product
        await api.put(`/products/${selectedProduct.id}`, dataToSend);
        
        // Verificar si el stock actualizado está bajo
        if (formData.stock <= formData.minStock) {
          notify.warning(
            `🚨 Atención: ${formData.name} quedó con stock bajo (${formData.stock} ${formData.unit})`,
            6000
          );
        } else {
          notify.success(`✅ Producto ${formData.name} actualizado correctamente`);
        }
      } else {
        // Create new product
        await api.post('/products', dataToSend);
        
        // Verificar si el nuevo producto tiene stock bajo
        if (formData.stock <= formData.minStock) {
          notify.warning(
            `🚨 Nuevo producto con stock bajo: ${formData.name} (${formData.stock} ${formData.unit})`,
            6000
          );
        } else {
          notify.success(`✅ Producto ${formData.name} creado correctamente`);
        }
      }
      
      // Refresh products list
      await fetchProducts();
      setIsAddModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      console.error('Error saving product:', err);
      
      // Manejo específico de errores
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || 'Error de validación en los datos';
        notify.error(`❌ ${errorMessage}`);
        setError(errorMessage);
      } else if (err.response?.status === 404) {
        notify.error('❌ Producto no encontrado');
        setError('Producto no encontrado');
      } else if (err.response?.status === 409) {
        notify.error('❌ Ya existe un producto con esos datos');
        setError('Conflicto: producto duplicado');
      } else {
        const genericError = 'Error al guardar el producto. Intenta nuevamente.';
        notify.error(`❌ ${genericError}`);
        setError(genericError);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    const productName = product?.name || 'producto';
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${productName}?`)) {
      try {
        await api.delete(`/products/${productId}`);
        await fetchProducts();
        notify.success(`✅ ${productName} eliminado correctamente`);
      } catch (err) {
        console.error('Error deleting product:', err);
        notify.error(`❌ Error al eliminar ${productName}`);
        setError('Error al eliminar el producto');
      }
    }
  };

  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filtrar productos por categoría
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'todas') {
      return true;
    }
    return product.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Check if current product was loaded via barcode scan
  const isScannedProduct = selectedProduct && formData.barcode && selectedProduct.barcode === formData.barcode;

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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header - Responsive */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
              Filtrar por:
            </label>
            <Select
              id="category-filter"
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="w-full sm:w-48"
              options={categories}
            />
          </div>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button
              onClick={() => checkLowStockAlerts(products, true)}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <span className="sm:hidden">🚨 Alertas</span>
              <span className="hidden sm:inline">🚨 Verificar Stock Bajo</span>
            </Button>
            <Button
              onClick={handleBarcodeAddProduct}
              variant="secondary"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span className="sm:hidden">📷 Barras</span>
              <span className="hidden sm:inline">📷 Escanear Código</span>
            </Button>
            <Button onClick={handleAddProduct} className="w-full sm:w-auto">
              <span className="sm:hidden">+ Producto</span>
              <span className="hidden sm:inline">Agregar Producto</span>
            </Button>
          </div>
        </div>
      </div>

            {/* Products Display - Table on desktop, Cards on mobile */}
      <div className="mt-4 sm:mt-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {products.length === 0 ? 'No hay productos disponibles' : 'No hay productos en esta categoría'}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Nombre
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Stock
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Precio (COP)
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Categoría
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Estado
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product.stock} {product.unit}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${product.price.toLocaleString('es-CO')} COP
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        product.stock <= product.minStock
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.stock <= product.minStock ? 'Stock Bajo' : 'En Stock'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="text-sm font-medium">{product.stock} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Precio</p>
                      <p className="text-sm font-medium">${product.price.toLocaleString('es-CO')} COP</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Categoría</p>
                    <p className="text-sm font-medium">{product.category}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-blue-600 text-white text-sm py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Product Modal - Responsive */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {isScannedProduct ? '📷 Producto Escaneado - Actualizar Stock y Precio' : 
                 selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>

              {isScannedProduct && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>✅ Producto encontrado por código de barras:</strong> {formData.barcode}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Los campos pre-configurados están bloqueados. Solo actualiza stock y precio.
                  </p>
                </div>
              )}
              
              <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Nombre del producto"
                  disabled={!!isScannedProduct}
                  className={isScannedProduct ? 'bg-gray-100 cursor-not-allowed' : ''}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Descripción del producto"
                  disabled={!!isScannedProduct}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isScannedProduct ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isScannedProduct ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Stock * {isScannedProduct && '📝'}
                  </label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleFormChange('stock', parseInt(e.target.value) || 0)}
                    min="0"
                    className={isScannedProduct ? 'border-green-300 focus:ring-green-500 focus:border-green-500' : ''}
                    required
                  />
                  {isScannedProduct && (
                    <p className="text-xs text-green-600 mt-1">✅ Campo editable</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad *
                  </label>
                  <Input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleFormChange('unit', e.target.value)}
                    placeholder="unidades"
                    disabled={!!isScannedProduct}
                    className={isScannedProduct ? 'bg-gray-100 cursor-not-allowed' : ''}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isScannedProduct ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Precio (COP) * {isScannedProduct && '📝'}
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100"
                    placeholder="0"
                    className={isScannedProduct ? 'border-green-300 focus:ring-green-500 focus:border-green-500' : ''}
                    required
                  />
                  {isScannedProduct && (
                    <p className="text-xs text-green-600 mt-1">✅ Campo editable</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo *
                  </label>
                  <Input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => handleFormChange('minStock', parseInt(e.target.value) || 0)}
                    min="0"
                    disabled={!!isScannedProduct}
                    className={isScannedProduct ? 'bg-gray-100 cursor-not-allowed' : ''}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(value) => handleFormChange('category', value)}
                    disabled={!!isScannedProduct}
                    className={isScannedProduct ? 'bg-gray-100 cursor-not-allowed' : ''}
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
                    Código de Barras
                  </label>
                  <Input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => handleFormChange('barcode', e.target.value)}
                    placeholder="Código de barras (opcional)"
                    disabled={!!isScannedProduct}
                    className={formData.barcode && isScannedProduct ? 'bg-blue-50 border-blue-300' : 
                               formData.barcode ? 'bg-green-50 border-green-300' : 
                               isScannedProduct ? 'bg-gray-100 cursor-not-allowed' : ''}
                  />
                  {formData.barcode && (
                    <p className="mt-1 text-xs text-green-600">
                      ✅ Código de barras: {formData.barcode}
                    </p>
                  )}
                </div>
              </div>
                          </form>

              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveProduct} className="w-full sm:w-auto order-1 sm:order-2">
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {isScanModalOpen && (
        <Modal
          isOpen={isScanModalOpen}
          onClose={() => {
            setIsScanModalOpen(false);
            setIsScanning(false);
          }}
          title="Escanear Código de Barras"
        >
          <div className="space-y-4">
            {isScanning ? (
              <>
                <BarcodeScanner
                  onScanSuccess={handleScanSuccess}
                  onScanFailure={handleScanFailure}
                />
                <div className="text-center">
                  <Button
                    onClick={() => {
                      setIsScanModalOpen(false);
                      setIsScanning(false);
                    }}
                    variant="secondary"
                  >
                    Cancelar Escaneo
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Preparando escáner...</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inventory; 