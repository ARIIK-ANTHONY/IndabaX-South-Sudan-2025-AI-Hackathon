import { 
  users, predictions, liveMetrics, chatSessions, chatMessages, diseases, trainingData, systemLogs,
  type User, type InsertUser, type Prediction, type InsertPrediction, type LiveMetrics, type InsertLiveMetrics,
  type ChatSession, type InsertChatSession, type ChatMessage, type InsertChatMessage,
  type Disease, type InsertDisease, type TrainingData, type InsertTrainingData,
  type SystemLog, type InsertSystemLog
} from "@shared/schema";
import { db } from './db';
import { eq, desc } from 'drizzle-orm';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Prediction operations
  createPrediction(prediction: InsertPrediction & { prediction: string; confidence: number }): Promise<Prediction>;
  getAllPredictions(): Promise<Prediction[]>;
  getRecentPredictions(limit?: number): Promise<Prediction[]>;
  
  // Live metrics operations
  getLiveMetrics(): Promise<LiveMetrics | undefined>;
  updateLiveMetrics(metrics: InsertLiveMetrics): Promise<LiveMetrics>;
  getDiseaseStats(): Promise<{ [key: string]: number }>;
  
  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatSessionActivity(sessionId: string): Promise<void>;
  
  // Disease operations
  getAllDiseases(): Promise<Disease[]>;
  getDiseaseByName(name: string): Promise<Disease | undefined>;
  createDisease(disease: InsertDisease): Promise<Disease>;
  updateDisease(id: number, disease: Partial<InsertDisease>): Promise<Disease>;
  
  // Training data operations
  getAllTrainingData(): Promise<TrainingData[]>;
  createTrainingData(data: InsertTrainingData): Promise<TrainingData>;
  getTrainingDataByCategory(category: string): Promise<TrainingData[]>;
  updateTrainingDataValidation(id: number, validated: boolean): Promise<TrainingData>;
  
  // System logs operations
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(level?: string, limit?: number): Promise<SystemLog[]>;
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

  // Chat operations
  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const result = await db.insert(chatSessions).values(sessionData).returning();
    return result[0];
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    const result = await db.select().from(chatSessions).where(eq(chatSessions.sessionId, sessionId));
    return result[0];
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(messageData).returning();
    return result[0];
  }

  async updateChatSessionActivity(sessionId: string): Promise<void> {
    await db.update(chatSessions)
      .set({ lastActivity: new Date() })
      .where(eq(chatSessions.sessionId, sessionId));
  }

  // Disease operations
  async getAllDiseases(): Promise<Disease[]> {
    return await db.select().from(diseases);
  }

  async getDiseaseByName(name: string): Promise<Disease | undefined> {
    const result = await db.select().from(diseases).where(eq(diseases.name, name));
    return result[0];
  }

  async createDisease(diseaseData: InsertDisease): Promise<Disease> {
    const result = await db.insert(diseases).values(diseaseData).returning();
    return result[0];
  }

  async updateDisease(id: number, diseaseData: Partial<InsertDisease>): Promise<Disease> {
    const result = await db.update(diseases)
      .set({ ...diseaseData, updatedAt: new Date() })
      .where(eq(diseases.id, id))
      .returning();
    return result[0];
  }

  // Training data operations
  async getAllTrainingData(): Promise<TrainingData[]> {
    return await db.select().from(trainingData);
  }

  async createTrainingData(data: InsertTrainingData): Promise<TrainingData> {
    const result = await db.insert(trainingData).values(data).returning();
    return result[0];
  }

  async getTrainingDataByCategory(category: string): Promise<TrainingData[]> {
    return await db.select().from(trainingData).where(eq(trainingData.category, category));
  }

  async updateTrainingDataValidation(id: number, validated: boolean): Promise<TrainingData> {
    const result = await db.update(trainingData)
      .set({ validated })
      .where(eq(trainingData.id, id))
      .returning();
    return result[0];
  }

  // System logs operations
  async createSystemLog(logData: InsertSystemLog): Promise<SystemLog> {
    const result = await db.insert(systemLogs).values(logData).returning();
    return result[0];
  }

  async getSystemLogs(level?: string, limit: number = 100): Promise<SystemLog[]> {
    let query = db.select().from(systemLogs).orderBy(desc(systemLogs.timestamp));
    
    if (level) {
      query = query.where(eq(systemLogs.level, level));
    }
    
    return await query.limit(limit);
  }
}

