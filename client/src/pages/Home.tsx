import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/luxury_pagne_handbag_hero.png";
import founderImage from "@assets/generated_images/african_founder_portrait.png";
import bagImage from "@assets/generated_images/luxury_pagne_tote_bag.png";
import sandalsImage from "@assets/generated_images/luxury_pagne_sandals_product.png";
import workshopImage from "@assets/generated_images/artisan_training_workshop.png";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section 
        className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row"
        data-testid="hero-section"
      >
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 py-12 lg:py-0 order-2 lg:order-1">
          <div className="max-w-xl">
            <span className="inline-block text-sm uppercase tracking-widest text-gold-muted font-medium mb-4">
              Artisanat de Luxe Africain
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              L'art qui libère,
              <br />
              <span className="text-primary">l'élégance qui inspire</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Découvrez nos créations artisanales en pagne, symboles d'authenticité 
              et d'autonomisation. Chaque pièce raconte une histoire de transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/boutique">
                <Button 
                  size="lg" 
                  className="uppercase tracking-wider font-medium w-full sm:w-auto"
                  data-testid="cta-discover"
                >
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/formations">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="uppercase tracking-wider font-medium w-full sm:w-auto"
                  data-testid="cta-formations"
                >
                  Nos Formations
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 relative order-1 lg:order-2 min-h-[50vh] lg:min-h-0">
          <img
            src={heroImage}
            alt="Sac en pagne de luxe Spirit Emeraude"
            className="absolute inset-0 w-full h-full object-cover"
            data-testid="hero-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent lg:hidden" />
        </div>
      </section>

      <section 
        className="py-16 md:py-24 bg-card"
        data-testid="mission-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              <img
                src={founderImage}
                alt="Emeraude, fondatrice de Spirit Emeraude Création"
                className="w-full h-full object-cover rounded-md"
                data-testid="founder-image"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-md flex items-center justify-center">
                <Heart className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-6">
              <span className="inline-block text-sm uppercase tracking-widest text-gold-muted font-medium">
                Notre Histoire
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Former pour libérer l'avenir
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Je suis Emeraude, fondatrice de Spirit Emeraude Création. Ma mission est de 
                  transformer le pagne africain en pièces de luxe tout en offrant aux femmes 
                  les compétences nécessaires pour bâtir leur propre avenir.
                </p>
                <p>
                  Chaque création que vous découvrez ici est le fruit d'un savoir-faire 
                  transmis avec passion. Au-delà de la beauté de nos produits, c'est toute 
                  une communauté qui s'élève vers l'autonomie.
                </p>
                <p>
                  Ensemble, nous prouvons que l'artisanat africain peut allier excellence, 
                  élégance et impact social.
                </p>
              </div>
              <Link href="/impact">
                <Button 
                  variant="outline" 
                  className="uppercase tracking-wider font-medium mt-4"
                  data-testid="cta-impact"
                >
                  Découvrir notre impact
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section 
        className="py-16 md:py-24"
        data-testid="categories-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-sm uppercase tracking-widest text-gold-muted font-medium mb-4">
              Nos Créations
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Explorez l'univers Spirit
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/boutique?category=sac">
              <div 
                className="group relative aspect-[4/5] overflow-hidden rounded-md cursor-pointer"
                data-testid="category-bags"
              >
                <img
                  src={bagImage}
                  alt="Sacs & Pochettes"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Collection</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Sacs & Pochettes
                  </h3>
                </div>
              </div>
            </Link>

            <Link href="/boutique?category=sandale">
              <div 
                className="group relative aspect-[4/5] overflow-hidden rounded-md cursor-pointer"
                data-testid="category-sandals"
              >
                <img
                  src={sandalsImage}
                  alt="Sandales"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Collection</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Sandales
                  </h3>
                </div>
              </div>
            </Link>

            <Link href="/formations">
              <div 
                className="group relative aspect-[4/5] overflow-hidden rounded-md cursor-pointer md:col-span-2 lg:col-span-1"
                data-testid="category-formations"
              >
                <img
                  src={workshopImage}
                  alt="Formations"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <Users className="w-4 h-4" />
                    <span>Autonomisation</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Formations
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section 
        className="py-16 md:py-24 bg-primary text-primary-foreground"
        data-testid="cta-section"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Rejoignez notre mission
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Chaque achat contribue à former une femme vers l'autonomie. 
            Ensemble, créons un impact durable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/boutique">
              <Button 
                size="lg" 
                variant="secondary"
                className="uppercase tracking-wider font-medium"
                data-testid="cta-shop"
              >
                Voir la Boutique
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="uppercase tracking-wider font-medium border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="cta-contact"
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
