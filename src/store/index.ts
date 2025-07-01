import { create } from 'zustand';
import { Product, Sale, Client, Event } from '../types';

interface StoreState {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Sales
  sales: Sale[];
  addSale: (sale: Sale) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;

  // Clients
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Events
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Products
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  // Sales
  sales: [],
  addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),
  updateSale: (id, sale) =>
    set((state) => ({
      sales: state.sales.map((s) => (s.id === id ? { ...s, ...sale } : s)),
    })),
  deleteSale: (id) =>
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id),
    })),

  // Clients
  clients: [],
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...client } : c)),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),

  // Events
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, event) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
})); 