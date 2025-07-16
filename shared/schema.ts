import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type LiveMetrics = typeof liveMetrics.$inferSelect;
export type InsertLiveMetrics = z.infer<typeof insertLiveMetricsSchema>;
