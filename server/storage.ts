import { users, predictions, liveMetrics, type User, type InsertUser, type Prediction, type InsertPrediction, type LiveMetrics, type InsertLiveMetrics } from "@shared/schema";
import { db } from './db';
import { eq, desc } from 'drizzle-orm';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPrediction(prediction: InsertPrediction & { prediction: string; confidence: number }): Promise<Prediction>;
  getAllPredictions(): Promise<Prediction[]>;
  getRecentPredictions(limit?: number): Promise<Prediction[]>;
  getLiveMetrics(): Promise<LiveMetrics | undefined>;
  updateLiveMetrics(metrics: InsertLiveMetrics): Promise<LiveMetrics>;
  getDiseaseStats(): Promise<{ [key: string]: number }>;
}

export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createPrediction(predictionData: InsertPrediction & { prediction: string; confidence: number }): Promise<Prediction> {
    const result = await db.insert(predictions).values(predictionData).returning();
    return result[0];
  }

  async getAllPredictions(): Promise<Prediction[]> {
    return await db.select().from(predictions);
  }

  async getRecentPredictions(limit: number = 10): Promise<Prediction[]> {
    return await db.select().from(predictions).orderBy(desc(predictions.createdAt)).limit(limit);
  }

  async getLiveMetrics(): Promise<LiveMetrics | undefined> {
    const result = await db.select().from(liveMetrics).orderBy(desc(liveMetrics.timestamp)).limit(1);
    return result[0];
  }

  async updateLiveMetrics(metricsData: InsertLiveMetrics): Promise<LiveMetrics> {
    const result = await db.insert(liveMetrics).values(metricsData).returning();
    return result[0];
  }

  async getDiseaseStats(): Promise<{ [key: string]: number }> {
    const allPredictions = await this.getAllPredictions();
    const stats: { [key: string]: number } = {};
    
    allPredictions.forEach(prediction => {
      stats[prediction.prediction] = (stats[prediction.prediction] || 0) + 1;
    });
    
    return stats;
  }
}

// Create a memory storage implementation for development/testing
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private predictions: Map<number, Prediction>;
  private liveMetrics: LiveMetrics | null;
  private currentUserId: number;
  private currentPredictionId: number;
  private currentMetricsId: number;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.liveMetrics = null;
    this.currentUserId = 1;
    this.currentPredictionId = 1;
    this.currentMetricsId = 1;
    
    // Seed with some initial prediction data
    this.seedInitialData();
  }

  private seedInitialData() {
    const initialPredictions = [
      { glucose: 95, hemoglobin: 13.5, platelets: 250, cholesterol: 180, whiteBloodCells: 6.5, hematocrit: 42, prediction: 'Healthy', confidence: 0.92 },
      { glucose: 140, hemoglobin: 12.8, platelets: 280, cholesterol: 220, whiteBloodCells: 7.2, hematocrit: 40, prediction: 'Diabetes', confidence: 0.88 },
      { glucose: 85, hemoglobin: 9.5, platelets: 200, cholesterol: 175, whiteBloodCells: 5.8, hematocrit: 35, prediction: 'Anemia', confidence: 0.85 },
      { glucose: 78, hemoglobin: 8.2, platelets: 180, cholesterol: 160, whiteBloodCells: 5.2, hematocrit: 28, prediction: 'Thalassemia', confidence: 0.83 },
      { glucose: 105, hemoglobin: 13.2, platelets: 120, cholesterol: 190, whiteBloodCells: 6.8, hematocrit: 41, prediction: 'Thrombocytopenia', confidence: 0.79 },
      { glucose: 88, hemoglobin: 14.1, platelets: 310, cholesterol: 260, whiteBloodCells: 7.5, hematocrit: 43, prediction: 'Heart Disease', confidence: 0.81 },
      { glucose: 92, hemoglobin: 13.8, platelets: 240, cholesterol: 165, whiteBloodCells: 6.1, hematocrit: 41, prediction: 'Healthy', confidence: 0.94 },
      { glucose: 155, hemoglobin: 12.5, platelets: 200, cholesterol: 245, whiteBloodCells: 8.1, hematocrit: 38, prediction: 'Diabetes', confidence: 0.91 },
      { glucose: 82, hemoglobin: 10.2, platelets: 190, cholesterol: 170, whiteBloodCells: 5.5, hematocrit: 36, prediction: 'Anemia', confidence: 0.87 },
      { glucose: 96, hemoglobin: 13.6, platelets: 270, cholesterol: 185, whiteBloodCells: 6.3, hematocrit: 42, prediction: 'Healthy', confidence: 0.93 }
    ];

    initialPredictions.forEach(predData => {
      const id = this.currentPredictionId++;
      const prediction: Prediction = {
        ...predData,
        id,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time within last week
      };
      this.predictions.set(id, prediction);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPrediction(predictionData: InsertPrediction & { prediction: string; confidence: number }): Promise<Prediction> {
    const id = this.currentPredictionId++;
    const prediction: Prediction = {
      ...predictionData,
      id,
      createdAt: new Date(),
    };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async getAllPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values());
  }

  async getRecentPredictions(limit: number = 10): Promise<Prediction[]> {
    const predictions = Array.from(this.predictions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return predictions.slice(0, limit);
  }

  async getLiveMetrics(): Promise<LiveMetrics | undefined> {
    return this.liveMetrics || undefined;
  }

  async updateLiveMetrics(metricsData: InsertLiveMetrics): Promise<LiveMetrics> {
    const id = this.currentMetricsId++;
    const metrics: LiveMetrics = {
      ...metricsData,
      id,
      timestamp: new Date(),
    };
    this.liveMetrics = metrics;
    return metrics;
  }

  async getDiseaseStats(): Promise<{ [key: string]: number }> {
    const predictions = Array.from(this.predictions.values());
    const stats: { [key: string]: number } = {};
    
    predictions.forEach(prediction => {
      stats[prediction.prediction] = (stats[prediction.prediction] || 0) + 1;
    });
    
    return stats;
  }
}

// Use the database storage in production, memory storage in development
export const storage = process.env.NODE_ENV === 'production' 
  ? new DbStorage() 
  : new MemStorage();
