import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryHistory } from "@/components/inventory/InventoryHistory";
import { CategorySection } from "@/components/inventory/CategorySection";
import { AddEditItemModal } from "@/components/inventory/AddEditItemModal";
import { InventoryItemData } from "@/components/inventory/InventoryItem";
import { Package, Wrench, Palette, Hammer } from "lucide-react";

// Mock data - In real app, this would come from PocketBase
const mockItems: InventoryItemData[] = [
  {
    id: '1',
    name: 'Martillo Stanley',
    description: 'Martillo de carpintero con mango de madera, peso 16 oz',
    quantity: 8,
    unit: 'unidades',
    category: 'herramientas',
    minStock: 3
  },
  {
    id: '2',
    name: 'Pintura Blanca Interior',
    description: 'Pintura látex para interiores, acabado mate, alta cobertura',
    quantity: 12,
    unit: 'galones',
    category: 'pinturas',
    minStock: 5
  },
  {
    id: '3',
    name: 'Cemento Portland',
    description: 'Cemento gris tipo I, ideal para construcción general',
    quantity: 25,
    unit: 'bultos',
    category: 'materiales',
    minStock: 10
  },
  {
    id: '4',
    name: 'Taladro Eléctrico',
    description: 'Taladro percutor 800W con set de brocas incluidas',
    quantity: 3,
    unit: 'unidades',
    category: 'herramientas',
    minStock: 2
  },
  {
    id: '5',
    name: 'Pintura Azul Exterior',
    description: 'Esmalte para exteriores resistente a la intemperie',
    quantity: 7,
    unit: 'galones',
    category: 'pinturas',
    minStock: 3
  },
];

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItemData[]>(mockItems);
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

  const handleSaveItem = (itemData: Omit<InventoryItemData, 'id'>) => {
    if (editingItem) {
      // Update existing item
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...itemData, id: editingItem.id }
          : item
      ));
    } else {
      // Add new item
      const newItem: InventoryItemData = {
        ...itemData,
        id: Date.now().toString()
      };
      setItems(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const getItemsByCategory = (category: 'herramientas' | 'pinturas' | 'materiales') => {
    return items.filter(item => item.category === category);
  };

  const getTotalItems = () => items.length;
  const getTotalQuantity = () => items.reduce((sum, item) => sum + item.quantity, 0);
  const getLowStockItems = () => items.filter(item => 
    item.minStock && item.quantity <= item.minStock
  ).length;

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