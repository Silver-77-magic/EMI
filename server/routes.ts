import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  // Register AI Integrations
  registerChatRoutes(app);
  registerImageRoutes(app);

  // Products
  app.get(api.products.list.path, async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { items, totalAmount } = req.body;
      const order = await storage.createOrder(req.user!.id, totalAmount, items);
      
      // Send WhatsApp Notification (Mock)
      console.log(`[WhatsApp Mock] Sending order summary to +237 699651854 for Order #${order.id}`);
      
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      throw err;
    }
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrdersByUser(req.user!.id);
    res.json(orders);
  });

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    // Seed products
    const productsToSeed = [
      {
        name: "Premium Cotton T-Shirt",
        description: "High-quality 100% cotton t-shirt, perfect for custom prints.",
        price: 5000,
        category: "t-shirt",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        customizationOptions: {
          methods: ["Screen Printing", "Flocking"],
          colors: ["White", "Black", "Navy", "Red"],
          sizes: ["S", "M", "L", "XL"],
        },
      },
      {
        name: "Classic Polo Shirt",
        description: "Elegant polo shirt suitable for professional branding.",
        price: 7500,
        category: "polo",
        imageUrl: "https://images.unsplash.com/photo-1625910515337-3f9c3469a51c?w=800&q=80",
        customizationOptions: {
          methods: ["Screen Printing", "Flocking"],
          colors: ["White", "Black", "Blue"],
          sizes: ["S", "M", "L", "XL", "XXL"],
        },
      },
      {
        name: "Urban Hoodie Jacket",
        description: "Warm and stylish hoodie, great for large back prints.",
        price: 15000,
        category: "jacket",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        customizationOptions: {
          methods: ["Screen Printing", "Flocking"],
          colors: ["Grey", "Black", "Navy"],
          sizes: ["M", "L", "XL"],
        },
      },
    ];

    // We need to bypass the storage interface for seeding as we don't expose createProduct there
    // Or we can just add a temporary method, or use db directly. 
    // Using db directly here for seeding simplicity.
    const { products } = await import("@shared/schema");
    const { db } = await import("./db");
    
    await db.insert(products).values(productsToSeed);
    console.log("Seeded database with products");
  }
}

// Execute seeding after a short delay to ensure DB is ready
setTimeout(seedDatabase, 2000);
