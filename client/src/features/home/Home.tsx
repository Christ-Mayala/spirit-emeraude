import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/core/ui/button";
import { ArrowRight, Heart, Users, Sparkles, Award, ChevronRight, ShoppingBag, Star, Target, TrendingUp } from "lucide-react";

// Images de décor statiques : ici on utilise des URLs publiques pour éviter
// de dépendre de fichiers locaux absents du projet. Les visuels métier
// dynamiques (produits, ateliers, impact, galerie) viennent eux de DryAPI.
const HERO_IMAGE_URL =
  "/bg.jpg";
const FOUNDER_IMAGE_URL =
  "/emeraude.jpeg";
const BAG_IMAGE_URL =
  "/sac.jpg";
const SANDALS_IMAGE_URL =
  "/sandale.jpg";
const WORKSHOP_IMAGE_URL =
  "/atelier.jpeg";

function Counter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <span id={`counter-${end}`} className="inline-block">
      {count}{suffix}
    </span>
  );
}

export default function Home() {
  const [activeStat, setActiveStat] = useState(0);

  // Animation des statistiques
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // @ts-ignore
  // @ts-ignore
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] overflow-hidden"
        data-testid="hero-section"
      >
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_URL}
            alt="Sac en pagne de luxe Spirit KES"
            className="absolute inset-0 w-full h-full object-cover"
            data-testid="hero-image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
          <div className="absolute top-20 right-20 w-40 h-40 bg-gold-muted/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl py-16 lg:py-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-gold-muted" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-muted rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm uppercase tracking-widest text-gold-muted font-medium bg-gold-muted/10 px-4 py-1.5 rounded-full">
                Artisanat de Luxe Africain
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
              L'art qui libère,
              <br />
              <span className="text-primary">l'élégance qui inspire</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
              Découvrez nos créations artisanales en pagne, symboles d'authenticité
              et d'autonomisation. Chaque pièce raconte une histoire de transformation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/boutique">
                <Button
                  size="lg"
                  className="group uppercase tracking-wider font-medium rounded-full px-8 py-6"
                  data-testid="cta-discover"
                >
                  <span className="flex items-center">
                    Découvrir la collection
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="/ateliers">
                <Button
                  variant="outline"
                  size="lg"
                  className="uppercase tracking-wider font-medium rounded-full px-8 py-6"
                  data-testid="cta-ateliers"
                >
                  Nos Ateliers
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: 500, suffix: "+", label: "Produits vendus", icon: ShoppingBag, color: "text-gold-muted" },
                { value: 40, suffix: "+", label: "Femmes formées", icon: Users, color: "text-primary" },
                { value: 1, suffix: "", label: "Années d'expertise", icon: Award, color: "text-gold-muted" },
                { value: 1, suffix: "", label: "Orphelinat aidés", icon: Heart, color: "text-primary" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border border-border/50 bg-card/50 transition-all duration-500 hover:scale-105 hover:border-gold-muted/30 cursor-pointer ${
                    activeStat === index ? 'ring-2 ring-gold-muted/30 scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveStat(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <Sparkles className="w-2 h-2 text-gold-muted/50" />
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        className="py-16 md:py-24 bg-card relative overflow-hidden"
        data-testid="mission-section"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-muted/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold-muted/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={FOUNDER_IMAGE_URL}
                  alt="Emeraude, fondatrice de Spirit KES"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  data-testid="founder-image"
                />
                <div className="absolute top-6 right-6 w-16 h-16 bg-gold-muted rounded-lg flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-1.5 bg-gold-muted rounded-full"></div>
                <span className="text-sm uppercase tracking-widest text-gold-muted font-medium">
                  Notre Histoire
                </span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Former pour libérer l'avenir
              </h2>

              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  Je m’appelle <strong className="text-gold-600">Emeraude Sephora KOULOUFOUA</strong>, fondatrice
                  de <strong className="text-gold-600">Spirit KES</strong>. Passionnée d’artisanat et
                  engagée pour l’autonomisation des jeunes, je transforme le <strong className="text-gold-600">pagne
                  africain en pièces de luxe</strong>, tout en offrant aux femmes et aux hommes les <strong
                    className="text-gold-600">compétences pour construire un avenir durable et rentable</strong>.
                </p>
                <p>
                  Chaque création porte un double sens : <strong className="text-gold-600">un savoir-faire transmis avec
                  passion</strong> et <strong className="text-gold-600">un engagement social</strong> pour donner aux
                  jeunes et aux femmes les outils nécessaires afin de <strong className="text-gold-600">changer leur
                  destin</strong> et atteindre l’autonomie.
                </p>
                <p>
                  Inspirée par la <strong className="text-gold-600">Conférence Internationale des Femmes Élites
                  (CIFE)</strong>,
                  je prouve que l’artisanat africain peut allier <strong className="text-gold-600">excellence, élégance
                  et transformation sociale</strong>.
                </p>
                <p>
                <strong className="text-gold-600">Spirit KES</strong> n’est pas qu’un atelier, c’est
                une <strong className="text-gold-600">mission</strong> : semer l’espoir et ouvrir des portes vers un
                avenir plus lumineux.
              </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/impact">
                  <Button
                      variant="outline"
                      className="group rounded-full px-6"
                      data-testid="cta-impact"
                  >
                    Découvrir notre impact
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                {/* <Link href="/apropos">
                  <Button
                    variant="ghost"
                    className="text-gold-muted hover:text-gold-muted/80 hover:bg-gold-muted/10 px-6"
                  >
                    Notre histoire
                  </Button>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        data-testid="categories-section"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-muted/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-muted/10 border border-gold-muted/20 mb-6">
              <Sparkles className="w-4 h-4 text-gold-muted" />
              <span className="text-sm uppercase tracking-widest text-gold-muted font-medium">
                Nos Créations
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Explorez l'univers Spirit
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos collections phares et nos programmes d'ateliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sacs & Pochettes */}
            <Link href="/boutique?category=sac">
              <div
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                data-testid="category-bags"
              >
                <img
                  src={BAG_IMAGE_URL}
                  alt="Sacs & Pochettes"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Collection Exclusive</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                    Sacs & Pochettes
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white/90 text-sm mb-4">
                      Créations uniques en pagne, alliant tradition et modernité
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white border-white/30 hover:bg-white/20"
                    >
                      Découvrir
                      <ChevronRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Sandales */}
            <Link href="/boutique?category=sandale">
              <div
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                data-testid="category-sandals"
              >
                <img
                  src={SANDALS_IMAGE_URL}
                  alt="Sandales"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">Best-Sellers</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                    Sandales
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white/90 text-sm mb-4">
                      Confort et élégance, fabriquées avec des matériaux nobles
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white border-white/30 hover:bg-white/20"
                    >
                      Découvrir
                      <ChevronRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Ateliers */}
            <Link href="/ateliers">
              <div
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 md:col-span-2 lg:col-span-1"
                data-testid="category-ateliers"
              >
                <img
                  src={WORKSHOP_IMAGE_URL}
                  alt="Ateliers"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Autonomisation</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                    Ateliers
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white/90 text-sm mb-4">
                      Apprenez l'artisanat et créez votre propre activité
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white border-white/30 hover:bg-white/20"
                    >
                      Découvrir
                      <ChevronRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-20 md:py-28 overflow-hidden bg-primary text-primary-foreground"
        data-testid="cta-section"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-muted/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
            <Target className="relative w-16 h-16 text-white" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Rejoignez notre mission
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Chaque achat contribue à former une femme vers l'autonomie.
            Ensemble, créons un impact durable et transformons des vies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/boutique">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 py-6 bg-white text-primary hover:bg-white/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group"
                data-testid="cta-shop"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explorer la boutique
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-semibold backdrop-blur-sm"
                data-testid="cta-contact"
              >
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
