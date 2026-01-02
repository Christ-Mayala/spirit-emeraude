import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Sparkles, ShoppingBag, GraduationCap, Heart, Images, MessageCircle, Home, LogOut, User } from "lucide-react";
import { Button } from "@/core/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/core/ui/sheet";
import { useAuth } from "@/core/hooks/use-auth";
import { Badge } from "@/core/ui/badge";

const publicNavLinks = [
  {
    href: "/",
    label: "Accueil",
    icon: <Home className="w-4 h-4" />,
    description: "Page d'accueil"
  },
  {
    href: "/boutique",
    label: "Boutique",
    icon: <ShoppingBag className="w-4 h-4" />,
    description: "Nos créations"
  },
  {
    href: "/ateliers",
    label: "Ateliers",
    icon: <GraduationCap className="w-4 h-4" />,
    description: "Prochains ateliers"
  },
  {
    href: "/impact",
    label: "Impact",
    icon: <Heart className="w-4 h-4" />,
    description: "Impact Social"
  },
  {
    href: "/galerie",
    label: "Galerie",
    icon: <Images className="w-4 h-4" />,
    description: "Galerie Photos"
  },
  {
    href: "/contact",
    label: "Contact",
    icon: <MessageCircle className="w-4 h-4" />,
    description: "Contactez-nous"
  },
];

const adminNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
  { href: "/dashboard/products", label: "Produits", icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/dashboard/ateliers", label: "Ateliers", icon: <GraduationCap className="w-4 h-4" /> },
  { href: "/dashboard/impacts", label: "Impact", icon: <Heart className="w-4 h-4" /> },
  { href: "/dashboard/gallery", label: "Galerie", icon: <Images className="w-4 h-4" /> },
  { href: "/dashboard/contact-messages", label: "Messages", icon: <MessageCircle className="w-4 h-4" /> },
];

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const isDashboard = location.startsWith("/dashboard");
  const isAdmin = isAuthenticated && user?.role === "admin";
  const links = isDashboard && isAdmin ? adminNavLinks : publicNavLinks;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
      <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
              isScrolled
                  ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg"
                  : "bg-transparent"
          }`}
          data-testid="header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo avec effet spécial - TAILLE RAISONNABLE */}
            <Link href={isDashboard && isAdmin ? "/dashboard" : "/"}>
              <div className="flex items-center gap-2 group cursor-pointer" data-testid="logo">
                {/* Logo conteneur avec taille adaptée */}
                <div className="relative">
                  <img
                      src="/logo.png"
                      alt="Spirit KES Logo"
                      className="w-10 h-10 object-cover rounded-full scale-125 shadow-md"
                  />
                  <div className="absolute -inset-3 bg-primary/5 rounded-full blur"></div>
                </div>

                {/* Texte à côté du logo */}
                <div className="flex flex-col">
                  <h1 className="font-serif text-base md:text-lg font-bold tracking-wide text-primary leading-tight">
                    Spirit KES
                  </h1>
                  <p className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-widest">
                    Artisanat & Autonomisation
                  </p>
                </div>
              </div>
            </Link>

            {/* Navigation Desktop - Avec séparateur central */}
            <div className="hidden lg:flex items-center">
              {/* Liens gauche */}
              <nav className="flex items-center gap-1">
                {links.slice(0, 3).map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div
                          className={`relative px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer group ${
                              isActive(link.href)
                                  ? "text-primary bg-primary/5"
                                  : "text-foreground/70 hover:text-foreground hover:bg-card"
                          }`}
                          data-testid={`nav-link-${link.label.toLowerCase()}`}
                      >
                    <span className="text-sm font-medium tracking-wide flex items-center gap-2">
                      {link.icon}
                      {link.label}
                    </span>
                        {isActive(link.href) && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold-muted rounded-full"></div>
                        )}
                      </div>
                    </Link>
                ))}
              </nav>

              {/* Logo central décoratif */}
              <div className="mx-6 px-4 border-x border-border/30">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gold-muted to-primary animate-pulse"></div>
              </div>

              {/* Liens droite */}
              <nav className="flex items-center gap-1">
                {links.slice(3).map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div
                          className={`relative px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer group ${
                              isActive(link.href)
                                  ? "text-primary bg-primary/5"
                                  : "text-foreground/70 hover:text-foreground hover:bg-card"
                          }`}
                          data-testid={`nav-link-${link.label.toLowerCase()}`}
                      >
                    <span className="text-sm font-medium tracking-wide flex items-center gap-2">
                      {link.icon}
                      {link.label}
                    </span>
                        {isActive(link.href) && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold-muted rounded-full"></div>
                        )}
                      </div>
                    </Link>
                ))}

                {/* Badge Admin ou Déconnexion */}
                {isDashboard && isAdmin && (
                    <div className="ml-4 flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs">
                        <User className="w-3 h-3" />
                        <span className="font-medium">Admin</span>
                      </div>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={logout}
                          className="text-xs"
                      >
                        <LogOut className="w-3 h-3 mr-1" />
                        Déconnexion
                      </Button>
                    </div>
                )}
              </nav>
            </div>

            {/* Navigation Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              {isDashboard && isAdmin && (
                  <Badge variant="outline" className="text-xs mr-2">
                    Admin
                  </Badge>
              )}

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                      variant={isScrolled ? "default" : "ghost"}
                      size="icon"
                      className={`rounded-full transition-all duration-300 ${
                          isScrolled ? 'shadow-md' : ''
                      }`}
                      data-testid="mobile-menu-trigger"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className="w-full max-w-sm bg-background border-l border-border/50"
                >
                  <div className="flex flex-col h-full">
                    {/* Header du menu mobile */}
                    <div className="p-6 border-b border-border/50">
                      <Link href={isDashboard && isAdmin ? "/dashboard" : "/"}>
                        <div className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                          {/* Logo dans menu mobile */}
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-muted to-primary p-0.5 flex items-center justify-center">
                            <div className="w-full h-full bg-white dark:bg-gray-900 rounded flex items-center justify-center p-1">
                              <img
                                  src="/logo.png"
                                  alt="Logo Spirit KES"
                                  className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          <div>
                            <h2 className="font-serif text-lg font-bold text-primary">
                              Spirit KES
                            </h2>
                            <p className="text-xs text-muted-foreground">Artisanat Congolais</p>
                          </div>
                        </div>
                      </Link>

                      {isDashboard && isAdmin && (
                          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">
                              {user?.email || 'Administrateur'}
                            </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            </div>
                          </div>
                      )}
                    </div>

                    {/* Navigation mobile */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-1">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href}>
                              <div
                                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                      isActive(link.href)
                                          ? "bg-primary/10 text-primary border-l-4 border-gold-muted"
                                          : "hover:bg-card text-foreground/70 hover:text-foreground"
                                  }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                              >
                                <div className={`p-2 rounded-md ${
                                    isActive(link.href)
                                        ? "bg-primary/20"
                                        : "bg-card"
                                }`}>
                                  {link.icon}
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium block">{link.label}</span>
                                  {('description' in link) && (
                                      <span className="text-xs text-muted-foreground block">
                                  {(link as any).description}
                                </span>
                                  )}
                                </div>
                                {isActive(link.href) && (
                                    <div className="w-2 h-2 rounded-full bg-gold-muted animate-pulse"></div>
                                )}
                              </div>
                            </Link>
                        ))}
                      </div>

                      {/* Déconnexion en bas du menu mobile */}
                      {isDashboard && isAdmin && (
                          <div className="mt-8 pt-6 border-t border-border/50">
                            <Button
                                variant="outline"
                                className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  logout();
                                  setMobileMenuOpen(false);
                                }}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Déconnexion
                            </Button>
                          </div>
                      )}
                    </nav>

                    {/* Footer du menu mobile */}
                    <div className="p-4 border-t border-border/50">
                      <p className="text-xs text-center text-muted-foreground">
                        © {new Date().getFullYear()} Spirit KES
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Indicateur de scroll progressif */}
        {isScrolled && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold-muted via-primary to-gold-muted animate-pulse"
                 style={{
                   width: `${Math.min((window.scrollY / 300) * 100, 100)}%`
                 }}
            />
        )}
      </header>
  );
}