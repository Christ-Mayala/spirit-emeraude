import { z } from "zod";

export const productCategoryEnum = z.enum(['sac', 'trousse', 'sandale', 'accessoire', 'personnalise', 'saisonnier']);
export type ProductCategory = z.infer<typeof productCategoryEnum>;

export const galleryCategoryEnum = z.enum(['atelier', 'creation', 'humanitaire', 'autre']);
export type GalleryCategory = z.infer<typeof galleryCategoryEnum>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: productCategoryEnum,
  price: z.number(),
  description: z.string(),
  images: z.array(z.string()),
  isFeatured: z.boolean(),
  inStock: z.boolean(),
  slug: z.string(),
});

export const insertProductSchema = productSchema.omit({ id: true });
export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export const formationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  price: z.number(),
  materials: z.string(),
  image: z.string().optional(),
  nextSession: z.string().optional(),
});

export const insertFormationSchema = formationSchema.omit({ id: true });
export type Formation = z.infer<typeof formationSchema>;
export type InsertFormation = z.infer<typeof insertFormationSchema>;

export const impactSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  date: z.string(),
  location: z.string().optional(),
});

export const insertImpactSchema = impactSchema.omit({ id: true });
export type Impact = z.infer<typeof impactSchema>;
export type InsertImpact = z.infer<typeof insertImpactSchema>;

export const galleryPhotoSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  category: galleryCategoryEnum,
  imageUrl: z.string(),
});

export const insertGalleryPhotoSchema = galleryPhotoSchema.omit({ id: true });
export type GalleryPhoto = z.infer<typeof galleryPhotoSchema>;
export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;

export const contactMessageSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export const insertContactMessageSchema = contactMessageSchema.omit({ id: true });
export type ContactMessage = z.infer<typeof contactMessageSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: { page: number; limit: number; total: number };
}
