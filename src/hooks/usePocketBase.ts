import { useState, useEffect } from 'react';
import { pb, Inventario, StockHistory } from '@/lib/pocketbase';
import { useToast } from '@/hooks/use-toast';

export const useInventario = () => {
  const [items, setItems] = useState<Inventario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const records = await pb.collection('inventario').getFullList<Inventario>({
        sort: '-created',
        expand: 'categoria',
        filter: 'deleted = false || deleted = null',
      });
      setItems(records);
    } catch (error) {
      console.error('Error fetching inventario:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (data: Omit<Inventario, 'id' | 'created' | 'updated'>, userId?: string) => {
    try {
      const record = await pb.collection('inventario').create<Inventario>({
        ...data,
        deleted: false,
      });
      setItems(prev => [...prev, record]);
      
      // Registrar en el historial si hay cantidad inicial y usuario
      if (userId && data.quantity > 0) {
        try {
          // Asegurar que los tipos sean correctos
          const historyData = {
            user: String(userId),
            item: String(record.id),
            action: 'entrada',
            quantityChange: Number(data.quantity),
            unit: String(data.unit),
          };
          console.log('Attempting to create history with data:', historyData);
          console.log('Data types:', {
            user: typeof historyData.user,
            item: typeof historyData.item,
            action: typeof historyData.action,
            quantityChange: typeof historyData.quantityChange,
            unit: typeof historyData.unit,
          });
          
          const historyRecord = await pb.collection('stock_history').create(historyData);
          console.log('History record created successfully:', historyRecord);
        } catch (historyError: unknown) {
          console.error('Error creating history entry:', historyError);
          if (historyError && typeof historyError === 'object' && 'data' in historyError) {
            console.error('Error details:', (historyError as { data: unknown }).data);
          }
          console.error('History data attempted:', { userId, itemId: record.id, quantity: data.quantity, unit: data.unit });
          // No lanzar error para no interrumpir la creación del item
        }
      }
      
      toast({
        title: "Éxito",
        description: "Item creado correctamente",
      });
      return record;
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (id: string, data: Partial<Inventario>, userId?: string) => {
    try {
      // Obtener el item actual antes de actualizar
      const currentItem = items.find(item => item.id === id);
      const record = await pb.collection('inventario').update<Inventario>(id, data);
      setItems(prev => prev.map(item => item.id === id ? record : item));
      
      // Registrar en el historial si cambió la cantidad
      if (userId && currentItem && data.quantity !== undefined && data.quantity !== currentItem.quantity) {
        const difference = data.quantity - currentItem.quantity;
        
        // Validar que la diferencia no sea 0
        if (difference === 0) {
          console.log('Skipping history entry: quantity change is 0');
          return record;
        }
        
        const action: 'entrada' | 'salida' = difference > 0 ? 'entrada' : 'salida';
        const quantityChange = Math.abs(difference);
        
        try {
          // Asegurar que los tipos sean correctos
          const historyData = {
            user: String(userId),
            item: String(id),
            action: String(action),
            quantityChange: Number(quantityChange),
            unit: String(data.unit || currentItem.unit),
          };
          console.log('Attempting to create history with data:', historyData);
          console.log('Data types:', {
            user: typeof historyData.user,
            item: typeof historyData.item,
            action: typeof historyData.action,
            quantityChange: typeof historyData.quantityChange,
            unit: typeof historyData.unit,
          });
          console.log('Current auth state:', pb.authStore.isValid, pb.authStore.model);
          
          const historyRecord = await pb.collection('stock_history').create(historyData);
          console.log('History record created successfully:', historyRecord);
        } catch (historyError: unknown) {
          console.error('Error creating history entry:', historyError);
          if (historyError && typeof historyError === 'object' && 'data' in historyError) {
            console.error('Error details:', (historyError as { data: unknown }).data);
          }
          console.error('History data attempted:', { userId, itemId: id, action, quantityChange, unit: data.unit || currentItem.unit });
          // No lanzar error para no interrumpir la actualización del item
        }
      }
      
      toast({
        title: "Éxito",
        description: "Item actualizado correctamente",
      });
      return record;
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (id: string, userId?: string) => {
    try {
      // Obtener el item antes de marcarlo como eliminado
      const currentItem = items.find(item => item.id === id);
      
      // Marcar el item como eliminado (soft delete)
      const record = await pb.collection('inventario').update<Inventario>(id, {
        deleted: true,
      });
      
      // Registrar la eliminación en el historial si hay usuario
      if (userId && currentItem) {
        try {
          const historyData = {
            user: String(userId),
            item: String(id),
            action: 'eliminacion',
            quantityChange: Number(currentItem.quantity),
            unit: String(currentItem.unit),
          };
          
          console.log('Intentando crear registro de eliminación:', historyData);
          const historyRecord = await pb.collection('stock_history').create(historyData);
          console.log('Eliminación registrada en historial:', historyRecord);
        } catch (historyError) {
          console.error('Error creating history entry for deletion:', historyError);
          if (historyError && typeof historyError === 'object' && 'data' in historyError) {
            console.error('Error details:', (historyError as { data: unknown }).data);
          }
          // No lanzar error para no interrumpir la eliminación
        }
      } else {
        console.warn('No se registró en historial - userId:', userId, 'currentItem:', currentItem);
      }
      
      // Remover del estado local
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Éxito",
        description: "Item eliminado correctamente",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el item",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    isLoading,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};

export const useStockHistory = () => {
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const records = await pb.collection('stock_history').getFullList<StockHistory>({
        expand: 'item,user'
      });

      const sortedRecords = records.sort((a, b) => {
        // Ordenar por timestamp (más reciente primero)
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
        
      setHistory(sortedRecords); 
      
    } catch (error) {
      console.error('Error fetching stock history:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el historial",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createHistoryEntry = async (data: Omit<StockHistory, 'id' | 'created' | 'updated'>) => {
    try {
      const record = await pb.collection('stock_history').create<StockHistory>(data);
      setHistory(prev => [record, ...prev]);
      return record;
    } catch (error) {
      console.error('Error creating history entry:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el movimiento",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchHistory();
    
    // Suscribirse a cambios en tiempo real
    pb.collection('stock_history').subscribe('*', (e) => {
      if (e.action === 'create') {
        // Recargar el historial cuando se cree una nueva entrada
        fetchHistory();
      }
    });
    
    // Cleanup: desuscribirse al desmontar
    return () => {
      pb.collection('stock_history').unsubscribe('*');
    };
  }, []);

  return {
    history,
    isLoading,
    fetchHistory,
    createHistoryEntry,
  };
};
