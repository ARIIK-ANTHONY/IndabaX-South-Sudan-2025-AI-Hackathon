import { users, predictions, type User, type InsertUser, type Prediction, type InsertPrediction } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPrediction(prediction: InsertPrediction & { prediction: string; confidence: number }): Promise<Prediction>;
  getAllPredictions(): Promise<Prediction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private predictions: Map<number, Prediction>;
  private currentUserId: number;
  private currentPredictionId: number;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.currentUserId = 1;
    this.currentPredictionId = 1;
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
}

export const storage = new MemStorage();
