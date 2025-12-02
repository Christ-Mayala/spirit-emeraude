import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/formations", label: "Formations" },
  { href: "/impact", label: "Impact" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-border/50"
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.slice(0, 3).map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm uppercase tracking-widest font-medium transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <Link href="/">
            <h1 
              className="font-serif text-xl md:text-2xl font-bold tracking-wide text-primary cursor-pointer"
              data-testid="logo"
            >
              SPIRIT EMERAUDE
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.slice(3).map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm uppercase tracking-widest font-medium transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                data-testid="mobile-menu-trigger"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/">
                  <h2 
                    className="font-serif text-xl font-bold text-primary cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    SPIRIT EMERAUDE
                  </h2>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`text-base uppercase tracking-wider font-medium transition-colors cursor-pointer block py-2 ${
                          isActive(link.href)
                            ? "text-primary"
                            : "text-foreground/70 hover:text-foreground"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
