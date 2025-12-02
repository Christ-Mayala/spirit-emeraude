import { randomUUID } from "crypto";
import type {
  Product,
  InsertProduct,
  Formation,
  InsertFormation,
  Impact,
  InsertImpact,
  GalleryPhoto,
  InsertGalleryPhoto,
  ContactMessage,
  InsertContactMessage,
} from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  getFormations(): Promise<Formation[]>;
  getFormation(id: string): Promise<Formation | undefined>;
  createFormation(formation: InsertFormation): Promise<Formation>;

  getImpacts(): Promise<Impact[]>;
  getImpact(id: string): Promise<Impact | undefined>;
  createImpact(impact: InsertImpact): Promise<Impact>;

  getGalleryPhotos(): Promise<GalleryPhoto[]>;
  getGalleryPhotosByCategory(category: string): Promise<GalleryPhoto[]>;
  createGalleryPhoto(photo: InsertGalleryPhoto): Promise<GalleryPhoto>;

  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private formations: Map<string, Formation>;
  private impacts: Map<string, Impact>;
  private galleryPhotos: Map<string, GalleryPhoto>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.products = new Map();
    this.formations = new Map();
    this.impacts = new Map();
    this.galleryPhotos = new Map();
    this.contactMessages = new Map();

    this.seedData();
  }

  private seedData() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Sac Élégance Pagne",
        category: "sac",
        price: 45000,
        description: "Sac à main en pagne wax traditionnel avec finitions en cuir véritable. Design unique et élégant.",
        images: ["/assets/generated_images/luxury_pagne_handbag_hero.png"],
        isFeatured: true,
        inStock: true,
        slug: "sac-elegance-pagne",
      },
      {
        name: "Pochette Soleil d'Afrique",
        category: "trousse",
        price: 18000,
        description: "Pochette compacte aux motifs solaires, parfaite pour vos essentiels du quotidien.",
        images: ["/assets/generated_images/luxury_pagne_clutch_bag.png"],
        isFeatured: false,
        inStock: true,
        slug: "pochette-soleil-afrique",
      },
      {
        name: "Grand Cabas Tradition",
        category: "sac",
        price: 55000,
        description: "Grand sac cabas spacieux, idéal pour le travail ou les courses. Intérieur doublé.",
        images: ["/assets/generated_images/luxury_pagne_tote_bag.png"],
        isFeatured: true,
        inStock: true,
        slug: "grand-cabas-tradition",
      },
      {
        name: "Sandales Harmonie",
        category: "sandale",
        price: 28000,
        description: "Sandales artisanales avec lanières en pagne et semelle en cuir naturel.",
        images: ["/assets/generated_images/luxury_pagne_sandals_product.png"],
        isFeatured: true,
        inStock: true,
        slug: "sandales-harmonie",
      },
      {
        name: "Sandales Terre Rouge",
        category: "sandale",
        price: 32000,
        description: "Sandales plates confortables aux couleurs chaudes de la terre africaine.",
        images: ["/assets/generated_images/luxury_pagne_sandals_product.png"],
        isFeatured: false,
        inStock: true,
        slug: "sandales-terre-rouge",
      },
      {
        name: "Accessoires Collection",
        category: "accessoire",
        price: 8000,
        description: "Ensemble d'accessoires en pagne : bracelet, bandeau et pochette assortis.",
        images: ["/assets/generated_images/pagne_accessories_collection.png"],
        isFeatured: false,
        inStock: true,
        slug: "accessoires-collection",
      },
      {
        name: "Bandeau Grâce",
        category: "accessoire",
        price: 12000,
        description: "Bandeau élégant en pagne wax, parfait pour sublimer votre coiffure.",
        images: ["/assets/generated_images/pagne_accessories_collection.png"],
        isFeatured: false,
        inStock: true,
        slug: "bandeau-grace",
      },
      {
        name: "Mini Sac Bijou",
        category: "sac",
        price: 25000,
        description: "Petit sac de soirée raffiné avec chaîne dorée. Édition limitée.",
        images: ["/assets/generated_images/luxury_pagne_clutch_bag.png"],
        isFeatured: true,
        inStock: false,
        slug: "mini-sac-bijou",
      },
    ];

    const sampleFormations: InsertFormation[] = [
      {
        name: "Initiation à la Couture Pagne",
        description: "Apprenez les bases de la couture et créez votre première pochette en pagne. Formation idéale pour débutants souhaitant découvrir l'art de la création artisanale.",
        duration: "2 jours (12h)",
        price: 35000,
        materials: "Tissu pagne, fil, aiguilles fournis",
        image: "/assets/generated_images/artisan_training_workshop.png",
        nextSession: "2025-01-15",
      },
      {
        name: "Création de Sacs Artisanaux",
        description: "Maîtrisez les techniques de confection de sacs en pagne. De la découpe à l'assemblage final, devenez autonome dans la création de pièces uniques.",
        duration: "5 jours (35h)",
        price: 85000,
        materials: "Tout le matériel inclus",
        image: "/assets/generated_images/craft_materials_display.png",
        nextSession: "2025-01-22",
      },
      {
        name: "Perfectionnement & Entrepreneuriat",
        description: "Formation avancée combinant techniques de création professionnelles et bases de gestion d'entreprise. Lancez votre propre activité artisanale.",
        duration: "10 jours (70h)",
        price: 150000,
        materials: "Matériel professionnel + Kit de démarrage",
        image: "/assets/generated_images/community_impact_workshop.png",
        nextSession: "2025-02-03",
      },
    ];

    const sampleImpacts: InsertImpact[] = [
      {
        name: "Atelier Créatif à l'Orphelinat Sainte Thérèse",
        description: "En partenariat avec l'Orphelinat Sainte Thérèse de Brazzaville, nous avons organisé une série d'ateliers créatifs permettant aux enfants de découvrir l'art du tissage et de la couture. Ces moments de partage ont révélé des talents extraordinaires et ont offert aux enfants une activité épanouissante.",
        images: ["/assets/generated_images/community_impact_workshop.png", "/assets/generated_images/artisan_training_workshop.png"],
        date: "2024-11-15",
        location: "Brazzaville",
      },
      {
        name: "Formation Femmes Autonomes - Promotion 2024",
        description: "Vingt femmes ont suivi notre programme intensif de formation à la création artisanale. À l'issue de cette formation, 15 d'entre elles ont lancé leur propre activité de création, générant des revenus pour leurs familles. Un bel exemple de l'impact concret de l'autonomisation par le savoir-faire.",
        images: ["/assets/generated_images/artisan_training_workshop.png"],
        date: "2024-09-20",
        location: "Brazzaville",
      },
      {
        name: "Don de Fournitures Scolaires",
        description: "Une partie des bénéfices de notre collection Rentrée 2024 a été reversée sous forme de fournitures scolaires à plus de 80 enfants défavorisés. Cahiers, stylos, cartables - tout le nécessaire pour démarrer l'année scolaire dans les meilleures conditions.",
        images: ["/assets/generated_images/community_impact_workshop.png"],
        date: "2024-09-05",
        location: "Brazzaville et environs",
      },
    ];

    const sampleGalleryPhotos: InsertGalleryPhoto[] = [
      { name: "Sac de luxe en pagne", category: "creation", imageUrl: "/assets/generated_images/luxury_pagne_handbag_hero.png" },
      { name: "Atelier de formation", category: "atelier", imageUrl: "/assets/generated_images/artisan_training_workshop.png" },
      { name: "Sandales artisanales", category: "creation", imageUrl: "/assets/generated_images/luxury_pagne_sandals_product.png" },
      { name: "Impact communautaire", category: "humanitaire", imageUrl: "/assets/generated_images/community_impact_workshop.png" },
      { name: "Pochette élégante", category: "creation", imageUrl: "/assets/generated_images/luxury_pagne_clutch_bag.png" },
      { name: "Matériaux artisanaux", category: "atelier", imageUrl: "/assets/generated_images/craft_materials_display.png" },
      { name: "Grand cabas", category: "creation", imageUrl: "/assets/generated_images/luxury_pagne_tote_bag.png" },
      { name: "Collection accessoires", category: "creation", imageUrl: "/assets/generated_images/pagne_accessories_collection.png" },
      { name: "Fondatrice Emeraude", category: "humanitaire", imageUrl: "/assets/generated_images/african_founder_portrait.png" },
      { name: "Détails finitions", category: "creation", imageUrl: "/assets/generated_images/luxury_pagne_handbag_hero.png" },
      { name: "Apprentissage couture", category: "atelier", imageUrl: "/assets/generated_images/artisan_training_workshop.png" },
      { name: "Action sociale", category: "humanitaire", imageUrl: "/assets/generated_images/community_impact_workshop.png" },
    ];

    sampleProducts.forEach((product) => this.createProductSync(product));
    sampleFormations.forEach((formation) => this.createFormationSync(formation));
    sampleImpacts.forEach((impact) => this.createImpactSync(impact));
    sampleGalleryPhotos.forEach((photo) => this.createGalleryPhotoSync(photo));
  }

  private createProductSync(insertProduct: InsertProduct): Product {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  private createFormationSync(insertFormation: InsertFormation): Formation {
    const id = randomUUID();
    const formation: Formation = { ...insertFormation, id };
    this.formations.set(id, formation);
    return formation;
  }

  private createImpactSync(insertImpact: InsertImpact): Impact {
    const id = randomUUID();
    const impact: Impact = { ...insertImpact, id };
    this.impacts.set(id, impact);
    return impact;
  }

  private createGalleryPhotoSync(insertPhoto: InsertGalleryPhoto): GalleryPhoto {
    const id = randomUUID();
    const photo: GalleryPhoto = { ...insertPhoto, id };
    this.galleryPhotos.set(id, photo);
    return photo;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    return this.createProductSync(insertProduct);
  }

  async getFormations(): Promise<Formation[]> {
    return Array.from(this.formations.values());
  }

  async getFormation(id: string): Promise<Formation | undefined> {
    return this.formations.get(id);
  }

  async createFormation(insertFormation: InsertFormation): Promise<Formation> {
    return this.createFormationSync(insertFormation);
  }

  async getImpacts(): Promise<Impact[]> {
    return Array.from(this.impacts.values());
  }

  async getImpact(id: string): Promise<Impact | undefined> {
    return this.impacts.get(id);
  }

  async createImpact(insertImpact: InsertImpact): Promise<Impact> {
    return this.createImpactSync(insertImpact);
  }

  async getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return Array.from(this.galleryPhotos.values());
  }

  async getGalleryPhotosByCategory(category: string): Promise<GalleryPhoto[]> {
    return Array.from(this.galleryPhotos.values()).filter(
      (photo) => photo.category === category
    );
  }

  async createGalleryPhoto(insertPhoto: InsertGalleryPhoto): Promise<GalleryPhoto> {
    return this.createGalleryPhotoSync(insertPhoto);
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { ...insertMessage, id };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
