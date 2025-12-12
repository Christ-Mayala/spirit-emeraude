import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/core/ui/button";
import { Skeleton } from "@/core/ui/skeleton";
import { Dialog, DialogContent } from "@/core/ui/dialog";
import { Images, X, Sparkles, Filter, ChevronRight, ChevronLeft, Maximize2, Calendar, MapPin } from "lucide-react";
import type { GalleryPhoto, GalleryCategory } from "@shared/schema";
import { api } from "@/core/api/api";

const categories: { value: GalleryCategory | "all"; label: string; icon?: React.ReactNode }[] = [
  { 
    value: "all", 
    label: "Tous", 
    icon: <Images className="w-3.5 h-3.5" />
  },
  { 
    value: "creation", 
    label: "Créations", 
    icon: <Sparkles className="w-3.5 h-3.5" />
  },
  { 
    value: "atelier", 
    label: "Ateliers", 
    icon: <Filter className="w-3.5 h-3.5" />
  },
  { 
    value: "humanitaire", 
    label: "Humanitaire", 
    icon: <Calendar className="w-3.5 h-3.5" />
  },
];

// Skeleton en mode masonry pendant le chargement des photos de la galerie.
function GallerySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div key={i} className="mb-6 break-inside-avoid">
          <Skeleton
            className="w-full rounded-xl"
            style={{ height: `${Math.random() * 150 + 200}px` }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Récupération des photos de la galerie depuis DryAPI (endpoint /gallery).
  const { data: photos, isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["gallery", activeCategory],
    queryFn: () => api.gallery.list({ category: activeCategory }),
  });

  const filteredPhotos = photos?.filter((photo) => {
    if (activeCategory === "all") return true;
    return photo.category === activeCategory;
  });

  const openLightbox = (photo: GalleryPhoto, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    setIsLoadingImage(true);
    setIsImageLoaded(false);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setSelectedIndex(0);
    setIsImageLoaded(false);
  };

  const navigatePrevious = () => {
    if (!filteredPhotos) return;
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredPhotos.length - 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
    setIsImageLoaded(false);
  };

  const navigateNext = () => {
    if (!filteredPhotos) return;
    const newIndex = selectedIndex < filteredPhotos.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
    setIsImageLoaded(false);
  };

  // Gestion des touches clavier dans le lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigatePrevious();
      if (e.key === 'ArrowRight') navigateNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, selectedIndex, filteredPhotos]);

  const handleImageLoad = () => {
    setIsLoadingImage(false);
    setIsImageLoaded(true);
  };

  // Stats
  const totalPhotos = filteredPhotos?.length || 0;
  const creationsCount = filteredPhotos?.filter(p => p.category === 'creation').length || 0;
  const workshopsCount = filteredPhotos?.filter(p => p.category === 'atelier').length || 0;
  const humanitarianCount = filteredPhotos?.filter(p => p.category === 'humanitaire').length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-muted/10 border border-gold-muted/20 mb-6">
              <Sparkles className="w-4 h-4 text-gold-muted" />
              <span className="text-sm uppercase tracking-widest text-gold-muted font-medium">
                Spirit Emeraude
              </span>
            </div>
            
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              data-testid="gallery-title"
            >
              Galerie
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explorez notre univers à travers ces moments capturés : créations artisanales,
              ateliers de formation et actions humanitaires.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="text-xl font-bold text-foreground">{totalPhotos}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Photos</div>
              </div>
              <div className="text-center p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="text-xl font-bold text-gold-muted">{creationsCount}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Créations</div>
              </div>
              <div className="text-center p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="text-xl font-bold text-primary">{workshopsCount}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Ateliers</div>
              </div>
              <div className="text-center p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="text-xl font-bold text-primary">{humanitarianCount}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Humanitaire</div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrer par catégorie
              <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${isFilterVisible ? 'rotate-90' : ''}`} />
            </Button>
          </div>

          {/* Categories Filter */}
          <div className={`${isFilterVisible ? 'block' : 'hidden'} lg:block mb-12`}>
            <div className="flex flex-wrap justify-center gap-2" data-testid="gallery-filters">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={activeCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveCategory(category.value);
                    setIsFilterVisible(false);
                  }}
                  className={`rounded-full uppercase tracking-wider text-xs font-medium px-4 py-2.5 transition-all duration-300 ${
                    activeCategory === category.value 
                      ? 'shadow-md' 
                      : 'hover:border-gold-muted/50 hover:bg-gold-muted/5'
                  }`}
                  data-testid={`filter-${category.value}`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <GallerySkeleton />
          ) : filteredPhotos && filteredPhotos.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6" data-testid="gallery-grid">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="mb-6 break-inside-avoid group"
                  onClick={() => openLightbox(photo, index)}
                  data-testid={`gallery-item-${photo.id}`}
                >
                  <div className="relative overflow-hidden rounded-xl cursor-pointer border border-border/50 hover:border-gold-muted/30 transition-all duration-300">
                    <img
                      src={photo.imageUrl}
                      alt={photo.name || "Photo galerie Spirit Emeraude"}
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {photo.name && (
                          <p className="text-white font-medium text-sm mb-1">{photo.name}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-xs px-2 py-1 rounded-full bg-black/40">
                            {categories.find(c => c.value === photo.category)?.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3 h-3 text-white/70" />
                            <span className="text-white/70 text-xs">Zoom</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16"
              data-testid="empty-gallery"
            >
              <div className="relative inline-block mb-6">
                <Images className="w-20 h-20 text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gold-muted animate-spin-slow" />
                </div>
              </div>
              
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Aucune photo dans cette catégorie
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Sélectionnez une autre catégorie pour voir plus de photos.
              </p>
              
              <Button
                variant="outline"
                className="mt-2 rounded-full px-6"
                onClick={() => setActiveCategory("all")}
                data-testid="button-view-all-photos"
              >
                <Images className="w-4 h-4 mr-2" />
                Voir toutes les photos
              </Button>
            </div>
          )}

          {/* Info Footer */}
          {filteredPhotos && filteredPhotos.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Affichage de <span className="font-semibold text-foreground">{filteredPhotos.length}</span> photos
                {activeCategory !== "all" && (
                  <> dans la catégorie <span className="font-semibold text-gold-muted">
                    {categories.find(c => c.value === activeCategory)?.label}
                  </span></>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent">
              <div className="flex items-center gap-4 text-white">
                <span className="text-sm font-medium">
                  {selectedIndex + 1} / {filteredPhotos?.length || 0}
                </span>
                {selectedPhoto.name && (
                  <span className="text-sm text-white/80 truncate max-w-md">
                    {selectedPhoto.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                  onClick={closeLightbox}
                  data-testid="close-lightbox"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
              {/* Loading Spinner */}
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-muted/20 border-t-gold-muted"></div>
                </div>
              )}

              {/* Navigation Buttons - CENTRÉS et VISIBLES */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 z-20 pointer-events-none">
                {/* Bouton précédent - position fixe */}
                <div className="pointer-events-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm shadow-lg"
                    onClick={navigatePrevious}
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </Button>
                </div>

                {/* Bouton suivant - position fixe */}
                <div className="pointer-events-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm shadow-lg"
                    onClick={navigateNext}
                  >
                    <ChevronRight className="h-7 w-7" />
                  </Button>
                </div>
              </div>

              {/* Image Container - Affichage normal */}
              <div className="relative max-w-full max-h-full flex items-center justify-center px-16">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.name || "Photo galerie Spirit Emeraude"}
                  className={`max-w-full max-h-[80vh] object-contain rounded-lg transition-opacity duration-300 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  style={{
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-4 bg-gradient-to-t from-black/90 to-transparent">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-2 text-white/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 rounded-full bg-gold-muted/20 text-gold-muted text-xs font-medium">
                      {categories.find(c => c.value === selectedPhoto.category)?.label}
                    </span>
                    {selectedPhoto.date && (
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(selectedPhoto.date).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                    {selectedPhoto.location && (
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{selectedPhoto.location}</span>
                      </div>
                    )}
                  </div>
                  {selectedPhoto.name && (
                    <h3 className="text-lg font-medium text-white">
                      {selectedPhoto.name}
                    </h3>
                  )}
                  {selectedPhoto.description && (
                    <p className="text-sm text-white/90">
                      {selectedPhoto.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Dots for Mobile */}
            <div className="p-4 bg-gradient-to-t from-black/90 to-transparent lg:hidden">
              <div className="flex justify-center gap-2">
                {filteredPhotos?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedIndex(index);
                      setSelectedPhoto(filteredPhotos[index]);
                      setIsImageLoaded(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === selectedIndex 
                        ? 'bg-gold-muted w-4' 
                        : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        
        .break-inside-avoid {
          break-inside: avoid;
        }
      `}</style>
    </div>
  );
}