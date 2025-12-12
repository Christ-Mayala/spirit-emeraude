import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/hooks/use-auth";
import { api, CATEGORIES } from "@/core/api/api";
import { buildApiUrl } from "@/core/lib/queryClient";
import type { GalleryPhoto, GalleryCategory } from "@shared/schema";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";
import { useToast } from "@/core/hooks/use-toast";
import { Images, Trash2, Upload } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";

interface GalleryFormState {
  name: string;
  category: GalleryCategory | "";
  image: File | null;
}

function AdminGalleryContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<GalleryFormState>({
    name: "",
    category: "",
    image: null,
  });

  const { data: photos, isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["admin-gallery"],
    queryFn: () => api.gallery.list(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non autorisé");
      if (!formState.image) throw new Error("Image obligatoire");
      if (!formState.category) throw new Error("Catégorie obligatoire");

      const formData = new FormData();
      if (formState.name) formData.append("name", formState.name);
      formData.append("category", formState.category);
      formData.append("image", formState.image);

      const url = buildApiUrl("/gallery");
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de l'ajout de la photo");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Photo ajoutée" });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      setFormState({ name: "", category: "", image: null });
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de l'ajout",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Non autorisé");
      const url = buildApiUrl(`/gallery/${id}`);
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
      toast({ title: "Photo supprimée" });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la suppression",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: keyof GalleryFormState, value: unknown) => {
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
              <Images className="w-6 h-6 text-primary" />
              Gestion de la galerie
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Ajoutez ou supprimez les photos exposées dans la galerie du site.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Nouvelle photo</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Titre (optionnel)</label>
                  <Input
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Titre de la photo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select
                    value={formState.category}
                    onValueChange={(value) => handleChange("category", value as GalleryCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.GALLERY.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Image
                    <Upload className="w-4 h-4 opacity-70" />
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange("image", e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    L'image sera uploadée vers Cloudinary via DryAPI.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || !isAdmin}
                >
                  {createMutation.isPending ? "Ajout..." : "Ajouter la photo"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Galerie actuelle</h2>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement des photos...</p>
              ) : !photos || photos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune photo pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="border rounded-md overflow-hidden flex flex-col h-full"
                    >
                      <div className="aspect-square bg-muted overflow-hidden">
                        {/* Image dynamique renvoyée par DryAPI pour la galerie */}
                        <img
                          src={photo.imageUrl}
                          alt={photo.name || "Photo galerie Spirit Emeraude"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 flex-1 flex flex-col gap-1">
                        <p className="text-xs font-medium truncate">{photo.name ?? 'Photo'}</p>
                        <p className="text-[11px] text-muted-foreground capitalize">
                          {photo.category}
                        </p>
                        <div className="flex justify-end mt-auto pt-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={deleteMutation.isPending || !isAdmin}
                            onClick={() => deleteMutation.mutate(photo.id)}
                          >
                            <Trash2 className="w-3 h-3" />
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

export default function AdminGallery() {
  return (
    <RequireAuth>
      <AdminGalleryContent />
    </RequireAuth>
  );
}
