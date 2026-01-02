import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/core/hooks/use-toast";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Heart,
  Award,
  Users,
  ChevronRight,
  Target,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook, SiTiktok } from "react-icons/si";

const quickLinks = [
  {
    href: "/boutique",
    label: "Boutique",
    icon: <Sparkles className="w-3 h-3" />,
  },
  {
    href: "/ateliers",
    label: "Ateliers",
    icon: <Award className="w-3 h-3" />,
  },
  {
    href: "/impact",
    label: "Impact Social",
    icon: <Heart className="w-3 h-3" />,
  },
  { href: "/galerie", label: "Galerie", icon: <Target className="w-3 h-3" /> },
  {
    href: "/contact",
    label: "Contact",
    icon: <MessageCircle className="w-3 h-3" />,
  },
];

const socialLinks = [
  {
    href: "https://wa.me/242067674083",
    icon: <SiWhatsapp className="h-5 w-5" />,
    label: "WhatsApp",
    color: "text-green-400 hover:text-green-300",
  },
  {
    href: "#",
    icon: <SiInstagram className="h-5 w-5" />,
    label: "Instagram",
    color: "text-pink-400 hover:text-pink-300",
  },
  {
    href: "#",
    icon: <SiFacebook className="h-5 w-5" />,
    label: "Facebook",
    color: "text-blue-400 hover:text-blue-300",
  },
  {
    href: "#",
    icon: <SiTiktok className="h-5 w-5" />,
    label: "TikTok",
    color: "text-gray-300 hover:text-white",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "242067674083";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler l'envoi d'email - À adapter avec votre backend
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");

        toast({
          title: "Inscription réussie !",
          description: "Merci de vous être abonné à notre newsletter",
        });

        // Réinitialiser après 5 secondes
        setTimeout(() => {
          setIsSubscribed(false);
        }, 5000);
      } else {
        throw new Error("Échec de l'inscription");
      }
    } catch (error) {
      // En cas d'erreur, envoyer un email directement
      const subject = encodeURIComponent("Nouvel abonné à la newsletter");
      const body = encodeURIComponent(
        `Nouvel abonné à la newsletter:\n\nEmail: ${email}\n\nDate: ${new Date().toLocaleDateString(
          "fr-FR"
        )}`
      );

      window.open(
        `mailto:emeraudekouloufoua22@gmail.com?subject=${subject}&body=${body}`,
        "_blank"
      );

      setIsSubscribed(true);
      setEmail("");

      toast({
        title: "Inscription envoyée !",
        description: "Votre inscription a été enregistrée",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      className="bg-[#0f172a] text-white/90 border-t border-white/10"
      data-testid="footer"
    >
      {/* Section supérieure avec statistiques */}
      <div className="bg-gradient-to-r from-gold-muted/10 via-primary/10 to-gold-muted/10 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 md:py-8">
            {[
              {
                value: "40+",
                label: "Femmes formées",
                icon: <Users className="w-5 h-5" />,
              },
              {
                value: "100+",
                label: "Produits vendus",
                icon: <Award className="w-5 h-5" />,
              },
              {
                value: "1",
                label: "Orphelinat soutenus",
                icon: <Heart className="w-5 h-5" />,
              },
              {
                value: "∞",
                label: "Sourires créés",
                icon: <Sparkles className="w-5 h-5" />,
              },
            ].map((stat, index) => (
              <div key={index} className="text-center p-3">
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-full bg-gradient-to-br from-gold-muted/20 to-primary/20 border border-white/10">
                    <div className="text-gold-muted">{stat.icon}</div>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal du footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Colonne de gauche : Logo et mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                    src="/logo.png"
                    alt="Spirit KES Logo"
                    className="w-16 h-16 object-cover rounded-full scale-125 shadow-md"
                />
                <div className="absolute -inset-3 bg-primary/5 rounded-full blur"></div>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Spirit KES
                </h3>
                <p className="text-sm text-white/60 uppercase tracking-widest">
                  Création & Autonomisation
                </p>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed max-w-xl">
              Marque artisanale de luxe africaine, alliant savoir-faire
              traditionnel et design contemporain. Chaque création raconte une
              histoire et contribue à l'autonomisation des femmes et au soutien
              des enfants vulnérables.
            </p>

            <div className="p-4 rounded-lg bg-gradient-to-r from-gold-muted/10 to-primary/10 border border-gold-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-muted/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-gold-muted" />
                </div>
                <p className="text-sm text-white/80 italic">
                  "Former pour libérer, créer pour inspirer"
                </p>
              </div>
            </div>

            {/* Newsletter avec bouton vert */}
            <div className="pt-4">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Restez informés
              </h4>
              {isSubscribed ? (
                <div className="p-4 rounded-lg bg-green-600/10 border border-green-600/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">
                        Inscription réussie !
                      </p>
                      <p className="text-white/70 text-sm">
                        Merci de vous être abonné à notre newsletter
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all duration-300"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Envoi...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          <span>S'abonner</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-white/50">
                    Recevez nos nouveautés, promotions et actualités. Pas de
                    spam.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Colonne de droite : Liens et contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Liens rapides */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-muted" />
                Navigation
              </h4>
              <nav className="space-y-2">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-pointer">
                      <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-gold-muted/20 transition-colors">
                        <div className="text-gold-muted">{link.icon}</div>
                      </div>
                      <span className="text-white/80 group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                      <ChevronRight className="w-3 h-3 ml-auto text-white/40 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all" />
                    </div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact et réseaux sociaux */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                Contact
              </h4>

              <div className="space-y-3">
                {[
                  {
                    icon: <Phone className="w-4 h-4" />,
                    content: "+242 06 987 65 43",
                    href: "tel:+242067674083",
                    testId: "footer-phone",
                  },
                  {
                    icon: <Mail className="w-4 h-4" />,
                    content: "emeraudekouloufoua22@gmail.com",
                    href: "mailto:emeraudekouloufoua22@gmail.com",
                    testId: "footer-email",
                  },
                  {
                    icon: <MapPin className="w-4 h-4" />,
                    content: "Brazzaville, République du Congo",
                    href: null,
                    testId: null,
                  },
                ].map((item, index) =>
                  item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 group"
                      data-testid={item.testId}
                    >
                      <div className="p-1.5 rounded-md bg-white/10 group-hover:bg-primary/30 transition-colors">
                        <div className="text-primary">{item.icon}</div>
                      </div>
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                        {item.content}
                      </span>
                    </a>
                  ) : (
                    <div key={index} className="flex items-start gap-3 p-2">
                      <div className="p-1.5 rounded-md bg-white/10 mt-0.5">
                        <div className="text-primary">{item.icon}</div>
                      </div>
                      <span className="text-sm text-white/80">
                        {item.content}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Réseaux sociaux */}
              <div className="pt-4">
                <h5 className="font-medium text-white mb-3">Suivez-nous</h5>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-gold-muted/30 transition-all duration-300 hover:scale-110 ${social.color}`}
                      aria-label={social.label}
                      data-testid={`footer-${social.label.toLowerCase()}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Bouton WhatsApp principal */}
              <div className="pt-4">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  data-testid="footer-whatsapp-link"
                >
                  <SiWhatsapp className="h-5 w-5" />
                  <span>Discuter sur WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-white/50">
              &copy; {currentYear} Spirit KES. Tous droits
              réservés.
            </p>

            <div className="flex items-center gap-6 text-sm text-white/50">
              <a
                href="https://cyberfusion-group.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
              >
                Développé par Server Gold | <strong>CyberFusion Gourp</strong>
              </a>
            </div>
          </div>

          {/* Note supplémentaire */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/40">
              ❤️ Fabriqué avec amour au Congo • Chaque achat soutient
              l'autonomisation des femmes
            </p>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-30 p-2.5 rounded-full bg-gold-muted text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Retour en haut"
      >
        <ArrowRight className="w-5 h-5 transform -rotate-90" />
      </button>
    </footer>
  );
}
