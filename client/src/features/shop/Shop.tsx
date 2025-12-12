import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch, Link } from "wouter";
import { Button } from "@/core/ui/button";
import { Card, CardContent } from "@/core/ui/card";
import { Badge } from "@/core/ui/badge";
import { Skeleton } from "@/core/ui/skeleton";
import { MessageCircle, ShoppingBag, Filter, Sparkles, ChevronRight, Package, Tag, Award, Star, Clock } from "lucide-react";
import type { Product, ProductCategory } from "@shared/schema";
import { api } from "@/core/api/api";

const categories: { value: ProductCategory | "all"; label: string; icon: React.ReactNode }[] = [
  { 
    value: "all", 
    label: "Tous", 
    icon: <Package className="w-3.5 h-3.5" />
  },
  { 
    value: "sac", 
    label: "Sacs", 
    icon: <ShoppingBag className="w-3.5 h-3.5" />
  },
  { 
    value: "trousse", 
    label: "Trousses", 
    icon: <Package className="w-3.5 h-3.5" />
  },
  { 
    value: "sandale", 
    label: "Sandales", 
    icon: <Tag className="w-3.5 h-3.5" />
  },
  { 
    value: "accessoire", 
    label: "Accessoires", 
    icon: <Sparkles className="w-3.5 h-3.5" />
  },
];

const WHATSAPP_NUMBER = "242067674083";

function generateWhatsAppLink(product: Product): string {
  const message = encodeURIComponent(
    `✨ *NOUVELLE COMMANDE - Spirit Emeraude* ✨\n\n` +
    `🛍️ *Produit :* ${product.name}\n` +
    `💰 *Prix :* ${product.price.toLocaleString("fr-FR")} FCFA\n` +
    `📂 *Catégorie :* ${product.category}\n\n` +
    `_Bonjour Spirit, je souhaite commander ce produit._`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border border-border/50 hover:border-gold-muted/20 transition-all duration-300">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full mt-4" />
      </div>
    </Card>
  );
}

export default function Shop() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = (params.get("category") as ProductCategory) || "all";
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    initialCategory,
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeStat, setActiveStat] = useState(0);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", activeCategory],
    queryFn: () => api.product.list({ category: activeCategory }),
  });

  const filteredProducts = products?.filter((product) => {
    if (activeCategory === "all") return true;
    return product.category === activeCategory;
  });

  // Stats en temps réel
  const totalProducts = filteredProducts?.length || 0;
  const featuredProducts = filteredProducts?.filter(p => p.isFeatured).length || 0;
  const availableProducts = filteredProducts?.filter(p => p.inStock).length || 0;

  // Animation des statistiques
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-16 md:py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-muted/10 border border-gold-muted/20 mb-6">
              <Sparkles className="w-4 h-4 text-gold-muted" />
              <span className="text-sm uppercase tracking-widest text-gold-muted font-medium">
                Spirit Emeraude
              </span>
            </div>
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              data-testid="shop-title"
            >
              La Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Découvrez nos créations artisanales en pagne, confectionnées avec amour
              et savoir-faire à Brazzaville. Chaque pièce raconte une histoire.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="text-center p-4 rounded-lg border border-border/50 bg-card/50 min-w-[100px]">
                <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Produits</div>
              </div>
              <div className="text-center p-4 rounded-lg border border-border/50 bg-card/50 min-w-[100px]">
                <div className="text-2xl font-bold text-gold-muted">{featuredProducts}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">En vedette</div>
              </div>
              <div className="text-center p-4 rounded-lg border border-border/50 bg-card/50 min-w-[100px]">
                <div className="text-2xl font-bold text-primary">{availableProducts}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Disponibles</div>
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
            <div className="flex flex-wrap justify-center gap-2" data-testid="category-filters">
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

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="products-grid"
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden group border border-border hover:border-gold-muted/30 bg-card transition-all duration-300 hover:shadow-lg"
                  data-testid={`product-card-${product.id}`}
                >
                  {/* Product Image */}
                  <Link href={`/boutique/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Product Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isFeatured && (
                          <Badge
                            className="bg-gold-muted text-white border-0 shadow-sm"
                            data-testid={`badge-featured-${product.id}`}
                          >
                            <Award className="w-3 h-3 mr-1" />
                            Vedette
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge 
                            variant="secondary" 
                            className="bg-red-100 text-red-800 border-red-200"
                          >
                            Rupture
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Link href={`/boutique/${product.id}`}>
                          <h3
                            className="font-medium text-foreground text-sm hover:text-gold-muted transition-colors cursor-pointer line-clamp-1"
                            data-testid={`product-name-${product.id}`}
                          >
                            {product.name}
                          </h3>
                        </Link>
                        <p
                          className="text-gold-muted font-semibold mt-1"
                          data-testid={`product-price-${product.id}`}
                        >
                          {product.price.toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                      
                      <a
                        href={generateWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          className="w-full uppercase tracking-wider text-xs font-medium py-2 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!product.inStock}
                          data-testid={`button-order-${product.id}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-2" />
                          {product.inStock ? "Commander" : "Indisponible"}
                        </Button>
                      </a>
                      
                      {/* Stock Status */}
                      {!product.inStock && (
                        <div className="text-center pt-2">
                          <p className="text-xs text-muted-foreground">
                            Contactez-nous pour le réapprovisionnement
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16"
              data-testid="empty-products"
            >
              <div className="relative inline-block mb-6">
                <ShoppingBag className="w-20 h-20 text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gold-muted animate-spin-slow" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Aucun produit ne correspond à cette catégorie pour le moment.
                Explorez nos autres collections ou revenez bientôt.
              </p>
              <Button
                variant="outline"
                className="mt-2 rounded-md px-6"
                onClick={() => setActiveCategory("all")}
                data-testid="button-view-all-products"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Voir tous les produits
              </Button>
            </div>
          )}

          {/* Pagination/Info */}
          {filteredProducts && filteredProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Affichage de <span className="font-semibold text-foreground">{filteredProducts.length}</span> produits
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

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            size="lg"
            className="rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Commander
          </Button>
        </a>
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
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}