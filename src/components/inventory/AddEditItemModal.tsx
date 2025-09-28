import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { InventoryItemData } from "./InventoryItem";
import { Upload, X } from "lucide-react";

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItemData, 'id'>) => void;
  item?: InventoryItemData;
  defaultCategory?: string;
}

export const AddEditItemModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  item, 
  defaultCategory 
}: AddEditItemModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    unit: '',
    category: 'herramientas' as 'herramientas' | 'pinturas' | 'materiales',
    image: '',
    minStock: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        image: item.image || '',
        minStock: item.minStock || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        quantity: 0,
        unit: '',
        category: (defaultCategory as any) || 'herramientas',
        image: '',
        minStock: 0
      });
    }
    setImageFile(null);
  }, [item, defaultCategory, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Archivo muy grande",
          description: "La imagen debe ser menor a 5MB.",
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.unit) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios.",
      });
      return;
    }

    if (formData.quantity < 0) {
      toast({
        variant: "destructive",
        title: "Cantidad inválida",
        description: "La cantidad no puede ser negativa.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSave(formData);
      toast({
        title: item ? "Elemento actualizado" : "Elemento creado",
        description: `${formData.name} ha sido ${item ? 'actualizado' : 'agregado'} correctamente.`,
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al guardar el elemento.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Editar Elemento' : 'Agregar Nuevo Elemento'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Imagen</Label>
            <div className="flex items-center space-x-3">
              {formData.image ? (
                <div className="relative">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Martillo Stanley"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción detallada del elemento"
              rows={3}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="herramientas">Herramientas</SelectItem>
                <SelectItem value="pinturas">Pinturas</SelectItem>
                <SelectItem value="materiales">Materiales de Construcción</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="Ej: unidades, litros"
                required
              />
            </div>
          </div>

          {/* Minimum Stock */}
          <div className="space-y-2">
            <Label htmlFor="minStock">Stock Mínimo</Label>
            <Input
              id="minStock"
              type="number"
              min="0"
              value={formData.minStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
              placeholder="Alerta cuando llegue a esta cantidad"
            />
          </div>
        </form>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-primary hover:bg-primary-hover"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </div>
            ) : (
              item ? 'Actualizar' : 'Crear'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};