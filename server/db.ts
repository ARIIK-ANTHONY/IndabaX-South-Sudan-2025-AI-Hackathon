import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// In development mode, we can use a mock DB client
let sql: any;
let db: any;

if (process.env.NODE_ENV === 'production') {
  // Check if DATABASE_URL is defined in production
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined in production');
  }
  
  // Create a Neon client
  sql = neon(process.env.DATABASE_URL);
  
  // Create a Drizzle ORM instance
  db = drizzle(sql, { schema });
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
  
  sql = mockSql;
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