import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/core/ui/button";
import { Card, CardContent } from "@/core/ui/card";
import { Badge } from "@/core/ui/badge";
import { Skeleton } from "@/core/ui/skeleton";
import {
  Calendar,
  Clock,
  MessageCircle,
  GraduationCap,
  Users,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import type { Atelier } from "@shared/schema";
import { api } from "@/core/api/api";

const HERO_URL = "/sac.jpg";
const WHATSAPP_NUMBER = "242067674083";

function buildWhatsAppLink(atelier: Atelier): string {
  const date = atelier.nextSession
    ? new Date(atelier.nextSession).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const message = encodeURIComponent(
    `✨ *DEMANDE D'INSCRIPTION ATELIER - Spirit Emeraude* ✨\n\n` +
      `🎓 *Atelier :* ${atelier.name}\n` +
      (atelier.duration ? `⏱️ *Durée :* ${atelier.duration}\n` : "") +
      (date ? `📅 *Prochaine date :* ${date}\n` : "") +
      `\n_Bonjour, je souhaite m'inscrire au prochain atelier._`,
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function AtelierSkeleton() {
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
      { threshold: 0.1 },
    );

    const element = document.getElementById(`counter-${end}-${suffix}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, suffix]);

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
    <span id={`counter-${end}-${suffix}`} className="inline-block">
      {count}
      {suffix}
    </span>
  );
}

export default function Ateliers() {
  const [activeStat, setActiveStat] = useState(0);

  const { data: ateliers, isLoading } = useQuery<Atelier[]>({
    queryKey: ["ateliers"],
    queryFn: () => api.atelier.list(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalAteliers = ateliers?.length || 0;
  const upcomingAteliers =
    ateliers?.filter((a) => a.nextSession && new Date(a.nextSession) > new Date()).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 md:py-28 overflow-hidden" data-testid="ateliers-hero">
        <div className="absolute inset-0">
          <img src={HERO_URL} alt="Ateliers Spirit Emeraude" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
          <div className="absolute top-10 right-10 w-40 h-40 bg-gold-muted/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <GraduationCap className="w-6 h-6 text-gold-muted" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-gold-muted" />
              </div>
              <span className="text-sm uppercase tracking-widest text-gold-muted font-medium bg-gold-muted/10 px-4 py-1.5 rounded-full">
                Prochains ateliers
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Nos Ateliers
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Découvrez nos prochains ateliers et rejoignez une expérience pratique autour de la création artisanale en pagne.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { value: totalAteliers, suffix: "", label: "Ateliers", icon: GraduationCap, color: "text-gold-muted" },
                { value: 150, suffix: "+", label: "Participants", icon: Users, color: "text-primary" },
                { value: upcomingAteliers, suffix: "", label: "Dates à venir", icon: Calendar, color: "text-primary" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-lg border border-border/50 bg-card/50 transition-all duration-500 hover:scale-105 hover:border-gold-muted/30 cursor-pointer ${
                    activeStat === index ? "ring-2 ring-gold-muted/30 scale-105" : ""
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

            <Button asChild>
              <a href="#liste-ateliers">
                Voir les ateliers
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border border-border/50 hover:border-gold-muted/30 transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-muted/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-gold-muted" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-3">Atelier pratique</h3>
              <p className="text-sm text-muted-foreground">Apprentissage concret avec démonstrations et accompagnement.</p>
            </Card>

            <Card className="p-6 text-center border border-border/50 hover:border-gold-muted/30 transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-3">Durée claire</h3>
              <p className="text-sm text-muted-foreground">Des sessions structurées pour progresser à votre rythme.</p>
            </Card>

            <Card className="p-6 text-center border border-border/50 hover:border-gold-muted/30 transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-3">Inscription simple</h3>
              <p className="text-sm text-muted-foreground">Contactez-nous sur WhatsApp pour réserver votre place.</p>
            </Card>
          </div>
        </div>
      </section>

      <div id="liste-ateliers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1.5 bg-gold-muted rounded-full" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Ateliers à venir</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Retrouvez ici les prochaines dates et les détails des ateliers.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <AtelierSkeleton key={i} />
            ))}
          </div>
        ) : ateliers && ateliers.length > 0 ? (
          <div className="space-y-8" data-testid="ateliers-list">
            {ateliers.map((atelier, index) => (
              <Card
                key={atelier.id}
                className="overflow-hidden border border-border hover:border-gold-muted/30 transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row">
                  {atelier.images && atelier.images.length > 0 && (
                    <div className="relative w-full md:w-72 h-56 md:h-auto overflow-hidden">
                      <img
                        src={atelier.images[0]}
                        alt={atelier.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gold-muted text-white">Atelier</Badge>
                      </div>
                      {atelier.images.length > 1 && (
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-background/90 text-foreground">+{atelier.images.length - 1} photos</Badge>
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
                            <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">{atelier.name}</h3>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-4">{atelier.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {atelier.duration && (
                          <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-gold-muted/10 text-gold-muted">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{atelier.duration}</span>
                          </div>
                        )}

                        {atelier.nextSession && (
                          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">
                              {new Date(atelier.nextSession).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </Badge>
                        )}

                        {atelier.images && atelier.images.length > 0 && (
                          <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                            <ImageIcon className="w-4 h-4" />
                            <span className="font-medium">{atelier.images.length} photo(s)</span>
                          </div>
                        )}

                        {atelier.videos && atelier.videos.length > 0 && (
                          <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                            <Video className="w-4 h-4" />
                            <span className="font-medium">{atelier.videos.length} vidéo(s)</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-gold-muted" />
                          Inscription via WhatsApp
                        </div>

                        <a href={buildWhatsAppLink(atelier)} target="_blank" rel="noopener noreferrer">
                          <Button className="uppercase tracking-wider text-sm font-medium">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            S'inscrire
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
          <div className="text-center py-16" data-testid="empty-ateliers">
            <div className="relative inline-block mb-6">
              <GraduationCap className="w-20 h-20 text-muted-foreground/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gold-muted animate-spin-slow" />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">Aucun atelier disponible</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              De nouveaux ateliers seront bientôt annoncés. Contactez-nous pour être informé des prochaines dates.
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Nous contacter
              </Button>
            </a>
          </div>
        )}

        {ateliers && ateliers.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Questions fréquentes</h3>
                <div className="space-y-3">
                  {[
                    { q: "Comment s'inscrire ?", a: "Cliquez sur S'inscrire pour nous écrire sur WhatsApp." },
                    { q: "Les places sont-elles limitées ?", a: "Oui, afin de garantir un bon accompagnement." },
                    { q: "Puis-je venir sans expérience ?", a: "Oui, les ateliers sont ouverts aux débutants." },
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
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Pourquoi participer ?</h3>
                <ul className="space-y-3">
                  {[
                    "Atelier pratique et progressif",
                    "Encadrement personnalisé",
                    "Ambiance conviviale",
                    "Accès à la communauté",
                    "Accompagnement pour évoluer",
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

      <style jsx>{`
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