// Create a memory storage implementation for development/testing
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private predictions: Map<number, Prediction>;
  private liveMetrics: LiveMetrics | null;
  private chatSessions: Map<string, ChatSession>;
  private chatMessages: Map<string, ChatMessage[]>;
  private diseases: Map<number, Disease>;
  private trainingData: Map<number, TrainingData>;
  private systemLogs: SystemLog[];
  private currentUserId: number;
  private currentPredictionId: number;
  private currentMetricsId: number;
  private currentChatSessionId: number;
  private currentChatMessageId: number;
  private currentDiseaseId: number;
  private currentTrainingDataId: number;
  private currentSystemLogId: number;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.diseases = new Map();
    this.trainingData = new Map();
    this.systemLogs = [];
    this.liveMetrics = null;
    this.currentUserId = 1;
    this.currentPredictionId = 1;
    this.currentMetricsId = 1;
    this.currentChatSessionId = 1;
    this.currentChatMessageId = 1;
    this.currentDiseaseId = 1;
    this.currentTrainingDataId = 1;
    this.currentSystemLogId = 1;
    
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

  // Chat operations
  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const id = this.currentChatSessionId++;
    const session: ChatSession = {
      ...sessionData,
      id,
      userId: sessionData.userId || null,
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    this.chatSessions.set(sessionData.sessionId, session);
    this.chatMessages.set(sessionData.sessionId, []);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.get(sessionId) || [];
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = {
      ...messageData,
      id,
      timestamp: new Date(),
    };
    
    const messages = this.chatMessages.get(messageData.sessionId) || [];
    messages.push(message);
    this.chatMessages.set(messageData.sessionId, messages);
    
    return message;
  }

  async updateChatSessionActivity(sessionId: string): Promise<void> {
    const session = this.chatSessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
      this.chatSessions.set(sessionId, session);
    }
  }

  // Disease operations
  async getAllDiseases(): Promise<Disease[]> {
    return Array.from(this.diseases.values());
  }

  async getDiseaseByName(name: string): Promise<Disease | undefined> {
    return Array.from(this.diseases.values()).find(disease => disease.name === name);
  }

  async createDisease(diseaseData: InsertDisease): Promise<Disease> {
    const id = this.currentDiseaseId++;
    const disease: Disease = {
      ...diseaseData,
      id,
      description: diseaseData.description || null,
      symptoms: diseaseData.symptoms || null,
      causes: diseaseData.causes || null,
      treatments: diseaseData.treatments || null,
      preventions: diseaseData.preventions || null,
      riskFactors: diseaseData.riskFactors || null,
      category: diseaseData.category || null,
      severity: diseaseData.severity || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.diseases.set(id, disease);
    return disease;
  }

  async updateDisease(id: number, diseaseData: Partial<InsertDisease>): Promise<Disease> {
    const existingDisease = this.diseases.get(id);
    if (!existingDisease) {
      throw new Error(`Disease with id ${id} not found`);
    }
    
    const updatedDisease: Disease = {
      ...existingDisease,
      ...diseaseData,
      updatedAt: new Date(),
    };
    this.diseases.set(id, updatedDisease);
    return updatedDisease;
  }

  // Training data operations
  async getAllTrainingData(): Promise<TrainingData[]> {
    return Array.from(this.trainingData.values());
  }

  async createTrainingData(data: InsertTrainingData): Promise<TrainingData> {
    const id = this.currentTrainingDataId++;
    const trainingDataItem: TrainingData = {
      ...data,
      id,
      confidence: data.confidence || null,
      category: data.category || null,
      validated: data.validated || null,
      createdAt: new Date(),
    };
    this.trainingData.set(id, trainingDataItem);
    return trainingDataItem;
  }

  async getTrainingDataByCategory(category: string): Promise<TrainingData[]> {
    return Array.from(this.trainingData.values()).filter(data => data.category === category);
  }

  async updateTrainingDataValidation(id: number, validated: boolean): Promise<TrainingData> {
    const existingData = this.trainingData.get(id);
    if (!existingData) {
      throw new Error(`Training data with id ${id} not found`);
    }
    
    const updatedData: TrainingData = {
      ...existingData,
      validated,
    };
    this.trainingData.set(id, updatedData);
    return updatedData;
  }

  // System logs operations
  async createSystemLog(logData: InsertSystemLog): Promise<SystemLog> {
    const id = this.currentSystemLogId++;
    const log: SystemLog = {
      ...logData,
      id,
      context: logData.context || null,
      timestamp: new Date(),
    };
    this.systemLogs.push(log);
    return log;
  }

  async getSystemLogs(level?: string, limit: number = 100): Promise<SystemLog[]> {
    let logs = [...this.systemLogs];
    
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    
    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return logs.slice(0, limit);
  }
}

// Use the database storage in production, memory storage in development
export const storage = process.env.NODE_ENV === 'production' 
  ? new DbStorage() 
  : new MemStorage();
