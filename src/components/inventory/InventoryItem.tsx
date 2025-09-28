import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Package, AlertTriangle } from "lucide-react";

export interface InventoryItemData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  category: 'herramientas' | 'pinturas' | 'materiales';
  image?: string;
  minStock?: number;
}

interface InventoryItemProps {
  item: InventoryItemData;
  onEdit: (item: InventoryItemData) => void;
}

export const InventoryItem = ({ item, onEdit }: InventoryItemProps) => {
  const [imageError, setImageError] = useState(false);
  
  const getCategoryColor = () => {
    switch (item.category) {
      case 'herramientas':
        return 'tools';
      case 'pinturas':
        return 'paints';
      case 'materiales':
        return 'materials';
      default:
        return 'primary';
    }
  };

  const isLowStock = item.minStock && item.quantity <= item.minStock;

  return (
    <Card className="shadow-card hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Image */}
          <div className="w-20 h-20 flex-shrink-0 bg-muted flex items-center justify-center">
            {item.image && !imageError ? (
              <img 
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Package className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-sm leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                className="ml-2 p-1 h-auto"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge 
                  className={`bg-${getCategoryColor()}/10 text-${getCategoryColor()} border-${getCategoryColor()}/20`}
                >
                  {item.quantity} {item.unit}
                </Badge>
                
                {isLowStock && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Stock bajo
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};