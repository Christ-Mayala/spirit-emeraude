import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Badge } from "@/core/ui/badge";
import {
  ChevronLeft,
  MessageCircle,
  ShoppingBag,
  Check,
  Truck,
  Shield,
  Heart,
  Share2,
  Star,
  X,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  Maximize2,
} from "lucide-react";
import type { Product } from "@shared/schema";
import { api } from "@/core/api/api";

const WHATSAPP_NUMBER = "242068457521";

function generateWhatsAppLink(product: Product): string {
  const message = encodeURIComponent(
    `*NOUVELLE COMMANDE - Spirit Emeraude* \n\n` +
      `*Produit :* ${product.name}\n` +
      `*Prix :* ${product.price.toLocaleString("fr-FR")} FCFA\n` +
      `*Catégorie :* ${product.category}\n\n` +
      `*Lien du produit :* ${window.location.origin}/boutique/${product.id}\n\n` +
      `_Bonjour Spirit, je souhaite commander ce produit._`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// Modal pour l'affichage plein écran des images
function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}) {
  if (!isOpen) return null;

  const handlePrev = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-full h-full flex flex-col">
        {/* En-tête de la modal */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
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
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <div className="relative max-w-4xl max-h-[70vh] w-full h-full">
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 z-20"
          >
            <ChevronRight className="h-6 w-6" />
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
                    ? "border-gold-muted shadow-lg shadow-gold-muted/30"
                    : "border-transparent hover:border-white/50"
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

export default function ProductDetail() {
  const [, params] = useRoute("/boutique/:id");
  const productId = params?.id;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product | null>({
    queryKey: ["product-detail", productId],
    enabled: !!productId,
    queryFn: async () => {
      if (!productId) return null;
      return api.product.detail(productId);
    },
  });

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-muted/20 border-t-gold-muted mx-auto"></div>
            <ShoppingBag className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-gold-muted" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground mb-2">
              Préparation du produit
            </p>
            <p className="text-sm text-muted-foreground">
              Chargement des détails...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
        <Card className="max-w-md w-full border-2 border-border/50 shadow-lg overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-gold-muted/20 via-gold-muted/30 to-gold-muted/20"></div>
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-muted to-background flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/70" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm"></span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Produit introuvable
              </h2>
              <p className="text-muted-foreground">
                Le produit que vous recherchez n'existe pas ou a été déplacé.
              </p>
            </div>
            <Button
              onClick={() => window.history.back()}
              className="w-full group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour à la boutique
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/5">
        {/* En-tête avec gradient */}
        <div className="bg-gradient-to-r from-gold-muted/5 via-background to-gold-muted/5 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="group hover:bg-transparent px-3 py-2 rounded-lg transition-all duration-300 hover:pl-2"
              >
                <ChevronLeft className="mr-2 h-5 w-5 transition-all duration-300 group-hover:-translate-x-1" />
                <span className="font-medium text-foreground/90">
                  Retour à la collection
                </span>
              </Button>

              {/* <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full hover:bg-gold-muted/10 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full hover:bg-gold-muted/10 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Contenu principal avec effet de carte */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="relative">
            {/* Effet d'ombre portée */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-muted/5 to-transparent rounded-3xl blur-3xl opacity-50"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Section image avec effets visuels */}
              <div className="space-y-6">
                <div className="relative group">
                  {/* Badge de catégorie sur image */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="px-4 py-2 rounded-full bg-black text-white backdrop-blur-sm border border-white/30 shadow-lg">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </Badge>
                  </div>

                  {/* Bouton zoom */}
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openImageModal(0)}
                      className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm border border-gold-muted/30 hover:bg-gold-muted/10 shadow-lg"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Conteneur image avec bordures arrondies */}
                  <Card className="overflow-hidden border-2 border-border/60 hover:border-gold-muted/40 transition-all duration-500 shadow-xl rounded-3xl">
                    <CardContent className="p-0">
                      <button
                        onClick={() => openImageModal(0)}
                        className="w-full h-full block text-left relative aspect-square md:aspect-[4/5] bg-gradient-to-br from-muted/40 to-background overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent z-10"></div>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                        />
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Maximize2 className="h-8 w-8 text-white/80" />
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </div>

                {/* Galerie miniatures avec scroll */}
                {product.images.length > 1 && (
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {product.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => openImageModal(index)}
                          className={`flex-shrink-0 overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-muted focus:ring-offset-2 rounded-xl ${
                            index === 0
                              ? "border-gold-muted shadow-lg"
                              : "border-transparent hover:border-gold-muted/50"
                          }`}
                        >
                          <div className="relative w-24 h-24 md:w-28 md:h-28">
                            <img
                              src={img}
                              alt={`${product.name} - vue ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Indicateur de vue au survol */}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <Maximize2 className="h-5 w-5 text-white/90" />
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {product.images.length > 4 && (
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Section informations avec carte élégante */}
              <Card className="border-2 border-border/50 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* En-tête produit avec étoiles et badge */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 fill-gold-muted text-gold-muted"
                            />
                          ))}
                        </div>
                        {!product.inStock ? (
                          <Badge
                            variant="secondary"
                            className="px-4 py-1.5 bg-red-100/80 text-red-800 border border-red-200 animate-pulse"
                          >
                            🔥 Rupture de stock
                          </Badge>
                        ) : (
                          <Badge className="px-4 py-1.5 bg-green-100/80 text-green-800 border border-green-200">
                            ✓ En stock
                          </Badge>
                        )}
                      </div>

                      <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                        {product.name}
                      </h1>

                      <div className="flex items-baseline gap-4">
                        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold-muted to-amber-600 bg-clip-text text-transparent">
                          {product.price.toLocaleString("fr-FR")} FCFA
                        </span>
                        <span className="text-sm text-muted-foreground">
                          TVA incluse
                        </span>
                      </div>
                    </div>

                    {/* Séparateur décoratif */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

                    {/* Description avec fond subtil */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-1.5 bg-gold-muted rounded-full"></div>
                        <h2 className="text-xl font-semibold text-foreground">
                          Description
                        </h2>
                      </div>
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/20 to-background/50 border border-border/50">
                        <div className="text-foreground/80 space-y-3">
                          {product.description
                            .split("\n")
                            .map((paragraph, index) => (
                              <p key={index} className="leading-relaxed">
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions avec bouton WhatsApp stylisé */}
                    <div className="space-y-6 pt-4">
                      <div className="relative group">
                        <a
                          href={generateWhatsAppLink(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button
                            size="default"
                            className="w-full py-4 text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group-hover:shadow-gold-muted/20 relative overflow-hidden"
                            disabled={!product.inStock}
                          >
                            <span className="relative z-10 flex items-center justify-center">
                              <div className="mr-3 p-1.5 rounded-full bg-white/20">
                                <MessageCircle className="h-5 w-5" />
                              </div>
                              Commander sur WhatsApp
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </Button>
                        </a>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          Réponse garantie sous 24h • Livraison rapide
                        </p>
                      </div>

                      {!product.inStock && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-100">
                          <p className="text-sm text-red-800 text-center">
                            <strong>⚠️ Produit très demandé !</strong>
                            <br />
                            Contactez-nous pour connaître la date de
                            réapprovisionnement.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Garanties en grille */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/50">
                      {[
                        {
                          icon: Truck,
                          title: "Livraison Express",
                          desc: "Brazzaville & environs",
                          color: "from-blue-500/20 to-blue-600/20",
                        },
                        {
                          icon: Check,
                          title: "100% Artisanal",
                          desc: "Fait main au Congo",
                          color: "from-green-500/20 to-emerald-600/20",
                        },
                        {
                          icon: Shield,
                          title: "Qualité Premium",
                          desc: "Matériaux durables",
                          color: "from-purple-500/20 to-purple-600/20",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border border-border/30`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-background to-white flex items-center justify-center shadow-sm">
                              <item.icon className="h-6 w-6 text-gold-muted" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-foreground mb-1">
                                {item.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Note WhatsApp */}
                    <div className="rounded-2xl bg-gradient-to-r from-gold-muted/5 via-gold-muted/10 to-gold-muted/5 border border-gold-muted/20 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span>Commande simplifiée</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              WhatsApp
                            </Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            1. Cliquez sur le bouton vert
                            <br />
                            2. Votre message est pré-rempli
                            <br />
                            3. Nous vous répondons sous 24h
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour l'affichage plein écran des images */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        images={product.images}
        currentIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
      />
    </>
  );
}
