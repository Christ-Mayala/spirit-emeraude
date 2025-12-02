import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Images, X } from "lucide-react";
import type { GalleryPhoto, GalleryCategory } from "@shared/schema";

const categories: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "creation", label: "Créations" },
  { value: "atelier", label: "Ateliers" },
  { value: "humanitaire", label: "Humanitaire" },
];

function GallerySkeleton() {
  return (
    <div className="masonry-grid">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="masonry-item">
          <Skeleton 
            className="w-full rounded-md" 
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

  const { data: photos, isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["/api/gallery"],
  });

  const filteredPhotos = photos?.filter((photo) => {
    if (activeCategory === "all") return true;
    return photo.category === activeCategory;
  });

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm uppercase tracking-widest text-gold-muted font-medium mb-4">
            Spirit Emeraude
          </span>
          <h1 
            className="font-serif text-4xl md:text-5xl font-bold text-foreground"
            data-testid="gallery-title"
          >
            Galerie
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explorez notre univers à travers ces moments capturés : créations artisanales, 
            ateliers de formation et actions humanitaires.
          </p>
        </div>

        <div 
          className="flex flex-wrap justify-center gap-2 mb-12"
          data-testid="gallery-filters"
        >
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.value)}
              className="rounded-full uppercase tracking-wider text-xs font-medium"
              data-testid={`filter-${category.value}`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <GallerySkeleton />
        ) : filteredPhotos && filteredPhotos.length > 0 ? (
          <div 
            className="masonry-grid"
            data-testid="gallery-grid"
          >
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="masonry-item group cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
                data-testid={`gallery-item-${photo.id}`}
              >
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={photo.imageUrl}
                    alt={photo.name || "Photo galerie Spirit Emeraude"}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                    {photo.name && (
                      <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-medium">
                          {photo.name}
                        </p>
                        <p className="text-white/70 text-xs capitalize">
                          {photo.category}
                        </p>
                      </div>
                    )}
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
            <Images className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Aucune photo dans cette catégorie
            </h3>
            <p className="text-muted-foreground">
              Sélectionnez une autre catégorie pour voir plus de photos.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => setActiveCategory("all")}
              data-testid="button-view-all-photos"
            >
              Voir toutes les photos
            </Button>
          </div>
        )}

        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
            {selectedPhoto && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedPhoto(null)}
                  data-testid="close-lightbox"
                >
                  <X className="h-5 w-5" />
                </Button>
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.name || "Photo galerie Spirit Emeraude"}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-md"
                />
                {selectedPhoto.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-md">
                    <p className="text-white font-medium">{selectedPhoto.name}</p>
                    <p className="text-white/70 text-sm capitalize">{selectedPhoto.category}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
