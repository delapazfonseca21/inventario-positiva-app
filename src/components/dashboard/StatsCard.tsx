import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'tools' | 'paints' | 'materials';
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = 'default' 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'tools':
        return 'border-tools/20 bg-tools/5';
      case 'paints':
        return 'border-paints/20 bg-paints/5';
      case 'materials':
        return 'border-materials/20 bg-materials/5';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'tools':
        return 'text-tools';
      case 'paints':
        return 'text-paints';
      case 'materials':
        return 'text-materials';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={`${getVariantStyles()} shadow-card hover:shadow-lg transition-all duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${getIconColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};