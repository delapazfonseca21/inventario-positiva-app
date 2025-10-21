import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryHistory } from "@/components/inventory/InventoryHistory";
import { CategorySection } from "@/components/inventory/CategorySection";
import { AddEditItemModal } from "@/components/inventory/AddEditItemModal";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";
import { InventoryItemData } from "@/components/inventory/InventoryItem";
import { Package, Wrench, Palette, Hammer } from "lucide-react";
import { useInventario } from "@/hooks/usePocketBase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const CATEGORY_MAP = {
  '0tunjeqdefikify': 'herramientas',
  '499sjxbj3vug46v': 'pinturas',
  '1a9ao533l6oqz8i': 'materiales',
};

const NAME_TO_ID_MAP = {
  'herramientas': '0tunjeqdefikify',
  'pinturas': '499sjxbj3vug46v',
  'materiales': '1a9ao533l6oqz8i',
} as const;

type CategoryMapKeys = keyof typeof CATEGORY_MAP;
type CategoryMapValues = typeof CATEGORY_MAP[CategoryMapKeys];

export default function Dashboard() {
  const { items, isLoading, createItem, updateItem, deleteItem } = useInventario();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemData | undefined>();
  const [defaultCategory, setDefaultCategory] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItemData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddItem = (category: string) => {
    // Convertir el ID de categoría al nombre
    const categoryName = CATEGORY_MAP[category as CategoryMapKeys];
    setDefaultCategory(categoryName || 'herramientas');
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
      const categoryId = NAME_TO_ID_MAP[itemData.category as keyof typeof NAME_TO_ID_MAP];

      if (!categoryId) {
        toast({
          variant: "destructive",
          title: "Error de categoría",
          description: "La categoría seleccionada no es válida. Por favor intente nuevamente.",
        });
        return;
      }

      const dataToSend = {
        name: itemData.name,
        description: itemData.description,
        quantity: itemData.quantity,
        unit: itemData.unit,
        categoria: categoryId, // Usar el ID traducido
        minStock: itemData.minStock,
        imagen: itemData.image,
      };

      if (editingItem) {
        // Actualizar item existente
        await updateItem(editingItem.id, dataToSend, user?.id);
      } else {
        // Crear nuevo item
        await createItem(dataToSend, user?.id);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDeleteItem = (item: InventoryItemData) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteItem(itemToDelete.id, user?.id);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Mapear datos de PocketBase al formato del componente
  const mappedItems: InventoryItemData[] = items.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    quantity: item.quantity,
    unit: item.unit,
    category: CATEGORY_MAP[item.categoria as CategoryMapKeys],
    minStock: item.minStock,
    image: item.imagen,
  })) as InventoryItemData[];

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
              category={NAME_TO_ID_MAP.herramientas}
              items={getItemsByCategory('herramientas')}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
            
            <CategorySection
              category={NAME_TO_ID_MAP.pinturas}
              items={getItemsByCategory('pinturas')}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
            
            <CategorySection
              category={NAME_TO_ID_MAP.materiales}
              items={getItemsByCategory('materiales')}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}