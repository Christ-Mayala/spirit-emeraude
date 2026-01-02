// shared/schema.ts
import { z } from 'zod';

// Schéma pour le formulaire de contact
export const insertContactMessageSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  phone: z.string().optional()
});

export type ContactFormData = z.infer<typeof insertContactMessageSchema>;

// Schéma pour les produits
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  images: z.array(z.string()),
  inStock: z.boolean(),
  createdAt: z.date()
});

// Schéma utilisateur
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['user', 'admin']),
  createdAt: z.date()
});