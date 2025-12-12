import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/hooks/use-auth";
import { buildApiUrl } from "@/core/lib/queryClient";
import type { ContactMessage } from "@shared/schema";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Badge } from "@/core/ui/badge";
import { useToast } from "@/core/hooks/use-toast";
import { Mail, Phone, MapPin, Eye, Trash2 } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";

function AdminContactMessagesContent() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      if (!token) throw new Error("Non autorisé");
      const url = buildApiUrl("/contact");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      let json: any;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(text || "Réponse invalide du serveur");
      }

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Erreur lors de la récupération des messages");
      }

      const data = (json.data || []) as any[];
      return data.map((m) => ({ ...m, id: m.id ?? m._id })) as ContactMessage[];
    },
  });

  // Optionnel : mutation pour marquer comme lu/supprimer si tu ajoutes les endpoints
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Non autorisé");
      const url = buildApiUrl(`/contact/${id}`);
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      let json: any;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(text || "Réponse invalide du serveur");
      }

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Erreur lors de la suppression du message");
      }
    },
    onSuccess: () => {
      toast({ title: "Message supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
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

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-2">
          <h1 className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Messagerie de contact
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Consultez les messages envoyés depuis le formulaire de contact du site.
          </p>
        </header>

        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Chargement des messages...</p>
            ) : !messages || messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun message reçu pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border rounded-md p-3 md:p-4 flex flex-col gap-2"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{msg.name}</span>
                          <Badge variant="outline" className="text-[11px]">
                            {msg.subject || "Sans sujet"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {msg.phone}
                          </span>
                          {msg.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {msg.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Reçu le {" "}
                            {new Date().toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start md:self-auto">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          disabled={deleteMutation.isPending || !isAdmin}
                          onClick={() => deleteMutation.mutate(msg.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground whitespace-pre-line">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminContactMessages() {
  return (
    <RequireAuth>
      <AdminContactMessagesContent />
    </RequireAuth>
  );
}
