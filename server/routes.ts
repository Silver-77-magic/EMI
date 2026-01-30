import { registerImageGenerateKGJ } from "./image_generate_kgj";
import type { Express } from "express";
import { type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // 🔥 IA — Génération d’images
  registerImageGenerateKGJ(app);

  // AI Integrations
  registerChatRoutes(app);
  registerImageRoutes(app);

  // Products
  app.get(api.products.list.path, async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = (req.user as any).id;
      const { items, totalAmount } = req.body;

      const order = await storage.createOrder(
        userId,
        totalAmount,
        items
      );

      console.log(
        `[WhatsApp Mock] Sending order summary for Order #${order.id}`
      );

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

    const userId = (req.user as any).id;
    const orders = await storage.getOrdersByUser(userId);
    res.json(orders);
  });

  return httpServer;
}
