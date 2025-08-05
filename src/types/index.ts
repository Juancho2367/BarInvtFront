export interface Product {
  id: string;
  name: string;
  description?: string;
  stock: number;
  unit: string;
  price: number;
  minStock: number;
  category: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  products: SaleProduct[];
  total: number;
  paymentMethod: 'efectivo' | 'credito' | 'tarjeta';
  status: 'pendiente' | 'completada' | 'cancelada';
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleProduct {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  creditLimit: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'deportes' | 'musica' | 'otros';
  expectedAttendance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'entrada' | 'salida';
  reason: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingPayments: number;
  topSellingProducts: Product[];
  recentSales: Sale[];
} 