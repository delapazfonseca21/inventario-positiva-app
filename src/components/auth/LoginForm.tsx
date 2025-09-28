import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield } from "lucide-react";
import positivaLogo from "@/assets/logo-positiva.png";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor complete todos los campos.",
      });
      return;
    }

    const success = await login(email, password);
    
    if (!success) {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Credenciales incorrectas. Contacte al administrador.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-brand p-4">
      <Card className="w-full max-w-md shadow-brand">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src={positivaLogo} 
              alt="Positiva Seguros" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">
              Inventario Positiva
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sistema de gestión de inventario
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="usuario@positiva.com"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-brand"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Ingresando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Ingresar</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Solo personal autorizado. <br />
                Contacte al administrador para obtener credenciales.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};