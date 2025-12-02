import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, ShoppingBag } from "lucide-react";
import type { Product, ProductCategory } from "@shared/schema";

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "sac", label: "Sacs" },
  { value: "trousse", label: "Trousses" },
  { value: "sandale", label: "Sandales" },
  { value: "accessoire", label: "Accessoires" },
];

const WHATSAPP_NUMBER = "242069876543";

function generateWhatsAppLink(product: Product): string {
  const message = encodeURIComponent(
    `Bonjour Spirit, je souhaite commander le ${product.name} à ${product.price.toLocaleString('fr-FR')} FCFA.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-4 space-y-2">
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
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(initialCategory);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", activeCategory],
  });

  const filteredProducts = products?.filter((product) => {
    if (activeCategory === "all") return true;
    return product.category === activeCategory;
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
            data-testid="shop-title"
          >
            La Collection
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos créations artisanales en pagne, confectionnées avec amour 
            et savoir-faire à Brazzaville.
          </p>
        </div>

        <div 
          className="flex flex-wrap justify-center gap-2 mb-12"
          data-testid="category-filters"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="products-grid"
          >
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden group"
                data-testid={`product-card-${product.id}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.isFeatured && (
                    <Badge 
                      className="absolute top-3 left-3 bg-gold-muted text-gold-muted-foreground"
                      data-testid={`badge-featured-${product.id}`}
                    >
                      En vedette
                    </Badge>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Badge variant="secondary">Rupture de stock</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 
                      className="font-medium text-foreground text-sm"
                      data-testid={`product-name-${product.id}`}
                    >
                      {product.name}
                    </h3>
                    <p 
                      className="text-gold-muted font-semibold mt-1"
                      data-testid={`product-price-${product.id}`}
                    >
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <a
                    href={generateWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button 
                      className="w-full uppercase tracking-wider text-xs font-medium"
                      disabled={!product.inStock}
                      data-testid={`button-order-${product.id}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Commander
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div 
            className="text-center py-16"
            data-testid="empty-products"
          >
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-muted-foreground">
              Aucun produit ne correspond à cette catégorie pour le moment.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => setActiveCategory("all")}
              data-testid="button-view-all-products"
            >
              Voir tous les produits
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
