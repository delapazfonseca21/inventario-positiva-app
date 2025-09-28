import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryItem, InventoryItemData } from "./InventoryItem";
import { Plus, Wrench, Palette, Hammer } from "lucide-react";

interface CategorySectionProps {
  category: 'herramientas' | 'pinturas' | 'materiales';
  items: InventoryItemData[];
  onAddItem: (category: string) => void;
  onEditItem: (item: InventoryItemData) => void;
}

export const CategorySection = ({ 
  category, 
  items, 
  onAddItem, 
  onEditItem 
}: CategorySectionProps) => {
  const getCategoryInfo = () => {
    switch (category) {
      case 'herramientas':
        return {
          title: 'Herramientas',
          icon: Wrench,
          color: 'tools',
          bgColor: 'bg-tools/10',
          borderColor: 'border-tools/20'
        };
      case 'pinturas':
        return {
          title: 'Pinturas',
          icon: Palette,
          color: 'paints',
          bgColor: 'bg-paints/10',
          borderColor: 'border-paints/20'
        };
      case 'materiales':
        return {
          title: 'Materiales de Construcción',
          icon: Hammer,
          color: 'materials',
          bgColor: 'bg-materials/10',
          borderColor: 'border-materials/20'
        };
    }
  };

  const categoryInfo = getCategoryInfo();
  const Icon = categoryInfo.icon;

  return (
    <Card className={`${categoryInfo.bgColor} ${categoryInfo.borderColor} shadow-card`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 text-${categoryInfo.color}`} />
            <span>{categoryInfo.title}</span>
            <span className="text-sm text-muted-foreground">({items.length})</span>
          </CardTitle>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onAddItem(category)}
            className={`border-${categoryInfo.color}/30 text-${categoryInfo.color} hover:bg-${categoryInfo.color}/10`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay elementos en esta categoría</p>
            <Button 
              variant="ghost" 
              className="mt-2"
              onClick={() => onAddItem(category)}
            >
              Agregar el primero
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <InventoryItem
                key={item.id}
                item={item}
                onEdit={onEditItem}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};