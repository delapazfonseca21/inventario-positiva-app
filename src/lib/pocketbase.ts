import PocketBase from 'pocketbase';

// Inicializar PocketBase con tu URL local
// Por defecto PocketBase corre en http://127.0.0.1:8090
export const pb = new PocketBase('http://127.0.0.1:8090');

pb.autoCancellation(false);

export interface Empleado {
  id: string;
  email: string;
  name: string;
  created: string;
  updated: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  icono?: string;
  color?: string;
  created: string;
  updated: string;
}

export interface Inventario {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  categoria: string; // ID de la categoría
  minStock?: number;
  imagen?: string;
  created: string;
  updated: string;
}

export interface StockHistory {
  id: string;
  empleado: string; // ID del empleado
  accion: 'entrada' | 'salida';
  inventario: string; // ID del item de inventario
  cantidad: number;
  unidad: string;
  created: string;
  updated: string;
}
