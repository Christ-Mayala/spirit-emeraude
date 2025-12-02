# Spirit Emeraude Création

## Overview
Spirit Emeraude Création is a luxury African artisan brand e-commerce platform. The website showcases handcrafted products made from traditional African pagne fabric, offers artisan training programs, and highlights the brand's social impact initiatives.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Data**: In-memory storage with sample data
- **Routing**: wouter for client-side routing
- **State Management**: TanStack Query (React Query)
- **Styling**: TailwindCSS with custom design system

### Directory Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Header, Footer, Layout
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── pages/             # Route pages (Home, Shop, Formations, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   └── lib/               # Utilities and query client
│   └── index.html
├── server/
│   ├── routes.ts              # API endpoints
│   ├── storage.ts             # In-memory data storage
│   └── index.ts               # Server entry point
├── shared/
│   └── schema.ts              # TypeScript types and Zod schemas
└── attached_assets/
    └── generated_images/      # Product and content images
```

## Design System

### Brand Colors
- **Primary (Emerald Green)**: `#064e3b` - Deep emerald for luxury feel
- **Accent (Muted Gold)**: `#d4af37` - Sand/gold for warmth
- **Background**: `#fdfbf7` - Eggshell white for natural paper feel
- **Text**: `#292524` - Warm anthracite gray
- **Footer**: `#1f2937` - Dark gray

### Typography
- **Headings**: Domine (serif) - Elegant, authoritative
- **Body**: Montserrat (sans-serif) - Modern, readable

## Pages

### Home (`/`)
- Split-screen hero with compelling headline and product image
- Mission/storytelling section with founder profile
- Categories bento grid linking to Shop and Formations

### Shop (`/boutique`)
- Product catalog with category filters (Sacs, Sandales, Accessoires)
- WhatsApp ordering integration
- Featured products and stock status

### Formations (`/formations`)
- Workshop listings with pricing, duration, materials
- Next session dates
- WhatsApp registration links

### Impact (`/impact`)
- Social impact initiatives
- Editorial-style alternating image/text layout
- Statistics on women trained and children helped

### Gallery (`/galerie`)
- Masonry grid of photos
- Category filters (Création, Atelier, Humanitaire)
- Lightbox for full-size viewing

### Contact (`/contact`)
- Two-column layout with contact info and form
- Form validation with Zod
- Success/error toast notifications

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List all products, supports `?category=` filter |
| `/api/products/:id` | GET | Get single product |
| `/api/formations` | GET | List all formations |
| `/api/formations/:id` | GET | Get single formation |
| `/api/impacts` | GET | List all impact initiatives |
| `/api/impacts/:id` | GET | Get single impact |
| `/api/gallery` | GET | List all gallery photos, supports `?category=` filter |
| `/api/contact` | POST | Submit contact message |

## Data Models

### Product
- id, name, category, price, description, images[], isFeatured, inStock, slug

### Formation
- id, name, description, duration, price, materials, image, nextSession

### Impact
- id, name, description, images[], date, location

### GalleryPhoto
- id, name, category, imageUrl

### ContactMessage
- id, name, phone, email, subject, message

## WhatsApp Integration
Products and formations include "Commander" / "S'inscrire" buttons that open WhatsApp with pre-filled messages:
- Product orders: "Bonjour Spirit, je souhaite commander le [Product Name] à [Price] FCFA."
- Formation registration: "Bonjour, je suis intéressé(e) par la formation [Formation Name]."

## Running the Project
The application runs with `npm run dev` which starts both the Express backend and Vite frontend on port 5000.

## Recent Changes
- December 2, 2025: Initial MVP implementation with all pages, API endpoints, and sample data
