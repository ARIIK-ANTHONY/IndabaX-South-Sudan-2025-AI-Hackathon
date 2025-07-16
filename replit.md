# Blood Disease Classification AI System - Live Dashboard

## Overview

This is a full-stack web application for automated blood disease classification using machine learning with real-time data visualization. The system provides an AI-powered solution for diagnosing blood diseases based on medical laboratory test results, featuring an ensemble learning approach with medical domain expertise and live streaming analytics dashboard.

## Recent Changes (January 16, 2025)
- Updated color scheme to professional healthcare palette inspired by Figma design
- Implemented medical-focused color variables with trust blue, healing green, and calming teal
- Enhanced accessibility with WCAG-compliant color contrasts
- Updated hero section, navigation, and demo interface with new healthcare branding

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement via Vite middleware
- **Storage**: In-memory storage with interface for future database integration

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Two main tables - users and predictions
- **Migration**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### Machine Learning Model
- **Algorithm**: Ensemble learning (Random Forest + Gradient Boosting)
- **Features**: 24 medical parameters with 13 custom domain-specific features
- **Diseases**: 6 classification types (Diabetes, Anemia, Thalassemia, Heart Disease, Thrombocytopenia, Healthy)
- **Accuracy**: Target 98.55%+ accuracy with confidence scoring

### Medical Features
- Blood ratio calculations (Cholesterol/HDL, LDL/HDL, Hemoglobin/RBC)
- Metabolic scoring (Glucose/Insulin ratio, BP product)
- Health indicators (Cardiac risk score, Anemia score, Iron status)
- Liver function assessments

### UI Components
- **Landing Page**: Hero section with statistics and project overview
- **Live Dashboard**: Real-time data visualization with WebSocket streaming
- **Real-Time Metrics**: Live analytics with performance charts and recent predictions
- **Team Section**: Member profiles and roles
- **Data Visualization**: Charts showing disease distribution and feature importance
- **Interactive Demo**: Live prediction interface with form inputs
- **Results Display**: Performance metrics and methodology explanation

## Data Flow

1. **User Input**: Medical parameters entered through web form
2. **Validation**: Zod schema validation on both client and server
3. **Prediction**: Ensemble model processes features and generates classification
4. **Storage**: Results stored in database with timestamp and confidence score
5. **Response**: Prediction result returned to client with confidence percentage
6. **Display**: Results shown in user-friendly format with medical context

## External Dependencies

### Frontend Libraries
- **UI Components**: Radix UI primitives for accessibility
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Hookform Resolvers
- **Icons**: Lucide React icon library
- **Utilities**: Class Variance Authority, clsx, date-fns

### Backend Libraries
- **Database**: Neon Database serverless PostgreSQL
- **Session**: Connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type checking
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **WebSockets**: ws for real-time data streaming
- **Real-time**: Live metrics and prediction monitoring

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Strict mode with path mapping
- **Linting**: ESM modules with TypeScript compilation
- **Hot Reload**: Vite dev server with error overlay

## Deployment Strategy

### Development Environment
- **Server**: Express with Vite middleware for HMR
- **Database**: Neon serverless PostgreSQL with environment variables
- **Build**: Concurrent client and server TypeScript compilation
- **Port**: Single port serving both API and static assets

### Production Deployment
- **Build Process**: Vite build for client, esbuild for server bundling
- **Static Assets**: Served from dist/public directory
- **API Routes**: Express server handling /api/* routes
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Session Storage**: PostgreSQL-backed sessions for user management

### Environment Configuration
- **NODE_ENV**: Development/production mode switching
- **DATABASE_URL**: PostgreSQL connection string
- **Session Security**: Secure session configuration for production
- **CORS**: Configured for production domain restrictions

The application uses a monorepo structure with shared TypeScript types and schemas, enabling type safety across the full stack while maintaining clear separation between client and server concerns.