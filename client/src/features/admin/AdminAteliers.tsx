import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/hooks/use-auth";
import { api } from "@/core/api/api";
import { buildApiUrl } from "@/core/lib/queryClient";
import type { Atelier } from "@shared/schema";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Textarea } from "@/core/ui/textarea";
import { useToast } from "@/core/hooks/use-toast";
import {
  GraduationCap,
  Trash2,
  Calendar as CalendarIcon,
  X,
  Loader2,
  Image as ImageIcon,
  Video,
  Pencil,
} from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/ui/dialog";

interface AtelierFormState {
  name: string;
  description: string;
  duration: string;
  nextSession: string;
  images: File[];
  videos: File[];
}

interface AtelierEditState {
  id: string;
  name: string;
  description: string;
  duration: string;
  nextSession: string;
  newImages: File[];
  newVideos: File[];
}

function AdminAteliersContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === "admin";

  const [createState, setCreateState] = useState<AtelierFormState>({
    name: "",
    description: "",
    duration: "",
    nextSession: "",
    images: [],
    videos: [],
  });

  const [createImagePreviews, setCreateImagePreviews] = useState<string[]>([]);
  const [createVideoPreviews, setCreateVideoPreviews] = useState<string[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState<AtelierEditState | null>(null);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [editVideoPreviews, setEditVideoPreviews] = useState<string[]>([]);

  const { data: ateliers, isLoading } = useQuery<Atelier[]>({
    queryKey: ["admin-ateliers"],
    queryFn: () => api.atelier.list(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non autorisé");

      const formData = new FormData();
      formData.append("name", createState.name);
      formData.append("description", createState.description);
      if (createState.duration) formData.append("duration", createState.duration);
      if (createState.nextSession) formData.append("nextSession", createState.nextSession);
      createState.images.forEach((f) => formData.append("images", f));
      createState.videos.forEach((f) => formData.append("videos", f));

      const url = buildApiUrl("/atelier");
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la création de l'atelier");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Atelier créé" });
      queryClient.invalidateQueries({ queryKey: ["admin-ateliers"] });
      setCreateState({ name: "", description: "", duration: "", nextSession: "", images: [], videos: [] });
      setCreateImagePreviews([]);
      setCreateVideoPreviews([]);
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
    mutationFn: async (payload: AtelierEditState) => {
      if (!token) throw new Error("Non autorisé");

      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("description", payload.description);
      if (payload.duration) formData.append("duration", payload.duration);
      if (payload.nextSession) formData.append("nextSession", payload.nextSession);
      payload.newImages.forEach((f) => formData.append("images", f));
      payload.newVideos.forEach((f) => formData.append("videos", f));

      const url = buildApiUrl(`/atelier/${payload.id}`);
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
      toast({ title: "Atelier modifié" });
      queryClient.invalidateQueries({ queryKey: ["admin-ateliers"] });
      setEditOpen(false);
      setEditState(null);
      setEditImagePreviews([]);
      setEditVideoPreviews([]);
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
      const url = buildApiUrl(`/atelier/${id}`);
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
      toast({ title: "Atelier supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-ateliers"] });
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la suppression",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const onCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setCreateState((p) => ({ ...p, images: [...p.images, ...files] }));

    files.forEach((file) => {
      const r = new FileReader();
      r.onloadend = () => setCreateImagePreviews((prev) => [...prev, r.result as string]);
      r.readAsDataURL(file);
    });
  };

  const onCreateVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setCreateState((p) => ({ ...p, videos: [...p.videos, ...files] }));

    files.forEach((file) => {
      const r = new FileReader();
      r.onloadend = () => setCreateVideoPreviews((prev) => [...prev, r.result as string]);
      r.readAsDataURL(file);
    });
  };

  const removeCreateImage = (index: number) => {
    setCreateState((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
    setCreateImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const removeCreateVideo = (index: number) => {
    setCreateState((p) => ({ ...p, videos: p.videos.filter((_, i) => i !== index) }));
    setCreateVideoPreviews((p) => p.filter((_, i) => i !== index));
  };

  const openEdit = (atelier: Atelier) => {
    setEditState({
      id: atelier.id,
      name: atelier.name,
      description: atelier.description,
      duration: atelier.duration ?? "",
      nextSession: atelier.nextSession ?? "",
      newImages: [],
      newVideos: [],
    });
    setEditImagePreviews([]);
    setEditVideoPreviews([]);
    setEditOpen(true);
  };

  const onEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setEditState((p) => (p ? { ...p, newImages: [...p.newImages, ...files] } : p));

    files.forEach((file) => {
      const r = new FileReader();
      r.onloadend = () => setEditImagePreviews((prev) => [...prev, r.result as string]);
      r.readAsDataURL(file);
    });
  };

  const onEditVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setEditState((p) => (p ? { ...p, newVideos: [...p.newVideos, ...files] } : p));

    files.forEach((file) => {
      const r = new FileReader();
      r.onloadend = () => setEditVideoPreviews((prev) => [...prev, r.result as string]);
      r.readAsDataURL(file);
    });
  };

  const removeEditImage = (index: number) => {
    setEditState((p) => (p ? { ...p, newImages: p.newImages.filter((_, i) => i !== index) } : p));
    setEditImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const removeEditVideo = (index: number) => {
    setEditState((p) => (p ? { ...p, newVideos: p.newVideos.filter((_, i) => i !== index) } : p));
    setEditVideoPreviews((p) => p.filter((_, i) => i !== index));
  };

  const canCreate = useMemo(() => Boolean(createState.name && createState.description), [createState.name, createState.description]);

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
              <GraduationCap className="w-6 h-6 text-primary" />
              Gestion des ateliers
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              L'admin peut ajouter, modifier ou supprimer les ateliers.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Nouvel atelier</h2>
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
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={createState.description} onChange={(e) => setCreateState((p) => ({ ...p, description: e.target.value }))} rows={3} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Durée (optionnel)</label>
                  <Input value={createState.duration} onChange={(e) => setCreateState((p) => ({ ...p, duration: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Prochaine date
                    <CalendarIcon className="w-4 h-4" />
                  </label>
                  <Input type="date" value={createState.nextSession} onChange={(e) => setCreateState((p) => ({ ...p, nextSession: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Images
                    <ImageIcon className="w-4 h-4 opacity-70" />
                  </label>
                  <Input type="file" multiple accept="image/*" onChange={onCreateImageChange} />
                  {createImagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {createImagePreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <img src={src} alt={`img-${idx}`} className="w-full h-24 object-cover rounded border" />
                          <button type="button" onClick={() => removeCreateImage(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Vidéos
                    <Video className="w-4 h-4 opacity-70" />
                  </label>
                  <Input type="file" multiple accept="video/*" onChange={onCreateVideoChange} />
                  {createVideoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {createVideoPreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <video src={src} controls className="w-full h-24 object-cover rounded border" />
                          <button type="button" onClick={() => removeCreateVideo(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={!isAdmin || createMutation.isPending || !canCreate}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {createMutation.isPending ? "Création..." : "Ajouter l'atelier"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Ateliers existants</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !ateliers || ateliers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun atelier pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {ateliers.map((atelier) => (
                    <div key={atelier.id} className="border rounded-md overflow-hidden flex flex-col md:flex-row gap-4">
                      {atelier.images?.[0] && (
                        <div className="w-full md:w-48 lg:w-56 h-40 md:h-auto flex-shrink-0 bg-muted overflow-hidden">
                          <img src={atelier.images[0]} alt={atelier.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3 space-y-2 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{atelier.name}</p>
                            {atelier.duration && <p className="text-xs text-muted-foreground">{atelier.duration}</p>}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{atelier.description}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          {atelier.images && atelier.images.length > 0 && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {atelier.images.length}
                            </span>
                          )}
                          {atelier.videos && atelier.videos.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              {atelier.videos.length}
                            </span>
                          )}
                        </div>
                        {atelier.nextSession && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-auto">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(atelier.nextSession).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                        <div className="flex justify-end pt-2 mt-auto gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8" disabled={!isAdmin} onClick={() => openEdit(atelier)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8" disabled={deleteMutation.isPending || !isAdmin} onClick={() => deleteMutation.mutate(atelier.id)}>
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
            setEditImagePreviews([]);
            setEditVideoPreviews([]);
          }
        }}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier un atelier</DialogTitle>
              <DialogDescription>Vous pouvez modifier les champs, et remplacer les médias en ajoutant de nouveaux fichiers.</DialogDescription>
            </DialogHeader>

            {editState && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nom</label>
                  <Input value={editState.name} onChange={(e) => setEditState((p) => (p ? { ...p, name: e.target.value } : p))} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={editState.description} onChange={(e) => setEditState((p) => (p ? { ...p, description: e.target.value } : p))} rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Durée</label>
                    <Input value={editState.duration} onChange={(e) => setEditState((p) => (p ? { ...p, duration: e.target.value } : p))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Prochaine date</label>
                    <Input type="date" value={editState.nextSession} onChange={(e) => setEditState((p) => (p ? { ...p, nextSession: e.target.value } : p))} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Nouvelles images (optionnel)</label>
                  <Input type="file" multiple accept="image/*" onChange={onEditImageChange} />
                  {editImagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {editImagePreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <img src={src} alt={`edit-img-${idx}`} className="w-full h-24 object-cover rounded border" />
                          <button type="button" onClick={() => removeEditImage(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Nouvelles vidéos (optionnel)</label>
                  <Input type="file" multiple accept="video/*" onChange={onEditVideoChange} />
                  {editVideoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {editVideoPreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <video src={src} controls className="w-full h-24 object-cover rounded border" />
                          <button type="button" onClick={() => removeEditVideo(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
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

export default function AdminAteliers() {
  return (
    <RequireAuth>
      <AdminAteliersContent />
    </RequireAuth>
  );
}
