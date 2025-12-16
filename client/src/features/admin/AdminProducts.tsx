import { useMemo, useState } from "react";
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
import { Package, Trash2, Upload, Loader2, Pencil, X } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/ui/dialog";

const categories: { value: ProductCategory; label: string }[] = [
  { value: "sac", label: "Sacs" },
  { value: "trousse", label: "Trousses" },
  { value: "sandale", label: "Sandales" },
  { value: "accessoire", label: "Accessoires" },
  { value: "personnalise", label: "Personnalisé" },
  { value: "saisonnier", label: "Saisonnier" },
];

interface ProductCreateFormState {
  name: string;
  category: ProductCategory | "";
  price: string;
  description: string;
  isFeatured: boolean;
  inStock: boolean;
  images: File[];
}

interface ProductEditState {
  id: string;
  name: string;
  category: ProductCategory;
  price: string;
  description: string;
  isFeatured: boolean;
  inStock: boolean;
  existingImages: string[];
  newImages: File[];
}

function AdminProductsContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === "admin";

  const [createState, setCreateState] = useState<ProductCreateFormState>({
    name: "",
    category: "",
    price: "",
    description: "",
    isFeatured: false,
    inStock: true,
    images: [],
  });

  const [createPreviews, setCreatePreviews] = useState<string[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState<ProductEditState | null>(null);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: () => api.product.list(),
  });

  const canCreate = useMemo(() => {
    return Boolean(createState.name && createState.category && createState.price);
  }, [createState.name, createState.category, createState.price]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non autorisé");
      if (!createState.category) throw new Error("Catégorie obligatoire");

      const formData = new FormData();
      formData.append("name", createState.name);
      formData.append("category", createState.category);
      formData.append("price", createState.price);
      formData.append("description", createState.description);
      formData.append("isFeatured", String(createState.isFeatured));
      formData.append("inStock", String(createState.inStock));
      createState.images.forEach((f) => formData.append("images", f));

      const url = buildApiUrl("/product");
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
      setCreateState({ name: "", category: "", price: "", description: "", isFeatured: false, inStock: true, images: [] });
      setCreatePreviews([]);
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la création",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: ProductEditState) => {
      if (!token) throw new Error("Non autorisé");

      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("category", payload.category);
      formData.append("price", payload.price);
      formData.append("description", payload.description);
      formData.append("isFeatured", String(payload.isFeatured));
      formData.append("inStock", String(payload.inStock));
      payload.newImages.forEach((f) => formData.append("images", f));

      const url = buildApiUrl(`/product/${payload.id}`);
      const res = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la modification");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Produit modifié" });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditOpen(false);
      setEditState(null);
      setEditPreviews([]);
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la modification",
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
        headers: { Authorization: `Bearer ${token}` },
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

  const onCreateImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setCreateState((p) => ({ ...p, images: [...p.images, ...files] }));

    files.forEach((file) => {
      const r = new FileReader();
      r.onloadend = () => setCreatePreviews((prev) => [...prev, r.result as string]);
      r.readAsDataURL(file);
    });
  };

  const removeCreateImage = (index: number) => {
    setCreateState((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
    setCreatePreviews((p) => p.filter((_, i) => i !== index));
  };

  const openEdit = (product: Product) => {
    setEditState({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price ?? ""),
      description: product.description ?? "",
      isFeatured: Boolean(product.isFeatured),
      inStock: Boolean(product.inStock),
      existingImages: product.images ?? [],
      newImages: [],
    });
    setEditPreviews([]);
    setEditOpen(true);
  };

  const onEditImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setEditState((p) => (p ? { ...p, newImages: [...p.newImages, ...files] } : p));

    files.forEach((file) => {
      const r = new FileReader();
      r.onloadend = () => setEditPreviews((prev) => [...prev, r.result as string]);
      r.readAsDataURL(file);
    });
  };

  const removeEditImage = (index: number) => {
    setEditState((p) => (p ? { ...p, newImages: p.newImages.filter((_, i) => i !== index) } : p));
    setEditPreviews((p) => p.filter((_, i) => i !== index));
  };

  const submitEdit = () => {
    if (!editState) return;
    updateMutation.mutate(editState);
  };

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
              L'admin peut créer, modifier ou supprimer les produits.
            </p>
          </div>
          <Badge variant={isAdmin ? "default" : "destructive"}>Rôle connecté : {user?.role ?? "inconnu"}</Badge>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Nouveau produit</h2>
              <p className="text-xs text-muted-foreground">Les images sont envoyées vers Cloudinary via l'API.</p>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  createMutation.mutate();
                }}
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nom</label>
                  <Input value={createState.name} onChange={(e) => setCreateState((p) => ({ ...p, name: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select value={createState.category} onValueChange={(v) => setCreateState((p) => ({ ...p, category: v as ProductCategory }))}>
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
                  <Input type="number" value={createState.price} onChange={(e) => setCreateState((p) => ({ ...p, price: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={createState.description} onChange={(e) => setCreateState((p) => ({ ...p, description: e.target.value }))} rows={3} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={createState.isFeatured} onChange={(e) => setCreateState((p) => ({ ...p, isFeatured: e.target.checked }))} />
                    À la une
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={createState.inStock} onChange={(e) => setCreateState((p) => ({ ...p, inStock: e.target.checked }))} />
                    En stock
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Images
                    <Upload className="w-4 h-4 opacity-70" />
                  </label>
                  <Input type="file" multiple accept="image/*" onChange={onCreateImagesChange} />
                  {createPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {createPreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <img src={src} alt={`create-${idx}`} className="w-full h-24 object-cover rounded border" />
                          <button type="button" onClick={() => removeCreateImage(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={!isAdmin || createMutation.isPending || !canCreate}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {createMutation.isPending ? "Création..." : "Ajouter le produit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Produits existants</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !products || products.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun produit.</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-md overflow-hidden flex flex-col md:flex-row gap-4">
                      {product.images?.[0] && (
                        <div className="w-full md:w-48 lg:w-56 h-40 md:h-auto flex-shrink-0 bg-muted overflow-hidden">
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3 space-y-2 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                            {product.isFeatured && <Badge className="mt-1">À la une</Badge>}
                          </div>
                          <p className="text-sm font-semibold text-gold-muted">{Number(product.price).toLocaleString("fr-FR")} FCFA</p>
                        </div>
                        {product.description && <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>}
                        <div className="flex justify-end pt-2 mt-auto gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8" disabled={!isAdmin} onClick={() => openEdit(product)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8" disabled={!isAdmin || deleteMutation.isPending} onClick={() => deleteMutation.mutate(product.id)}>
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

        <Dialog open={editOpen} onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setEditState(null);
            setEditPreviews([]);
          }
        }}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Modifier un produit</DialogTitle>
              <DialogDescription>Vous pouvez modifier les champs. Si vous ajoutez de nouvelles images, elles remplaceront la liste.</DialogDescription>
            </DialogHeader>

            {editState && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nom</label>
                    <Input value={editState.name} onChange={(e) => setEditState((p) => (p ? { ...p, name: e.target.value } : p))} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Catégorie</label>
                    <Select value={editState.category} onValueChange={(v) => setEditState((p) => (p ? { ...p, category: v as ProductCategory } : p))}>
                      <SelectTrigger>
                        <SelectValue />
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
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Prix (FCFA)</label>
                  <Input type="number" value={editState.price} onChange={(e) => setEditState((p) => (p ? { ...p, price: e.target.value } : p))} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={editState.description} onChange={(e) => setEditState((p) => (p ? { ...p, description: e.target.value } : p))} rows={3} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editState.isFeatured} onChange={(e) => setEditState((p) => (p ? { ...p, isFeatured: e.target.checked } : p))} />
                    À la une
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editState.inStock} onChange={(e) => setEditState((p) => (p ? { ...p, inStock: e.target.checked } : p))} />
                    En stock
                  </label>
                </div>

                {editState.existingImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Images actuelles</p>
                    <div className="grid grid-cols-3 gap-2">
                      {editState.existingImages.slice(0, 6).map((src, idx) => (
                        <img key={idx} src={src} alt={`existing-${idx}`} className="w-full h-20 object-cover rounded border" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Nouvelles images (optionnel)
                    <Upload className="w-4 h-4 opacity-70" />
                  </label>
                  <Input type="file" multiple accept="image/*" onChange={onEditImagesChange} />
                  {editPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {editPreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <img src={src} alt={`edit-${idx}`} className="w-full h-24 object-cover rounded border" />
                          <button type="button" onClick={() => removeEditImage(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>
                Annuler
              </Button>
              <Button type="button" disabled={!isAdmin || updateMutation.isPending || !editState} onClick={submitEdit}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
