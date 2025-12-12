import { Redirect } from "wouter";
import { useAuth } from "@/core/hooks/use-auth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactElement;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Vérification de la session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return children;
}
