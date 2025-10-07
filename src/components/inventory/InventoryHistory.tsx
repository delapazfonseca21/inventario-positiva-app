import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Clock, User } from "lucide-react";
import { useStockHistory } from "@/hooks/usePocketBase";
import { StockHistoryExpanded } from "../../lib/pocketbase"

interface HistoryItem {
  id: string;
  user: string;
  action: 'entrada' | 'salida';
  item: string;
  quantity: number;
  unit: string;
  timestamp: string;
}

export const InventoryHistory = () => {
  const { history, isLoading } = useStockHistory();
  console.log('Datos Crudos del Historial:', history);
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

  // Mapear datos de PocketBase al formato del componente
  const mappedHistory: HistoryItem[] = history.map((item: StockHistoryExpanded) => ({
    id: item.id,
    user: item.expand?.user?.name || 'Usuario desconocido',
    action: item.accion,
    item: item.expand?.item?.name || 'Item desconocido',
    quantity: item.cantidad,
    unit: item.unidad,
    timestamp: item.timestamp,
  }));

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Historial de Movimientos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : mappedHistory.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No hay movimientos registrados
          </div>
        ) : (
          <ScrollArea className="h-64 w-full">
            <div className="space-y-3">
              {mappedHistory.map((item) => (
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
        )}
      </CardContent>
    </Card>
  );
};