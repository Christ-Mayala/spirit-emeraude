import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/core/ui/button";
import { Skeleton } from "@/core/ui/skeleton";
import { Heart, MapPin, Calendar, ArrowRight, Users, Target, Sparkles, ChevronRight, Star, Award, HandHeart, X, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent } from "@/core/ui/dialog";
import type { Impact } from "@shared/schema";
import { api } from "@/core/api/api";

const IMPACT_HERO_URL =
  "/formation.jpeg";

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

function ImageModal({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex,
  onIndexChange,
  impactName 
}: { 
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  impactName: string;
}) {
  if (!isOpen) return null;

  const handlePrev = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-full h-full flex flex-col">
        {/* En-tête de la modal */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length} • {impactName}
            </span>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Image principale */}
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="relative max-w-4xl max-h-[70vh] w-full h-full">
            <img
              src={images[currentIndex]}
              alt={`${impactName} - Image ${currentIndex + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 z-20"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Miniatures en bas */}
        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  index === currentIndex
                    ? 'border-gold-muted shadow-lg shadow-gold-muted/30'
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImpactPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImpactIndex, setSelectedImpactIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeStat, setActiveStat] = useState(0);

  const { data: impacts, isLoading } = useQuery<Impact[]>({
    queryKey: ["impacts"],
    queryFn: () => api.impact.list(),
  });

  const openImageModal = (impactIndex: number, imageIndex: number) => {
    setSelectedImpactIndex(impactIndex);
    setSelectedImageIndex(imageIndex);
    setSelectedImage(impacts?.[impactIndex]?.images[imageIndex] || null);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImpactIndex(null);
    setSelectedImageIndex(0);
  };

  const handlePrevImage = () => {
    if (selectedImpactIndex === null || !impacts) return;
    
    const currentImpact = impacts[selectedImpactIndex];
    if (selectedImageIndex > 0) {
      // Image précédente dans le même impact
      setSelectedImageIndex(selectedImageIndex - 1);
      setSelectedImage(currentImpact.images[selectedImageIndex - 1]);
    } else if (selectedImpactIndex > 0) {
      // Dernière image de l'impact précédent
      const prevImpact = impacts[selectedImpactIndex - 1];
      setSelectedImpactIndex(selectedImpactIndex - 1);
      setSelectedImageIndex(prevImpact.images.length - 1);
      setSelectedImage(prevImpact.images[prevImpact.images.length - 1]);
    } else {
      // Aller au dernier impact, dernière image
      const lastImpact = impacts[impacts.length - 1];
      setSelectedImpactIndex(impacts.length - 1);
      setSelectedImageIndex(lastImpact.images.length - 1);
      setSelectedImage(lastImpact.images[lastImpact.images.length - 1]);
    }
  };

  const handleNextImage = () => {
    if (selectedImpactIndex === null || !impacts) return;
    
    const currentImpact = impacts[selectedImpactIndex];
    if (selectedImageIndex < currentImpact.images.length - 1) {
      // Image suivante dans le même impact
      setSelectedImageIndex(selectedImageIndex + 1);
      setSelectedImage(currentImpact.images[selectedImageIndex + 1]);
    } else if (selectedImpactIndex < impacts.length - 1) {
      // Première image de l'impact suivant
      const nextImpact = impacts[selectedImpactIndex + 1];
      setSelectedImpactIndex(selectedImpactIndex + 1);
      setSelectedImageIndex(0);
      setSelectedImage(nextImpact.images[0]);
    } else {
      // Aller au premier impact, première image
      setSelectedImpactIndex(0);
      setSelectedImageIndex(0);
      setSelectedImage(impacts[0].images[0]);
    }
  };

  // Animation des statistiques
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <section
          className="relative py-20 md:py-28"
          data-testid="impact-hero"
        >
          <div className="absolute inset-0">
            <img
              src={IMPACT_HERO_URL}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {[
                  { value: 40, suffix: "+", label: "Femmes formées", icon: Users, color: "text-gold-muted" },
                  { value: 1, suffix: "", label: "Orphelinat soutenus", icon: Target, color: "text-primary" },
                  { value: 50, suffix: "+", label: "Enfants aidés", icon: Heart, color: "text-primary" }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={`text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:scale-105 hover:border-gold-muted/30 cursor-pointer ${
                      activeStat === index ? 'ring-2 ring-gold-muted/30 scale-105' : ''
                    }`}
                    onMouseEnter={() => setActiveStat(index)}
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">
                      <Counter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link href="#actions">
                <Button
                  className="mt-6"
                >
                  Découvrir nos actions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-md bg-gold-muted/10">
                    <Award className="w-6 h-6 text-gold-muted" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Former pour libérer
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Nos formations permettent aux femmes d'acquérir un savoir-faire
                  précieux et de créer leur propre source de revenus. Nous croyons
                  que l'autonomie financière est la clé de l'émancipation.
                </p>
                <ul className="space-y-2 mt-4">
                  {["Formation professionnelle complète", "Accompagnement personnalisé", "Création d'entreprise", "Suivi sur 2 ans"].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-foreground/80">
                      <Star className="w-3 h-3 text-gold-muted" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <HandHeart className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Soutenir les plus vulnérables
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Une partie de nos bénéfices est reversée aux orphelinats locaux.
                  Nous organisons également des ateliers créatifs pour les enfants,
                  leur permettant de développer leur créativité.
                </p>
                <ul className="space-y-2 mt-4">
                  {["Don mensuel aux orphelinats", "Ateliers créatifs pour enfants", "Fournitures scolaires", "Soutien alimentaire"].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-foreground/80">
                      <Heart className="w-3 h-3 text-primary" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="actions" className="py-12 md:py-16">
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
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                    data-testid={`impact-item-${impact.id}`}
                  >
                    <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer group">
                        <img
                          src={impact.images[0]}
                          alt={impact.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onClick={() => openImageModal(index, 0)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                            onClick={() => openImageModal(index, 0)}
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {impact.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {impact.images.slice(1, 4).map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="aspect-square rounded-md overflow-hidden cursor-pointer group/mini"
                              onClick={() => openImageModal(index, imgIndex + 1)}
                            >
                              <img
                                src={img}
                                alt={`${impact.name} - ${imgIndex + 2}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/mini:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/mini:bg-black/30 transition-all duration-300"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`space-y-4 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-muted to-primary flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <h3
                          className="font-serif text-2xl md:text-3xl font-bold text-foreground"
                          data-testid={`impact-name-${impact.id}`}
                        >
                          {impact.name}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold-muted/10">
                          <Calendar className="w-4 h-4 text-gold-muted" />
                          <span>
                            {new Date(impact.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {impact.location && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{impact.location}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {impact.description}
                      </p>
                      <Button
                        variant="ghost"
                        className="text-gold-muted hover:text-primary hover:bg-gold-muted/10 px-0"
                        onClick={() => openImageModal(index, 0)}
                      >
                        Voir les photos
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
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

      {/* Modal pour l'affichage plein écran des images */}
      {selectedImpactIndex !== null && impacts && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          images={impacts[selectedImpactIndex].images}
          currentIndex={selectedImageIndex}
          onIndexChange={(newIndex) => {
            setSelectedImageIndex(newIndex);
            setSelectedImage(impacts[selectedImpactIndex].images[newIndex]);
          }}
          impactName={impacts[selectedImpactIndex].name}
        />
      )}
    </>
  );
}