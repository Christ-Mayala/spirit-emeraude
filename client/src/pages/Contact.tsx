import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const WHATSAPP_NUMBER = "242069876543";

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

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
      const response = await apiRequest("POST", "/api/contact", data);
      return response;
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

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm uppercase tracking-widest text-gold-muted font-medium mb-4">
            Spirit Emeraude
          </span>
          <h1 
            className="font-serif text-4xl md:text-5xl font-bold text-foreground"
            data-testid="contact-title"
          >
            Contactez-nous
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Une question ? Une commande personnalisée ? Nous sommes à votre écoute. 
            N'hésitez pas à nous contacter par le moyen qui vous convient le mieux.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Nos Coordonnées
                </h2>

                <div className="space-y-4">
                  <a
                    href="tel:+242069876543"
                    className="flex items-start gap-4 group"
                    data-testid="contact-phone"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Téléphone
                      </p>
                      <p className="text-muted-foreground text-sm">
                        +242 06 987 65 43
                      </p>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                    data-testid="contact-whatsapp"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <SiWhatsapp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-green-600 transition-colors">
                        WhatsApp
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Réponse rapide garantie
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:contact@spiritemeraude.com"
                    className="flex items-start gap-4 group"
                    data-testid="contact-email"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Email
                      </p>
                      <p className="text-muted-foreground text-sm">
                        contact@spiritemeraude.com
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Adresse
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Brazzaville, République du Congo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Horaires
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Lun - Sam : 8h00 - 18h00
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <MessageCircle className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="font-serif text-lg font-bold mb-2">
                  Commande Personnalisée ?
                </h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Vous avez une idée précise en tête ? Contactez-nous pour discuter 
                  de votre projet sur mesure.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour, j'aimerais discuter d'une commande personnalisée.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    data-testid="custom-order-button"
                  >
                    <SiWhatsapp className="w-4 h-4 mr-2" />
                    Discuter sur WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              {submitted ? (
                <div 
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-testid="success-message"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    Message Envoyé !
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    data-testid="button-send-another"
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                    Envoyez-nous un Message
                  </h2>

                  <Form {...form}>
                    <form 
                      onSubmit={form.handleSubmit(onSubmit)} 
                      className="space-y-4"
                      data-testid="contact-form"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Votre nom" 
                                {...field} 
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="+242 06 xxx xx xx" 
                                  type="tel"
                                  {...field} 
                                  data-testid="input-phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="votre@email.com" 
                                  type="email"
                                  {...field} 
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sujet</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Objet de votre message" 
                                {...field} 
                                data-testid="input-subject"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Votre message..."
                                rows={5}
                                {...field} 
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full uppercase tracking-wider font-medium"
                        disabled={mutation.isPending}
                        data-testid="submit-button"
                      >
                        {mutation.isPending ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer le Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
