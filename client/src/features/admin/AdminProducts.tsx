import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/hooks/use-auth";
import { api } from "@/core/api/api";
import { buildApiUrl } from "@/core/lib/queryClient";
import type { Product, ProductCategory } from "@shared/schema";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Textarea } from "@/core/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";
import { Badge } from "@/core/ui/badge";
import { useToast } from "@/core/hooks/use-toast";
import { Package, Plus, Trash2, Upload } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";

const categories: { value: ProductCategory; label: string }[] = [
  { value: "sac", label: "Sacs" },
  { value: "trousse", label: "Trousses" },
  { value: "sandale", label: "Sandales" },
  { value: "accessoire", label: "Accessoires" },
  { value: "personnalise", label: "Personnalisé" },
  { value: "saisonnier", label: "Saisonnier" },
];

interface ProductFormState {
  name: string;
  category: ProductCategory | "";
  price: string;
  description: string;
  isFeatured: boolean;
  inStock: boolean;
  images: FileList | null;
}

function AdminProductsContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<ProductFormState>({
    name: "",
    category: "",
    price: "",
    description: "",
    isFeatured: false,
    inStock: true,
    images: null,
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: () => api.product.list(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non autorisé");
      if (!formState.category) throw new Error("Catégorie obligatoire");

      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("category", formState.category);
      formData.append("price", formState.price);
      formData.append("description", formState.description);
      formData.append("isFeatured", String(formState.isFeatured));
      formData.append("inStock", String(formState.inStock));

      if (formState.images) {
        Array.from(formState.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      const url = buildApiUrl("/product");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la création du produit");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Produit créé" });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setFormState((prev) => ({ ...prev, name: "", price: "", description: "", images: null }));
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la création",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Non autorisé");
      const url = buildApiUrl(`/product/${id}`);
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la suppression");
      }
    },
    onSuccess: () => {
      toast({ title: "Produit supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la suppression",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: keyof ProductFormState, value: unknown) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Gestion des produits
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Créez, listez et supprimez les produits exposés sur la boutique publique.
            </p>
          </div>
          <Badge variant={isAdmin ? "default" : "destructive"}>
            Rôle connecté : {user?.role ?? "inconnu"}
          </Badge>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Nouveau produit</h2>
              <p className="text-xs text-muted-foreground">
                Les images téléchargées sont envoyées à DryAPI via le service Cloudinary.
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nom du produit"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select
                    value={formState.category}
                    onValueChange={(value) => handleChange("category", value as ProductCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Prix (FCFA)</label>
                  <Input
                    type="number"
                    value={formState.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="45000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formState.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    placeholder="Courte description du produit..."
                  />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={formState.isFeatured}
                      onChange={(e) => handleChange("isFeatured", e.target.checked)}
                    />
                    <span>Mettre en avant</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={formState.inStock}
                      onChange={(e) => handleChange("inStock", e.target.checked)}
                    />
                    <span>En stock</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Images
                    <Upload className="w-4 h-4 opacity-70" />
                  </label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleChange("images", e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ces fichiers seront uploadés vers Cloudinary via DryAPI.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={createMutation.isPending || !isAdmin}
                >
                  <Plus className="w-4 h-4" />
                  {createMutation.isPending ? "Création..." : "Ajouter le produit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Produits existants</h2>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement des produits...</p>
              ) : !products || products.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun produit pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-md overflow-hidden flex flex-col h-full"
                    >
                      <div className="aspect-[4/3] bg-muted overflow-hidden">
                        {/* Image dynamique renvoyée par DryAPI (Cloudinary) */}
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 space-y-2 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {product.category}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gold-muted">
                            {product.price.toLocaleString("fr-FR")} FCFA
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex gap-2 text-xs">
                            {product.isFeatured && <Badge>En vedette</Badge>}
                            {!product.inStock && (
                              <Badge variant="secondary">Rupture</Badge>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            disabled={deleteMutation.isPending || !isAdmin}
                            onClick={() => deleteMutation.mutate(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  return (
    <RequireAuth>
      <AdminProductsContent />
    </RequireAuth>
  );
}
