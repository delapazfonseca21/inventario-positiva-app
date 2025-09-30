import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryHistory } from "@/components/inventory/InventoryHistory";
import { CategorySection } from "@/components/inventory/CategorySection";
import { AddEditItemModal } from "@/components/inventory/AddEditItemModal";
import { InventoryItemData } from "@/components/inventory/InventoryItem";
import { Package, Wrench, Palette, Hammer } from "lucide-react";
import { useInventario } from "@/hooks/usePocketBase";

export default function Dashboard() {
  const { items, isLoading, createItem, updateItem } = useInventario();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemData | undefined>();
  const [defaultCategory, setDefaultCategory] = useState<string>('');

  const handleAddItem = (category: string) => {
    setDefaultCategory(category);
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItemData) => {
    setEditingItem(item);
    setDefaultCategory('');
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData: Omit<InventoryItemData, 'id'>) => {
    try {
      if (editingItem) {
        // Actualizar item existente
        await updateItem(editingItem.id, {
          nombre: itemData.name,
          descripcion: itemData.description,
          cantidad: itemData.quantity,
          unidad: itemData.unit,
          categoria: itemData.category,
          minStock: itemData.minStock,
          imagen: itemData.image,
        });
      } else {
        // Crear nuevo item
        await createItem({
          nombre: itemData.name,
          descripcion: itemData.description,
          cantidad: itemData.quantity,
          unidad: itemData.unit,
          categoria: itemData.category,
          minStock: itemData.minStock,
          imagen: itemData.image,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Mapear datos de PocketBase al formato del componente
  const mappedItems: InventoryItemData[] = items.map(item => ({
    id: item.id,
    name: item.nombre,
    description: item.descripcion || '',
    quantity: item.cantidad,
    unit: item.unidad,
    category: item.categoria as 'herramientas' | 'pinturas' | 'materiales',
    minStock: item.minStock,
    image: item.imagen,
  }));

  const getItemsByCategory = (category: 'herramientas' | 'pinturas' | 'materiales') => {
    return mappedItems.filter(item => item.category === category);
  };

  const getTotalItems = () => mappedItems.length;
  const getTotalQuantity = () => mappedItems.reduce((sum, item) => sum + item.quantity, 0);
  const getLowStockItems = () => mappedItems.filter(item => 
    item.minStock && item.quantity <= item.minStock
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Elementos"
            value={getTotalItems()}
            description="elementos en inventario"
            icon={Package}
            variant="default"
          />
          
          <StatsCard
            title="Herramientas"
            value={getItemsByCategory('herramientas').length}
            description="herramientas disponibles"
            icon={Wrench}
            variant="tools"
          />
          
          <StatsCard
            title="Pinturas"
            value={getItemsByCategory('pinturas').length}
            description="tipos de pintura"
            icon={Palette}
            variant="paints"
          />
          
          <StatsCard
            title="Materiales"
            value={getItemsByCategory('materiales').length}
            description="materiales de construcción"
            icon={Hammer}
            variant="materials"
          />
        </div>

        {/* History Section */}
        <InventoryHistory />

        {/* Inventory Sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Bodega Digital
            </h2>
            {getLowStockItems() > 0 && (
              <div className="text-sm text-warning">
                ⚠️ {getLowStockItems()} elementos con stock bajo
              </div>
            )}
          </div>

          <div className="space-y-6">
            <CategorySection
              category="herramientas"
              items={getItemsByCategory('herramientas')}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
            />
            
            <CategorySection
              category="pinturas"
              items={getItemsByCategory('pinturas')}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
            />
            
            <CategorySection
              category="materiales"
              items={getItemsByCategory('materiales')}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
            />
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AddEditItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
        defaultCategory={defaultCategory}
      />
    </div>
  );
}