import type { Express } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export function registerImageGenerateKGJ(app: Express) {
  // 🔎 DEBUG OPENAI — vérifie clé / quota / accès
  app.get("/api/debug-openai", async (_req, res) => {
    try {
      const test = await openai.models.list();
      return res.json({
        ok: true,
        models: test.data.slice(0, 3).map((m) => m.id),
      });
    } catch (error: any) {
      console.error("❌ OPENAI DEBUG ERROR:", error);
      return res.status(500).json({
        ok: false,
        message: error?.message,
      });
    }
  });

  // 🎨 GÉNÉRATION D’IMAGE
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          message: "Prompt manquant ou invalide",
        });
      }

      const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });

      const imageUrl = result.data?.[0]?.url;

      if (!imageUrl) {
        return res.status(500).json({
          message: "Aucune image générée par OpenAI",
        });
      }

      return res.json({ imageUrl });
    } catch (error: any) {
      console.error("❌ IMAGE GENERATION ERROR MESSAGE:", error?.message);
      console.error("❌ IMAGE GENERATION ERROR FULL:", error);

      return res.status(500).json({
        message: "Erreur lors de la génération de l’image",
        debug: error?.message,
      });
    }
  });
}
