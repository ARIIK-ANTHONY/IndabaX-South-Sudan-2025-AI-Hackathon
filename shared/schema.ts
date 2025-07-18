import { pgTable, text, serial, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  glucose: real("glucose").notNull(),
  hemoglobin: real("hemoglobin").notNull(),
  platelets: real("platelets").notNull(),
  cholesterol: real("cholesterol").notNull(),
  whiteBloodCells: real("white_blood_cells").notNull(),
  hematocrit: real("hematocrit").notNull(),
  prediction: text("prediction").notNull(),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const liveMetrics = pgTable("live_metrics", {
  id: serial("id").primaryKey(),
  totalPredictions: integer("total_predictions").notNull(),
  accuracyRate: real("accuracy_rate").notNull(),
  diseaseBreakdown: text("disease_breakdown").notNull(), // JSON string
  avgConfidence: real("avg_confidence").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Chat Sessions Table
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

// Chat Messages Table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").references(() => chatSessions.sessionId).notNull(),
  messageId: text("message_id").notNull().unique(),
  text: text("text").notNull(),
  sender: text("sender").notNull(), // 'user' or 'bot'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Disease Information Table
export const diseases = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  symptoms: text("symptoms").array(), // Array of symptoms
  causes: text("causes").array(), // Array of causes
  treatments: text("treatments").array(), // Array of treatments
  preventions: text("preventions").array(), // Array of preventions
  riskFactors: text("risk_factors").array(), // Array of risk factors
  category: text("category"),
  severity: text("severity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Training Data Table
export const trainingData = pgTable("training_data", {
  id: serial("id").primaryKey(),
  inputText: text("input_text").notNull(),
  expectedOutput: text("expected_output").notNull(),
  category: text("category"),
  confidence: real("confidence"),
  validated: boolean("validated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// System Logs Table
export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(), // 'info', 'warning', 'error'
  message: text("message").notNull(),
  context: jsonb("context"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  prediction: true,
  confidence: true,
  createdAt: true,
});

export const insertLiveMetricsSchema = createInsertSchema(liveMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertDiseaseSchema = createInsertSchema(diseases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingDataSchema = createInsertSchema(trainingData).omit({
  id: true,
  createdAt: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type LiveMetrics = typeof liveMetrics.$inferSelect;
export type InsertLiveMetrics = z.infer<typeof insertLiveMetricsSchema>;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertDisease = z.infer<typeof insertDiseaseSchema>;
export type Disease = typeof diseases.$inferSelect;
export type InsertTrainingData = z.infer<typeof insertTrainingDataSchema>;
export type TrainingData = typeof trainingData.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;
