import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Package, Calendar, MessageCircle, GraduationCap } from "lucide-react";
import type { Formation } from "@shared/schema";
import workshopImage from "@assets/generated_images/artisan_training_workshop.png";

const WHATSAPP_NUMBER = "242069876543";

function generateWhatsAppLink(formation: Formation): string {
  const message = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par la formation "${formation.name}".`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function FormationSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="w-full md:w-64 h-48 md:h-auto" />
        <CardContent className="flex-1 p-6 space-y-4">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </div>
    </Card>
  );
}

export default function Formations() {
  const { data: formations, isLoading } = useQuery<Formation[]>({
    queryKey: ["/api/formations"],
  });

  return (
    <div className="min-h-screen py-12 md:py-16">
      <section 
        className="relative py-16 md:py-24 mb-12"
        data-testid="formations-hero"
      >
        <div className="absolute inset-0">
          <img
            src={workshopImage}
            alt="Atelier de formation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block text-sm uppercase tracking-widest text-gold-muted font-medium mb-4">
              Autonomisation
            </span>
            <h1 
              className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6"
              data-testid="formations-title"
            >
              Nos Formations
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Apprenez l'art de la création artisanale en pagne avec nos ateliers 
              professionnels. Chaque formation est une étape vers l'autonomie 
              financière et l'épanouissement personnel.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <GraduationCap className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">
                Formation Pratique
              </h3>
              <p className="text-sm text-muted-foreground">
                Apprentissage par la pratique avec des projets concrets
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Package className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">
                Matériel Fourni
              </h3>
              <p className="text-sm text-muted-foreground">
                Tout le nécessaire pour apprendre dans les meilleures conditions
              </p>
            </Card>
            <Card className="p-6 text-center">
              <MessageCircle className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">
                Suivi Personnalisé
              </h3>
              <p className="text-sm text-muted-foreground">
                Accompagnement individuel pour votre réussite
              </p>
            </Card>
          </div>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
          Nos Ateliers
        </h2>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <FormationSkeleton key={i} />
            ))}
          </div>
        ) : formations && formations.length > 0 ? (
          <div 
            className="space-y-6"
            data-testid="formations-list"
          >
            {formations.map((formation) => (
              <Card 
                key={formation.id} 
                className="overflow-hidden"
                data-testid={`formation-card-${formation.id}`}
              >
                <div className="flex flex-col md:flex-row">
                  {formation.image && (
                    <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                      <img
                        src={formation.image}
                        alt={formation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 
                          className="font-serif text-xl font-bold text-foreground mb-2"
                          data-testid={`formation-name-${formation.id}`}
                        >
                          {formation.name}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {formation.description}
                        </p>
                      </div>
                      <p 
                        className="text-2xl font-bold text-gold-muted whitespace-nowrap"
                        data-testid={`formation-price-${formation.id}`}
                      >
                        {formation.price.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formation.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="w-4 h-4" />
                        <span>{formation.materials}</span>
                      </div>
                      {formation.nextSession && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Prochaine session: {new Date(formation.nextSession).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Badge>
                      )}
                    </div>

                    <a
                      href={generateWhatsAppLink(formation)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button 
                        className="uppercase tracking-wider text-xs font-medium"
                        data-testid={`button-register-${formation.id}`}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        S'inscrire
                      </Button>
                    </a>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div 
            className="text-center py-16"
            data-testid="empty-formations"
          >
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Aucune formation disponible
            </h3>
            <p className="text-muted-foreground">
              De nouvelles formations seront bientôt disponibles. Contactez-nous pour plus d'informations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
