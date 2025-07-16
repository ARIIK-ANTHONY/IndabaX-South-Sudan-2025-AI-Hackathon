import { users, predictions, liveMetrics, type User, type InsertUser, type Prediction, type InsertPrediction, type LiveMetrics, type InsertLiveMetrics } from "@shared/schema";

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

export const storage = new MemStorage();
