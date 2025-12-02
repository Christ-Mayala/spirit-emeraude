import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Impact } from "@shared/schema";
import impactImage from "@assets/generated_images/community_impact_workshop.png";

function ImpactSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
      <Skeleton className="aspect-[4/3] w-full rounded-md" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function ImpactPage() {
  const { data: impacts, isLoading } = useQuery<Impact[]>({
    queryKey: ["/api/impacts"],
  });

  return (
    <div className="min-h-screen">
      <section 
        className="relative py-20 md:py-28"
        data-testid="impact-hero"
      >
        <div className="absolute inset-0">
          <img
            src={impactImage}
            alt="Impact social Spirit Emeraude"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-gold-muted" />
              <span className="text-sm uppercase tracking-widest text-gold-muted font-medium">
                Notre Mission Sociale
              </span>
            </div>
            <h1 
              className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6"
              data-testid="impact-title"
            >
              Impact Social
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Au-delà de la création artisanale, Spirit Emeraude s'engage pour 
              l'autonomisation des femmes et le soutien aux enfants vulnérables. 
              Chaque pièce vendue contribue à cette mission.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Femmes formées</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">Orphelinats soutenus</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Enfants aidés</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Former pour libérer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos formations permettent aux femmes d'acquérir un savoir-faire 
                précieux et de créer leur propre source de revenus. Nous croyons 
                que l'autonomie financière est la clé de l'émancipation.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Soutenir les plus vulnérables
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Une partie de nos bénéfices est reversée aux orphelinats locaux. 
                Nous organisons également des ateliers créatifs pour les enfants, 
                leur permettant de développer leur créativité.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Nos Actions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos initiatives sociales et humanitaires à travers le Congo.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <ImpactSkeleton key={i} />
              ))}
            </div>
          ) : impacts && impacts.length > 0 ? (
            <div 
              className="space-y-16"
              data-testid="impacts-list"
            >
              {impacts.map((impact, index) => (
                <article 
                  key={impact.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                  data-testid={`impact-item-${impact.id}`}
                >
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                      <img
                        src={impact.images[0]}
                        alt={impact.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    {impact.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {impact.images.slice(1, 4).map((img, imgIndex) => (
                          <div key={imgIndex} className="aspect-square rounded-md overflow-hidden">
                            <img
                              src={img}
                              alt={`${impact.name} - ${imgIndex + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`space-y-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h3 
                      className="font-serif text-2xl md:text-3xl font-bold text-foreground"
                      data-testid={`impact-name-${impact.id}`}
                    >
                      {impact.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(impact.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {impact.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{impact.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {impact.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-16"
              data-testid="empty-impacts"
            >
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Nos actions arrivent bientôt
              </h3>
              <p className="text-muted-foreground">
                Nous préparons de nouvelles initiatives. Revenez bientôt pour découvrir nos projets.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Contribuez à notre mission
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Chaque achat que vous faites soutient directement nos actions sociales. 
            Rejoignez notre communauté d'artisans du changement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/boutique">
              <Button 
                size="lg" 
                variant="secondary"
                className="uppercase tracking-wider font-medium"
              >
                Découvrir la Boutique
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="uppercase tracking-wider font-medium border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
