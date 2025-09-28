import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Clock, User } from "lucide-react";

interface HistoryItem {
  id: string;
  user: string;
  action: 'entrada' | 'salida';
  item: string;
  quantity: number;
  unit: string;
  timestamp: string;
}

// Mock data - In real app, this would come from PocketBase
const mockHistory: HistoryItem[] = [
  {
    id: '1',
    user: 'Ana García',
    action: 'entrada',
    item: 'Martillo Stanley',
    quantity: 5,
    unit: 'unidades',
    timestamp: '2024-09-28T10:30:00Z'
  },
  {
    id: '2',
    user: 'Carlos López',
    action: 'salida',
    item: 'Pintura Blanca Interior',
    quantity: 2,
    unit: 'galones',
    timestamp: '2024-09-28T09:15:00Z'
  },
  {
    id: '3',
    user: 'María Rodriguez',
    action: 'entrada',
    item: 'Cemento Portland',
    quantity: 10,
    unit: 'bultos',
    timestamp: '2024-09-27T16:45:00Z'
  },
  {
    id: '4',
    user: 'Juan Pérez',
    action: 'salida',
    item: 'Taladro Eléctrico',
    quantity: 1,
    unit: 'unidad',
    timestamp: '2024-09-27T14:20:00Z'
  },
];

export const InventoryHistory = () => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Historial de Movimientos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <div className="space-y-3">
            {mockHistory.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    item.action === 'entrada' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {item.action === 'entrada' 
                      ? <TrendingUp className="h-4 w-4" />
                      : <TrendingDown className="h-4 w-4" />
                    }
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.item}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{item.user}</span>
                      <span>•</span>
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge 
                    variant={item.action === 'entrada' ? 'default' : 'secondary'}
                    className={item.action === 'entrada' 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-warning text-warning-foreground'
                    }
                  >
                    {item.action === 'entrada' ? '+' : '-'}{item.quantity} {item.unit}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};