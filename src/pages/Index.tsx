import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/LoginForm";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-brand">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show login form
  if (!user) {
    return <LoginForm />;
  }

  // If user is logged in, show dashboard
  return <Dashboard />;
};

export default Index;
