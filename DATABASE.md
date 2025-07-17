# Database Setup Guide

This project uses PostgreSQL with [Neon](https://neon.tech) as the database provider and [Drizzle ORM](https://orm.drizzle.team) for database operations.

## Setup Instructions

1. Create a PostgreSQL database on [Neon](https://neon.tech) or any other PostgreSQL provider.

2. Copy the connection string from your database provider.

3. Create a `.env` file in the root directory of the project and add your database connection string:

```
DATABASE_URL=postgres://your-username:your-password@your-neon-host/your-database
```

4. Install dependencies:

```bash
npm install
```

5. Set up the database tables:

```bash
npm run db:setup
```

## Database Schema

The database schema is defined in `shared/schema.ts` and includes the following tables:

- `users`: Stores user information
- `predictions`: Stores prediction data
- `live_metrics`: Stores live metrics data

## Database Operations

The project uses Drizzle ORM for database operations. The database connection is set up in `server/db.ts`, and the storage implementation is in `server/storage.ts`.

### Development Mode

In development mode, the project uses an in-memory storage implementation to avoid the need for a database connection. This is controlled by the `NODE_ENV` environment variable.

### Production Mode

In production mode, the project uses the PostgreSQL database for storage. Make sure to set the `NODE_ENV` environment variable to `production` and provide a valid `DATABASE_URL`.

## Database Migrations

To generate and apply database migrations:

```bash
npm run db:migrate
```

This will generate migration files in the `migrations` directory and apply them to the database.

## Manual Database Setup

If you need to manually set up the database tables, you can run:

```bash
npm run db:setup
```

This will create the necessary tables in the database if they don't already exist.