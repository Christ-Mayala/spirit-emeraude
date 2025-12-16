import { Link } from "wouter";
import { Button } from "@/core/ui/button";
import { Home, ArrowLeft, Navigation, AlertCircle, Compass, Sparkles, ShoppingBag, GraduationCap, Heart, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            {/* Design décoratif */}
            <div className="absolute -inset-8 bg-gradient-to-r from-gold-muted/5 to-primary/5 rounded-full blur-3xl"></div>
            <div className="relative">
              {/* Animated circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-gold-muted/20 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/10 rounded-full animate-ping delay-700"></div>
              
              {/* Main 404 display */}
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <AlertCircle className="w-8 h-8 text-gold-muted animate-bounce" />
                  <Sparkles className="w-6 h-6 text-gold-muted animate-spin-slow" />
                  <Navigation className="w-8 h-8 text-gold-muted animate-bounce delay-300" />
                </div>
                <span className="text-9xl font-serif font-bold bg-gradient-to-r from-gold-muted/20 via-gold-muted/10 to-primary/20 bg-clip-text text-transparent">
                  404
                </span>
              </div>
            </div>
          </div>

          {/* Message principal */}
          <div className="space-y-6 max-w-2xl mx-auto">
            <h1 
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
              data-testid="not-found-title"
            >
              Oops... Page Introuvable
            </h1>
            
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Désolé, la page que vous recherchez semble s'être égarée dans notre atelier créatif.
                Elle pourrait être en cours de création ou avoir été déplacée.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-muted/10 border border-gold-muted/20">
                <Compass className="w-4 h-4 text-gold-muted" />
                <span className="text-sm font-medium text-gold-muted">
                  Ne vous inquiétez pas, voici quelques options
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions principales - AU CENTRE */}
        <div className="max-w-md mx-auto mb-12">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex-1">
                <Button 
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-gold-muted to-primary hover:from-primary hover:to-gold-muted text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
                  data-testid="go-home-button"
                >
                  <Home className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                  <span className="text-base">Retour à l'accueil</span>
                </Button>
              </Link>
              <Button 
                variant="outline"
                className="w-full h-14 rounded-xl font-semibold border-2 hover:border-gold-muted/50 hover:bg-gold-muted/5"
                onClick={() => window.history.back()}
                data-testid="go-back-button"
              >
                <ArrowLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
                <span className="text-base">Page précédente</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions alternatives - AU CENTRE */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-foreground text-center flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-gold-muted" />
              Explorez nos univers
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/boutique">
                <Button 
                  variant="ghost" 
                  className="w-full h-auto py-4 px-4 rounded-xl hover:bg-gold-muted/5 hover:text-gold-muted group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-full bg-gold-muted/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag className="w-5 h-5 text-gold-muted" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-base">Boutique</div>
                      <div className="text-sm text-muted-foreground">Découvrir nos créations</div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </div>
                </Button>
              </Link>
              
              <Link href="/ateliers">
                <Button 
                  variant="ghost" 
                  className="w-full h-auto py-4 px-4 rounded-xl hover:bg-primary/5 hover:text-primary group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-base">Ateliers</div>
                      <div className="text-sm text-muted-foreground">Nos ateliers</div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </div>
                </Button>
              </Link>
              
              <Link href="/impact">
                <Button 
                  variant="ghost" 
                  className="w-full h-auto py-4 px-4 rounded-xl hover:bg-gold-muted/5 hover:text-gold-muted group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-full bg-gold-muted/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-5 h-5 text-gold-muted" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-base">Impact Social</div>
                      <div className="text-sm text-muted-foreground">Notre mission</div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </div>
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button 
                  variant="ghost" 
                  className="w-full h-auto py-4 px-4 rounded-xl hover:bg-primary/5 hover:text-primary group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-base">Contact</div>
                      <div className="text-sm text-muted-foreground">Nous écrire</div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Message décoratif en bas */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Si vous pensez qu'il s'agit d'une erreur,{" "}
            <Link href="/contact" className="text-gold-muted hover:text-gold-muted/80 font-medium underline underline-offset-2">
              contactez-nous
            </Link>
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}