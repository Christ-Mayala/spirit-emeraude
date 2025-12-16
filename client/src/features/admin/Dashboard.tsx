import { Link } from "wouter";
import { Card, CardContent } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Package, GraduationCap, Images, Heart, Mail } from "lucide-react";
import RequireAuth from "@/features/auth/RequireAuth";

function DashboardContent() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Tableau de bord Spirit Emeraude
          </h1>
          <p className="text-muted-foreground">
            Gérez les contenus métiers exposés à vos clients : produits, ateliers,
            impact social, galerie et messages de contact.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              <Package className="w-6 h-6 text-primary" />
              <h2 className="font-semibold">Produits</h2>
              <p className="text-sm text-muted-foreground">
                CRUD complet des produits de la boutique.
              </p>
              <Link href="/dashboard/products">
                <Button size="sm" variant="outline">
                  Gérer les produits
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h2 className="font-semibold">Ateliers</h2>
              <p className="text-sm text-muted-foreground">
                Gérer les ateliers, images, vidéos et réalisations.
              </p>
              <Link href="/dashboard/ateliers">
                <Button size="sm" variant="outline">
                  Gérer les ateliers
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="font-semibold">Impact Social</h2>
              <p className="text-sm text-muted-foreground">
                CRUD des actions d'impact et des visuels associés.
              </p>
              <Link href="/dashboard/impacts">
                <Button size="sm" variant="outline">
                  Gérer l'impact
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Images className="w-6 h-6 text-primary" />
              <h2 className="font-semibold">Galerie</h2>
              <p className="text-sm text-muted-foreground">
                Gérer les médias de la galerie.
              </p>
              <Link href="/dashboard/gallery">
                <Button size="sm" variant="outline">
                  Gérer la galerie
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="font-semibold">Messages de contact</h2>
              <p className="text-sm text-muted-foreground">
                Consulter les messages reçus depuis le site.
              </p>
              <Link href="/dashboard/contact-messages">
                <Button size="sm" variant="outline">
                  Voir les messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
