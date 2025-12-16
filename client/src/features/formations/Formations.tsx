import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/core/ui/button";
import { Card, CardContent } from "@/core/ui/card";
import { Badge } from "@/core/ui/badge";
import { Skeleton } from "@/core/ui/skeleton";
import {
  Clock,
  Package,
  Calendar,
  MessageCircle,
  GraduationCap,
  Users,
  Award,
  Star,
  Sparkles,
  ChevronRight,
  MapPin,
  CheckCircle,
} from "lucide-react";
import type { Formation } from "@shared/schema";
import { api } from "@/core/api/api";

// Image d'illustration statique pour le hero (hébergée publiquement).
const WORKSHOP_HERO_URL =
  "/sac.jpg";

const WHATSAPP_NUMBER = "242067674083";

// Construit le lien WhatsApp pour une inscription à une formation.
function generateWhatsAppLink(formation: Formation): string {
  const message = encodeURIComponent(
    `✨ *INSCRIPTION FORMATION - Spirit Emeraude* ✨\n\n` +
    `🎓 *Formation :* ${formation.name}\n` +
    `💰 *Prix :* ${formation.price.toLocaleString("fr-FR")} FCFA\n` +
    `⏱️ *Durée :* ${formation.duration}\n` +
    `📦 *Matériel :* ${formation.materials}\n\n` +
    `_Bonjour, je souhaite m'inscrire à cette formation._`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// Skeleton utilisé pendant le chargement des formations.
function FormationSkeleton() {
  return (
    <Card className="overflow-hidden border border-border/50">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="w-full md:w-72 h-56 md:h-auto" />
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

export default function Formations() {
  const [activeStat, setActiveStat] = useState(0);

  // Récupération des formations depuis DryAPI (endpoint /formation).
  const { data: formations, isLoading } = useQuery<Formation[]>({
    queryKey: ["formations"],
    queryFn: () => api.formation.list(),
  });

  // Animation des statistiques
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalFormations = formations?.length || 0;
  const upcomingSessions = formations?.filter(f => f.nextSession && new Date(f.nextSession) > new Date()).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        data-testid="formations-hero"
      >
        <div className="absolute inset-0">
          <img
            src={WORKSHOP_HERO_URL}
            alt="Atelier de formation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
          <div className="absolute top-10 right-10 w-40 h-40 bg-gold-muted/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <GraduationCap className="w-6 h-6 text-gold-muted" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-gold-muted" />
              </div>
              <span className="text-sm uppercase tracking-widest text-gold-muted font-medium bg-gold-muted/10 px-4 py-1.5 rounded-full">
                Autonomisation
              </span>
            </div>
            
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              data-testid="formations-title"
            >
              Nos Ateliers
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Découvrez l’art de la création artisanale en pagne grâce à nos ateliers et formations à domicile. Chaque apprentissage vous guide vers plus d’autonomie financière et d’épanouissement personnel.
            </p>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { value: totalFormations, suffix: "", label: "Ateliers", icon: GraduationCap, color: "text-gold-muted" },
                { value: 150, suffix: "+", label: "Participants", icon: Users, color: "text-primary" },
                { value: upcomingSessions, suffix: "", label: "Réalisations", icon: Calendar, color: "text-primary" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-4 rounded-lg border border-border/50 bg-card/50 transition-all duration-500 hover:scale-105 hover:border-gold-muted/30 cursor-pointer ${
                    activeStat === index ? 'ring-2 ring-gold-muted/30 scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveStat(index)}
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <Button className="mt-4">
              Découvrir les ateliers
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border border-border/50 hover:border-gold-muted/30 transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-muted/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-gold-muted" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-3">
                Formation Pratique
              </h3>
              <p className="text-sm text-muted-foreground">
                Apprentissage par la pratique avec des projets concrets et réalisations personnelles
              </p>
            </Card>
            
            <Card className="p-6 text-center border border-border/50 hover:border-gold-muted/30 transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-3">
                Matériel Fourni
              </h3>
              <p className="text-sm text-muted-foreground">
                Tout le nécessaire pour apprendre dans les meilleures conditions, inclus dans le prix
              </p>
            </Card>
            
            <Card className="p-6 text-center border border-border/50 hover:border-gold-muted/30 transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-3">
                Suivi Personnalisé
              </h3>
              <p className="text-sm text-muted-foreground">
                Accompagnement individuel pendant et après la formation pour votre réussite
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Ateliers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* En-tête */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1.5 bg-gold-muted rounded-full"></div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Nos Ateliers
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Découvrez nos réalisations passées à travers des photos et vidéos de nos ateliers. 
            Chaque atelier témoigne de notre engagement à partager notre savoir-faire artisanal.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <FormationSkeleton key={i} />
            ))}
          </div>
        ) : formations && formations.length > 0 ? (
          <div
            className="space-y-8"
            data-testid="formations-list"
          >
            {formations.map((formation, index) => (
              <Card
                key={formation.id}
                className="overflow-hidden border border-border hover:border-gold-muted/30 transition-all duration-300 group"
                data-testid={`formation-card-${formation.id}`}
              >
                <div className="flex flex-col md:flex-row">
                  {formation.images && formation.images.length > 0 && (
                    <div className="relative w-full md:w-72 h-56 md:h-auto overflow-hidden">
                      <img
                        src={formation.images[0]}
                        alt={formation.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gold-muted text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Atelier
                        </Badge>
                      </div>
                      {formation.images.length > 1 && (
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-background/90 text-foreground">
                            +{formation.images.length - 1} photos
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardContent className="flex-1 p-6 md:p-8">
                    <div className="space-y-6">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-muted to-primary flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <h3
                              className="font-serif text-xl md:text-2xl font-bold text-foreground"
                              data-testid={`formation-name-${formation.id}`}
                            >
                              {formation.name}
                            </h3>
                          </div>
                          <p
                            className="text-2xl font-bold text-gold-muted whitespace-nowrap"
                            data-testid={`formation-price-${formation.id}`}
                          >
                            {formation.price.toLocaleString("fr-FR")} FCFA
                          </p>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {formation.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-gold-muted/10 text-gold-muted">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{formation.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          <Package className="w-4 h-4" />
                          <span className="font-medium">{formation.materials}</span>
                        </div>
                        
                        {formation.location && (
                          <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-border/50 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{formation.location}</span>
                          </div>
                        )}
                        
                        {formation.nextSession && (
                          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">
                              {new Date(formation.nextSession).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </Badge>
                        )}
                      </div>

                      {formation.images && formation.images.length > 1 && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Galerie</p>
                          <div className="grid grid-cols-4 gap-2">
                            {formation.images.slice(1, 5).map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`${formation.name} ${idx + 2}`}
                                className="w-full h-16 object-cover rounded border border-border"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {formation.videos && formation.videos.length > 0 && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Vidéos ({formation.videos.length})</p>
                          <div className="grid grid-cols-2 gap-2">
                            {formation.videos.slice(0, 2).map((video, idx) => (
                              <video
                                key={idx}
                                src={video}
                                controls
                                className="w-full h-24 object-cover rounded border border-border"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-gold-muted text-gold-muted" />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">(4.9)</span>
                          </div>
                        </div>
                        
                        <a
                          href={generateWhatsAppLink(formation)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            className="uppercase tracking-wider text-sm font-medium"
                            data-testid={`button-register-${formation.id}`}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Nous contacter
                          </Button>
                        </a>
                      </div>
                    </div>
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
            <div className="relative inline-block mb-6">
              <GraduationCap className="w-20 h-20 text-muted-foreground/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gold-muted animate-spin-slow" />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
              Aucune formation disponible
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              De nouvelles formations seront bientôt disponibles. 
              Contactez-nous pour être informé des prochaines sessions.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Nous contacter
              </Button>
            </a>
          </div>
        )}

        {/* Section FAQ/Info */}
        {formations && formations.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  Questions fréquentes
                </h3>
                <div className="space-y-3">
                  {[
                    { q: "Le matériel est-il inclus ?", a: "Oui, tout le matériel nécessaire est fourni." },
                    { q: "Faut-il des prérequis ?", a: "Aucun prérequis n'est nécessaire, débutants acceptés." },
                    { q: "Peut-on payer en plusieurs fois ?", a: "Oui, des facilités de paiement sont possibles." }
                  ].map((faq, index) => (
                    <div key={index} className="p-3 rounded-lg border border-border/50">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-gold-muted mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground mb-1">{faq.q}</p>
                          <p className="text-sm text-muted-foreground">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gold-muted/5 to-primary/5 border border-gold-muted/20 rounded-xl p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  Pourquoi choisir nos formations ?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Encadrement par des artisans expérimentés",
                    "Groupes limités pour un suivi personnalisé",
                    "Certificat de formation délivré",
                    "Accès à la communauté des apprenants",
                    "Soutien pour le lancement de votre activité"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gold-muted/10 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-gold-muted" />
                      </div>
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}