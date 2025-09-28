import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Calendar } from "lucide-react";
import positivaLogo from "@/assets/logo-positiva.png";

export const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3 shadow-card">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img 
            src={positivaLogo} 
            alt="Positiva" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-primary">
              Inventario Positiva
            </h1>
            <p className="text-xs text-muted-foreground">
              Sistema de gestión
            </p>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 hover:bg-primary-light/20"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              {user?.createdAt && (
                <DropdownMenuItem disabled>
                  <Calendar className="h-4 w-4 mr-2" />
                  <div className="text-xs">
                    <p>Creado el</p>
                    <p>{formatDate(user.createdAt)}</p>
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={logout}
            variant="outline" 
            size="sm"
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
};