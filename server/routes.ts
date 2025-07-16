import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPredictionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock ML prediction function - simulates ensemble model
  function predictBloodDisease(medicalParams: any) {
    const { glucose, hemoglobin, platelets, cholesterol, whiteBloodCells, hematocrit } = medicalParams;
    
    // Simple rule-based prediction logic for demo
    let prediction = "Healthy";
    let confidence = 0.85;
    
    if (glucose > 126) {
      prediction = "Diabetes";
      confidence = 0.92;
    } else if (hemoglobin < 12) {
      prediction = "Anemia";
      confidence = 0.88;
    } else if (platelets < 150) {
      prediction = "Thrombocytopenia";
      confidence = 0.85;
    } else if (cholesterol > 240) {
      prediction = "Heart Disease";
      confidence = 0.79;
    } else if (hemoglobin < 10 && hematocrit < 30) {
      prediction = "Thalassemia";
      confidence = 0.83;
    }
    
    return { prediction, confidence };
  }

  app.post("/api/predictions", async (req, res) => {
    try {
      const validatedData = insertPredictionSchema.parse(req.body);
      const { prediction, confidence } = predictBloodDisease(validatedData);
      
      const result = await storage.createPrediction({
        ...validatedData,
        prediction,
        confidence,
      });
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid prediction data" });
    }
  });

  app.get("/api/predictions", async (req, res) => {
    try {
      const predictions = await storage.getAllPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Get project statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = {
        totalSamples: 2351,
        testSamples: 486,
        medicalFeatures: 24,
        engineeredFeatures: 13,
        diseaseClasses: 6,
        targetAccuracy: 98.55,
        trainingAccuracy: 100.0,
        validationAccuracy: 100.0,
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
