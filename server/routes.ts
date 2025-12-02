import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use("/assets", express.static(path.resolve(process.cwd(), "attached_assets")));

  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === "string") {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/formations", async (req, res) => {
    try {
      const formations = await storage.getFormations();
      res.json(formations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch formations" });
    }
  });

  app.get("/api/formations/:id", async (req, res) => {
    try {
      const formation = await storage.getFormation(req.params.id);
      if (!formation) {
        return res.status(404).json({ error: "Formation not found" });
      }
      res.json(formation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch formation" });
    }
  });

  app.get("/api/impacts", async (req, res) => {
    try {
      const impacts = await storage.getImpacts();
      res.json(impacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch impacts" });
    }
  });

  app.get("/api/impacts/:id", async (req, res) => {
    try {
      const impact = await storage.getImpact(req.params.id);
      if (!impact) {
        return res.status(404).json({ error: "Impact not found" });
      }
      res.json(impact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch impact" });
    }
  });

  app.get("/api/gallery", async (req, res) => {
    try {
      const { category } = req.query;
      let photos;
      
      if (category && typeof category === "string") {
        photos = await storage.getGalleryPhotosByCategory(category);
      } else {
        photos = await storage.getGalleryPhotos();
      }
      
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery photos" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Message envoyé avec succès",
        data: message 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          error: "Validation error", 
          details: error.errors 
        });
      }
      res.status(500).json({ 
        success: false,
        error: "Failed to send message" 
      });
    }
  });

  app.get("/api/placeholder/:type/:id", (req, res) => {
    const { type, id } = req.params;
    const width = 400;
    const height = type === "workshop" ? 300 : 500;
    
    const colors: Record<string, string> = {
      bags: "064e3b",
      sandals: "d4af37",
      accessories: "292524",
      workshop: "064e3b",
      impact: "1f2937",
      gallery: "064e3b",
    };
    
    const color = colors[type] || "064e3b";
    const placeholderUrl = `https://via.placeholder.com/${width}x${height}/${color}/ffffff?text=Spirit+Emeraude`;
    
    res.redirect(placeholderUrl);
  });

  return httpServer;
}
