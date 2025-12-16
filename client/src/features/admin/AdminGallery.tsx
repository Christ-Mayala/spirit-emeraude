import { useMemo, useState } from "react";
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
import { Images, Trash2, Upload, X, Loader2, Pencil } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/core/ui/dialog";

interface GalleryCreateFormState {
  name: string;
  category: GalleryCategory | "";
  images: File[];
}

interface GalleryEditFormState {
  id: string;
  name: string;
  category: GalleryCategory;
  image: File | null;
}

function AdminGalleryContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createState, setCreateState] = useState<GalleryCreateFormState>({
    name: "",
    category: "",
    images: [],
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState<GalleryEditFormState | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const { data: photos, isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["admin-gallery"],
    queryFn: () => api.gallery.list(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non autorisé");
      if (createState.images.length === 0) throw new Error("Au moins une image obligatoire");
      if (!createState.category) throw new Error("Catégorie obligatoire");

      const formData = new FormData();
      if (createState.name) formData.append("name", createState.name);
      formData.append("category", createState.category);
      createState.images.forEach((file) => formData.append("images", file));

      const url = buildApiUrl("/gallery");
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de l'ajout des photos");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({ title: `${createState.images.length} photo(s) ajoutée(s)` });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      setCreateState({ name: "", category: "", images: [] });
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de l'ajout",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: GalleryEditFormState) => {
      if (!token) throw new Error("Non autorisé");

      const formData = new FormData();
      if (payload.name) formData.append("name", payload.name);
      formData.append("category", payload.category);
      if (payload.image) formData.append("image", payload.image);

      const url = buildApiUrl(`/gallery/${payload.id}`);
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
      toast({ title: "Photo modifiée" });
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      setEditOpen(false);
      setEditState(null);
      setEditPreview(null);
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

  const isAdmin = user?.role === "admin";

  const canSubmitCreate = useMemo(() => {
    return Boolean(createState.category && createState.images.length > 0);
  }, [createState.category, createState.images.length]);

  const handleCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setCreateState((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeCreateImage = (index: number) => {
    setCreateState((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const openEdit = (photo: GalleryPhoto) => {
    setEditState({
      id: photo.id,
      name: photo.name ?? "",
      category: photo.category,
      image: null,
    });
    setEditPreview(photo.imageUrl);
    setEditOpen(true);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEditState((prev) => (prev ? { ...prev, image: file } : prev));
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setEditPreview(reader.result as string);
    reader.readAsDataURL(file);
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
              <Images className="w-6 h-6 text-primary" />
              Gestion de la galerie
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Ajoutez, modifiez ou supprimez les photos exposées dans la galerie.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Nouvelles photos</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  createMutation.mutate();
                }}
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium">Titre (optionnel)</label>
                  <Input
                    value={createState.name}
                    onChange={(e) => setCreateState((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Titre des photos"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select
                    value={createState.category}
                    onValueChange={(value) => setCreateState((p) => ({ ...p, category: value as GalleryCategory }))}
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
                    Images
                    <Upload className="w-4 h-4 opacity-70" />
                  </label>
                  <Input type="file" multiple accept="image/*" onChange={handleCreateImageChange} />

                  {createState.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {createState.images.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="relative group">
                          <div className="w-full h-24 rounded border bg-muted overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCreateImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending || !isAdmin || !canSubmitCreate}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {createMutation.isPending ? "Ajout..." : `Ajouter ${createState.images.length || ""} photo(s)`}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Galerie actuelle</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !photos || photos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune photo pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="border rounded-md overflow-hidden flex flex-col h-full">
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.name || "Photo galerie Spirit Emeraude"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 flex-1 flex flex-col gap-1">
                        <p className="text-xs font-medium truncate">{photo.name ?? "Photo"}</p>
                        <p className="text-[11px] text-muted-foreground capitalize">{photo.category}</p>
                        <div className="flex justify-end mt-auto pt-1 gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={!isAdmin}
                            onClick={() => openEdit(photo)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={deleteMutation.isPending || !isAdmin}
                            onClick={() => deleteMutation.mutate(photo.id)}
                          >
                            {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
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
            setEditPreview(null);
          }
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Modifier une photo</DialogTitle>
              <DialogDescription>Vous pouvez modifier le titre, la catégorie, et remplacer l'image.</DialogDescription>
            </DialogHeader>

            {editState && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={editState.name}
                    onChange={(e) => setEditState((p) => (p ? { ...p, name: e.target.value } : p))}
                    placeholder="Titre"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select
                    value={editState.category}
                    onValueChange={(value) => setEditState((p) => (p ? { ...p, category: value as GalleryCategory } : p))}
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
                  <label className="text-sm font-medium">Remplacer l'image (optionnel)</label>
                  <Input type="file" accept="image/*" onChange={handleEditImageChange} />
                  {editPreview && (
                    <div className="mt-2">
                      <img src={editPreview} alt="Prévisualisation" className="w-full h-56 object-cover rounded border" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>
                Annuler
              </Button>
              <Button type="button" disabled={updateMutation.isPending || !isAdmin || !editState} onClick={submitEdit}>
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

export default function AdminGallery() {
  return (
    <RequireAuth>
      <AdminGalleryContent />
    </RequireAuth>
  );
}
