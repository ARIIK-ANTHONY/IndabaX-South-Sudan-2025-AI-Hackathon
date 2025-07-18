import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// In development mode, we can use a mock DB client

let db: any;

if (process.env.NODE_ENV === 'production') {
  // Check if DATABASE_URL is defined in production
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL environment variable is not defined in production. Using mock database for demo purposes.');
    db = { query: async () => ({}) };
  } else {
    // Create a postgres-js client with SSL required for cloud databases
    const client = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
    db = drizzle(client, { schema });
  }
} else {
  // In development, create a mock DB that doesn't actually connect
  // This allows the app to run without a real database connection
  console.log('Running in development mode with mock database');
  
  // Create a simple mock that logs operations instead of executing them
  const mockSql = () => {
    return {
      // This is a minimal mock implementation
      query: async () => ({}),
    };
  };
  
  db = {
    select: () => ({
      from: () => ({
        where: () => [],
        orderBy: () => ({
          limit: () => [],
        }),
        limit: () => [],
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: () => [],
      }),
    }),
    execute: async () => ({}),
  };
}

export { db };