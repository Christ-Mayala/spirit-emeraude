import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/core/ui/button";
import { Card, CardContent } from "@/core/ui/card";
import { Input } from "@/core/ui/input";
import { Textarea } from "@/core/ui/textarea";
import { useToast } from "@/core/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/ui/form";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Users,
  Target,
  Heart,
  ArrowRight,
  Star,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import {
  insertContactMessageSchema,
  type InsertContactMessage,
} from "@shared/schema";
import { api } from "@/core/api/api";

const WHATSAPP_NUMBER = "242067674083";
const CONTACT_HERO_URL = "https://images.pexels.com/photos/5848509/pexels-photo-5848509.jpeg?auto=compress&cs=tinysrgb&w=1200";

function Counter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <span id={`counter-${end}`} className="inline-block">
      {count}{suffix}
    </span>
  );
}

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [activeStat, setActiveStat] = useState(0);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      await api.contact.send(data);
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const faqItems = [
    { 
      q: "Quels sont les délais de livraison ?", 
      a: "2-7 jours à Brazzaville." 
    },
    { 
      q: "Acceptez-vous les commandes internationales ?", 
      a: "Oui, nous livrons dans toute l'Afrique et Europe." 
    }, 
    { 
      q: "Proposez-vous des réductions pour les groupes ?", 
      a: "Oui, contactez-nous pour les commandes groupées et formations." 
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Optimisée mobile */}
      <section
        className="relative pt-16 pb-12 md:py-28 overflow-hidden"
        data-testid="contact-hero"
      >
        <div className="absolute inset-0">
          <img
            src={CONTACT_HERO_URL}
            alt="Contact Spirit Emeraude"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 md:bg-gradient-to-r md:from-background/95 md:via-background/85 md:to-background/70" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex flex-col items-center md:items-start gap-3 mb-6">
              <div className="relative">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-gold-muted" />
                <Sparkles className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 text-gold-muted" />
              </div>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gold-muted font-medium bg-gold-muted/10 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full">
                Contact
              </span>
            </div>
            
            <h1
              className="font-serif text-3xl md:text-4xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 text-center md:text-left leading-tight"
              data-testid="contact-title"
            >
              Contactez-nous
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-10 text-center md:text-left px-2 md:px-0">
              Une question ? Une commande personnalisée ? Nous sommes à votre écoute.
            </p>

            {/* Statistiques - Stack vertical sur mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
              {[
                { value: 100, suffix: "+", label: "Clients satisfaits", icon: Users, color: "text-gold-muted" },
                { value: 24, suffix: "h", label: "Réponse garantie", icon: Clock, color: "text-primary" },
                { value: 50, suffix: "+", label: "Projets réalisés", icon: Target, color: "text-primary" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-3 md:p-4 rounded-lg border border-border/50 bg-card/50 transition-all duration-500 hover:scale-105 hover:border-gold-muted/30 cursor-pointer ${
                    activeStat === index ? 'ring-1 md:ring-2 ring-gold-muted/30 scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveStat(index)}
                  onClick={() => setActiveStat(index)}
                >
                  <div className="flex justify-center mb-1 md:mb-2">
                    <stat.icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-foreground mb-1">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center md:justify-start">
              <a href="#form-section">
                <Button className="w-full md:w-auto mt-2 text-sm md:text-base">
                  Nous écrire un message
                  <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Layout mobile : vertical stacking, desktop : 3 colonnes */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Colonne des informations de contact */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Carte des coordonnées - Simplifiée mobile */}
            <Card className="border border-border/50 hover:border-gold-muted/30 transition-all duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-4">
                  <div className="w-6 h-1 md:w-8 md:h-1.5 bg-gold-muted rounded-full"></div>
                  <h2 className="font-serif text-lg md:text-xl font-bold text-foreground">
                    Nos Coordonnées
                  </h2>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      icon: <Phone className="w-4 h-4 md:w-5 md:h-5 text-gold-muted" />,
                      title: "Téléphone",
                      content: "+242 06 987 65 43",
                      href: "tel:+242067674083",
                      testId: "contact-phone",
                      bgColor: "bg-gold-muted/10"
                    },
                    {
                      icon: <SiWhatsapp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />,
                      title: "WhatsApp",
                      content: "Réponse rapide",
                      href: `https://wa.me/${WHATSAPP_NUMBER}`,
                      testId: "contact-whatsapp",
                      bgColor: "bg-green-500/10"
                    },
                    {
                      icon: <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />,
                      title: "Email",
                      content: "emeraudekouloufoua22@gmail.com",
                      href: "mailto:emeraudekouloufoua22@gmail.com",
                      testId: "contact-email",
                      bgColor: "bg-primary/10"
                    },
                    {
                      icon: <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />,
                      title: "Adresse",
                      content: "Brazzaville, Congo",
                      href: null,
                      testId: null,
                      bgColor: "bg-primary/10"
                    },
                    {
                      icon: <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />,
                      title: "Horaires",
                      content: "Lun-Sam: 8h-18h",
                      href: null,
                      testId: null,
                      bgColor: "bg-primary/10"
                    }
                  ].map((item, index) => {
                    const content = item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? "_blank" : undefined}
                        rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-3 group/link"
                        data-testid={item.testId}
                      >
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${item.bgColor} flex items-center justify-center flex-shrink-0 transition-transform duration-300`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm md:text-base truncate">
                            {item.title}
                          </p>
                          <p className="text-muted-foreground text-xs md:text-sm truncate">
                            {item.content}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm md:text-base">{item.title}</p>
                          <p className="text-muted-foreground text-xs md:text-sm">{item.content}</p>
                        </div>
                      </div>
                    );

                    return (
                      <div key={index} className="p-2 md:p-3 rounded-lg hover:bg-card/50 transition-colors duration-300">
                        {content}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Carte commande personnalisée */}
            <Card className="bg-gradient-to-br from-gold-muted/10 to-primary/10 border border-gold-muted/20">
              <CardContent className="p-4 md:p-6">
                <div className="relative mb-3 md:mb-4">
                  <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-gold-muted" />
                </div>
                <h3 className="font-serif text-base md:text-lg font-bold text-foreground mb-2 md:mb-3">
                  Commande Personnalisée ?
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                  Discutez de votre projet sur mesure avec nos artisans.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "✨ *DEMANDE COMMANDE PERSONNALISÉE* ✨\n\nBonjour Spirit Emeraude,\nJe souhaiterais discuter d'une création sur mesure.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="default"
                    className="w-full text-sm md:text-base py-2 md:py-3"
                    data-testid="custom-order-button"
                  >
                    <SiWhatsapp className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Carte engagement social - Collapsible sur mobile */}
            <Card className="border border-border/50">
              <CardContent className="p-4 md:p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer md:cursor-default"
                  onClick={() => setIsFAQOpen(!isFAQOpen)}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-1 md:w-8 md:h-1.5 bg-primary rounded-full"></div>
                    <h3 className="font-serif text-base md:text-lg font-bold text-foreground">
                      Notre Engagement
                    </h3>
                  </div>
                  <div className="md:hidden">
                    {isFAQOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                <div className={`${isFAQOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-4`}>
                  <ul className="space-y-2 md:space-y-3">
                    {[
                      "Soutien aux femmes entrepreneures",
                      "Formations artisanales gratuites",
                      "Reversement aux orphelinats",
                      "Production éco-responsable"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 md:gap-3">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-2 h-2 md:w-3 md:h-3 text-primary" />
                        </div>
                        <span className="text-xs md:text-sm text-foreground/80 flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne du formulaire */}
          <div className="lg:col-span-2" id="form-section">
            <Card className="border border-border/50">
              <CardContent className="p-4 md:p-6 lg:p-8">
                {submitted ? (
                  <div
                    className="flex flex-col items-center justify-center py-8 md:py-12 text-center"
                    data-testid="success-message"
                  >
                    <div className="relative mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">
                      Message Envoyé !
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8 max-w-md px-2">
                      Merci pour votre message. Notre équipe vous répondra rapidement.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                      <Button
                        variant="outline"
                        onClick={() => setSubmitted(false)}
                        data-testid="button-send-another"
                        className="flex-1"
                      >
                        <Send className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Autre message
                      </Button>
                      <a 
                        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="ghost" className="w-full text-gold-muted hover:text-primary">
                          <SiWhatsapp className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                          WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                      <div className="w-6 h-1 md:w-8 md:h-1.5 bg-gold-muted rounded-full"></div>
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                        Envoyez-nous un Message
                      </h2>
                    </div>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 md:space-y-6"
                        data-testid="contact-form"
                      >
                        {/* Nom et Téléphone en colonne sur mobile, ligne sur desktop */}
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm md:text-base">
                                  Nom complet <span className="text-gold-muted">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Votre nom"
                                    {...field}
                                    className="text-sm md:text-base h-10 md:h-11"
                                    data-testid="input-name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm md:text-base">
                                  Téléphone <span className="text-gold-muted">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+242 06 xxx xx xx"
                                    type="tel"
                                    {...field}
                                    className="text-sm md:text-base h-10 md:h-11"
                                    data-testid="input-phone"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Email et Sujet */}
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm md:text-base">Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="votre@email.com"
                                    type="email"
                                    {...field}
                                    className="text-sm md:text-base h-10 md:h-11"
                                    data-testid="input-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm md:text-base">Sujet</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Objet de votre message"
                                    {...field}
                                    className="text-sm md:text-base h-10 md:h-11"
                                    data-testid="input-subject"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Message - Pleine largeur */}
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm md:text-base">
                                Message <span className="text-gold-muted">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Votre message..."
                                  rows={5}
                                  {...field}
                                  className="text-sm md:text-base resize-none min-h-[120px] md:min-h-[150px]"
                                  data-testid="input-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Bouton d'envoi */}
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
                          <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
                            * Champs obligatoires
                          </p>
                          <Button
                            type="submit"
                            className="w-full sm:w-auto text-sm md:text-base py-2 md:py-3 px-6 md:px-8"
                            disabled={mutation.isPending}
                            data-testid="submit-button"
                          >
                            {mutation.isPending ? (
                              <>
                                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Envoi...
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                Envoyer le Message
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section - Accordéon sur mobile */}
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="font-serif text-lg md:text-xl font-bold text-foreground">
                  Questions fréquentes
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-xs"
                  onClick={() => setActiveFAQ(activeFAQ === null ? 0 : null)}
                >
                  {activeFAQ !== null ? 'Réduire' : 'Développer'}
                </Button>
              </div>
              
              <div className="space-y-2 md:space-y-4">
                {faqItems.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`border border-border/50 rounded-lg overflow-hidden transition-all duration-300 ${
                      activeFAQ === index ? 'border-gold-muted/30' : ''
                    }`}
                  >
                    <button
                      className="w-full p-3 md:p-4 text-left flex items-center justify-between hover:bg-card/50 transition-colors"
                      onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                    >
                      <div className="flex items-center gap-2 md:gap-3 flex-1">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gold-muted/10 flex items-center justify-center flex-shrink-0">
                          <Star className="w-2 h-2 md:w-3 md:h-3 text-gold-muted" />
                        </div>
                        <span className="font-medium text-foreground text-sm md:text-base flex-1 text-left">
                          {faq.q}
                        </span>
                      </div>
                      <div className="md:hidden ml-2">
                        {activeFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    
                    {/* Réponse visible sur desktop, toggle sur mobile */}
                    <div 
                      className={`px-4 pb-3 md:pb-4 md:px-6 ${
                        activeFAQ === index ? 'block' : 'hidden md:block'
                      }`}
                      style={{ marginLeft: '2.5rem' }}
                    >
                      <p className="text-muted-foreground text-xs md:text-sm">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button - Plus petit sur mobile */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            size="lg"
            className="rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white h-12 w-12 md:h-14 md:w-auto md:px-4"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden md:inline ml-2">WhatsApp</span>
          </Button>
        </a>
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        
        /* Amélioration du touch target pour mobile */
        @media (max-width: 768px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
          
          input, textarea {
            font-size: 16px; /* Empêche le zoom sur iOS */
          }
        }
      `}</style>
    </div>
  );
}