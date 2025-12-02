import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl font-serif font-bold text-primary/20">404</span>
        </div>
        <h1 
          className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
          data-testid="not-found-title"
        >
          Page Introuvable
        </h1>
        <p className="text-muted-foreground mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="uppercase tracking-wider font-medium" data-testid="go-home-button">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="uppercase tracking-wider font-medium"
            data-testid="go-back-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
