import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/hooks/use-auth";
import { api } from "@/core/api/api";
import { buildApiUrl } from "@/core/lib/queryClient";
import type { Formation } from "@shared/schema";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Textarea } from "@/core/ui/textarea";
import { useToast } from "@/core/hooks/use-toast";
import { GraduationCap, Trash2, Upload, Calendar as CalendarIcon } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";

interface FormationFormState {
  name: string;
  description: string;
  duration: string;
  price: string;
  materials: string;
  nextSession: string;
  image: File | null;
}

function AdminFormationsContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<FormationFormState>({
    name: "",
    description: "",
    duration: "",
    price: "",
    materials: "",
    nextSession: "",
    image: null,
  });

  const { data: formations, isLoading } = useQuery<Formation[]>({
    queryKey: ["admin-formations"],
    queryFn: () => api.formation.list(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non autorisé");

      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("description", formState.description);
      formData.append("duration", formState.duration);
      formData.append("price", formState.price);
      formData.append("materials", formState.materials);
      if (formState.nextSession) {
        formData.append("nextSession", formState.nextSession);
      }
      if (formState.image) {
        formData.append("image", formState.image);
      }

      const url = buildApiUrl("/formation");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la création de la formation");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Formation créée" });
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
      setFormState({
        name: "",
        description: "",
        duration: "",
        price: "",
        materials: "",
        nextSession: "",
        image: null,
      });
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
      const url = buildApiUrl(`/formation/${id}`);
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
      toast({ title: "Formation supprimée" });
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
    },
    onError: (err: unknown) => {
      toast({
        title: "Erreur lors de la suppression",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: keyof FormationFormState, value: unknown) => {
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
              <GraduationCap className="w-6 h-6 text-primary" />
              Gestion des formations
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Créez et gérez les ateliers de Spirit Emeraude exposés sur le frontend.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
          <Card className="order-2 lg:order-1">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Nouvelle formation</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nom de la formation"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formState.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    placeholder="Description détaillée..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Durée</label>
                    <Input
                      value={formState.duration}
                      onChange={(e) => handleChange("duration", e.target.value)}
                      placeholder="5 jours (35h)"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Prix (FCFA)</label>
                    <Input
                      type="number"
                      value={formState.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      placeholder="85000"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Matériel</label>
                  <Input
                    value={formState.materials}
                    onChange={(e) => handleChange("materials", e.target.value)}
                    placeholder="Tout le matériel inclus"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Prochaine session
                      <CalendarIcon className="w-4 h-4" />
                    </label>
                    <Input
                      type="date"
                      value={formState.nextSession}
                      onChange={(e) => handleChange("nextSession", e.target.value)}
                    />
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
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || !isAdmin}
                >
                  {createMutation.isPending ? "Création..." : "Ajouter la formation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Formations existantes</h2>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement des formations...</p>
              ) : !formations || formations.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune formation pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {formations.map((formation) => (
                    <div
                      key={formation.id}
                      className="border rounded-md overflow-hidden flex flex-col md:flex-row gap-4"
                    >
                      {formation.image && (
                        <div className="w-full md:w-48 lg:w-56 h-40 md:h-auto flex-shrink-0 bg-muted overflow-hidden">
                          {/* Image dynamique renvoyée par DryAPI pour la formation */}
                          <img
                            src={formation.image}
                            alt={formation.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3 space-y-2 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{formation.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formation.duration} • {formation.materials}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gold-muted">
                            {formation.price.toLocaleString("fr-FR")} FCFA
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {formation.description}
                        </p>
                        {formation.nextSession && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-auto">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(formation.nextSession).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                        <div className="flex justify-end pt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            disabled={deleteMutation.isPending || !isAdmin}
                            onClick={() => deleteMutation.mutate(formation.id)}
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

export default function AdminFormations() {
  return (
    <RequireAuth>
      <AdminFormationsContent />
    </RequireAuth>
  );
}
