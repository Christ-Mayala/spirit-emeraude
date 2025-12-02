import { Link } from "wouter";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";

const quickLinks = [
  { href: "/boutique", label: "Boutique" },
  { href: "/formations", label: "Formations" },
  { href: "/impact", label: "Impact Social" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "242069876543";

  return (
    <footer 
      className="bg-[#1f2937] text-white/90"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              Spirit Emeraude Création
            </h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Marque artisanale de luxe africaine. Nous créons des pièces uniques 
              en pagne tout en formant les femmes à l'autonomie financière.
            </p>
            <p className="text-sm italic text-gold-muted">
              "Former pour libérer l'avenir"
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="WhatsApp"
                data-testid="footer-whatsapp"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
                data-testid="footer-instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
                data-testid="footer-facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white">
              Liens Rapides
            </h4>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="text-white/70 hover:text-white transition-colors text-sm cursor-pointer"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+242069876543"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
                data-testid="footer-phone"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+242 06 987 65 43</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
                data-testid="footer-whatsapp-link"
              >
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:contact@spiritemeraude.com"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
                data-testid="footer-email"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contact@spiritemeraude.com</span>
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Brazzaville, République du Congo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-white/50 text-sm">
            &copy; {currentYear} Spirit Emeraude Création. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
