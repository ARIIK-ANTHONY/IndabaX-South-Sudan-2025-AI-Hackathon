import { db } from './db';
import { users, predictions, liveMetrics } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function setupDatabase() {
  // Only run in production mode
  if (process.env.NODE_ENV !== 'production') {
    console.log('Skipping database setup in development mode');
    return;
  }
  
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL provided, skipping database setup');
    return;
  }
  
  console.log('Setting up database tables...');
  
  try {
    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        glucose REAL NOT NULL,
        hemoglobin REAL NOT NULL,
        platelets REAL NOT NULL,
        cholesterol REAL NOT NULL,
        white_blood_cells REAL NOT NULL,
        hematocrit REAL NOT NULL,
        prediction TEXT NOT NULL,
        confidence REAL NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS live_metrics (
        id SERIAL PRIMARY KEY,
        total_predictions INTEGER NOT NULL,
        accuracy_rate REAL NOT NULL,
        disease_breakdown TEXT NOT NULL,
        avg_confidence REAL NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

export { setupDatabase };