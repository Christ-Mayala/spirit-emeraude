import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/hooks/use-auth";
import { api } from "@/core/api/api";
import { buildApiUrl } from "@/core/lib/queryClient";
import type { Impact } from "@shared/schema";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Textarea } from "@/core/ui/textarea";
import { useToast } from "@/core/hooks/use-toast";
import { Heart, Trash2, Upload, MapPin, Calendar as CalendarIcon } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";

interface ImpactFormState {
  name: string;
  description: string;
  date: string;
  location: string;
  images: FileList | null;
}

function AdminImpactsContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<ImpactFormState>({
    name: "",
    description: "",
    date: "",
    location: "",
    images: null,
  });

  const { data: impacts, isLoading } = useQuery<Impact[]>({
    queryKey: ["admin-impacts"],
    queryFn: () => api.impact.list(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non autorisé");

      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("description", formState.description);
      if (formState.date) {
        formData.append("date", formState.date);
      }
      if (formState.location) {
        formData.append("location", formState.location);
      }
      if (formState.images) {
        Array.from(formState.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      const url = buildApiUrl("/impact");
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la création de l'action");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Action sociale créée" });
      queryClient.invalidateQueries({ queryKey: ["admin-impacts"] });
      setFormState({ name: "", description: "", date: "", location: "", images: null });
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
      const url = buildApiUrl(`/impact/${id}`);
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
      toast({ title: "Action sociale supprimée" });
      queryClient.invalidateQueries({ queryKey: ["admin-impacts"] });
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la suppression",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: keyof ImpactFormState, value: unknown) => {
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
              <Heart className="w-6 h-6 text-primary" />
              Gestion de l'impact social
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Créez et gérez les actions sociales visibles sur la page Impact.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Nouvelle action</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Atelier à l'orphelinat..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formState.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    placeholder="Détaillez l'action menée..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Date
                      <CalendarIcon className="w-4 h-4" />
                    </label>
                    <Input
                      type="date"
                      value={formState.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Lieu
                      <MapPin className="w-4 h-4" />
                    </label>
                    <Input
                      value={formState.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="Brazzaville..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Photos
                    <Upload className="w-4 h-4 opacity-70" />
                  </label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleChange("images", e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Les images seront uploadées vers Cloudinary via DryAPI.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || !isAdmin}
                >
                  {createMutation.isPending ? "Création..." : "Ajouter l'action"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Actions existantes</h2>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement des actions...</p>
              ) : !impacts || impacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune action pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {impacts.map((impact) => (
                    <div
                      key={impact.id}
                      className="border rounded-md overflow-hidden flex flex-col md:flex-row gap-4"
                    >
                      {impact.images[0] && (
                        <div className="w-full md:w-48 lg:w-56 h-40 md:h-auto flex-shrink-0 bg-muted overflow-hidden">
                          {/* Image principale renvoyée par DryAPI pour l'impact */}
                          <img
                            src={impact.images[0]}
                            alt={impact.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3 space-y-2 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{impact.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(impact.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            {impact.location && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {impact.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {impact.description}
                        </p>
                        <div className="flex justify-end pt-2 mt-auto">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            disabled={deleteMutation.isPending || !isAdmin}
                            onClick={() => deleteMutation.mutate(impact.id)}
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

export default function AdminImpacts() {
  return (
    <RequireAuth>
      <AdminImpactsContent />
    </RequireAuth>
  );
}
