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
      });
      //ojito acá
      console.log(records)
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

  const createItem = async (data: Omit<Inventario, 'id' | 'created' | 'updated'>) => {
    try {
      const record = await pb.collection('inventario').create<Inventario>(data);
      setItems(prev => [...prev, record]);
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

  const updateItem = async (id: string, data: Partial<Inventario>) => {
    try {
      const record = await pb.collection('inventario').update<Inventario>(id, data);
      setItems(prev => prev.map(item => item.id === id ? record : item));
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

  const deleteItem = async (id: string) => {
    try {
      await pb.collection('inventario').delete(id);
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
        // Usamos item.timestamp, que es el campo de fecha de PocketBase.
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        // Restar B - A ordena del más reciente al más antiguo (descendente)
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
  }, []);

  return {
    history,
    isLoading,
    fetchHistory,
    createHistoryEntry,
  };
};
