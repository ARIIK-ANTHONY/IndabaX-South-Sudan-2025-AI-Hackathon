import { db } from './db';
import { users, predictions, liveMetrics, chatSessions, chatMessages, diseases, trainingData, systemLogs } from '../shared/schema';
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

      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        last_activity TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL REFERENCES chat_sessions(session_id),
        message_id TEXT NOT NULL UNIQUE,
        text TEXT NOT NULL,
        sender TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS diseases (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        symptoms TEXT[],
        causes TEXT[],
        treatments TEXT[],
        preventions TEXT[],
        risk_factors TEXT[],
        category TEXT,
        severity TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS training_data (
        id SERIAL PRIMARY KEY,
        input_text TEXT NOT NULL,
        expected_output TEXT NOT NULL,
        category TEXT,
        confidence REAL,
        validated BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        context JSONB,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('Database tables created successfully!');
    
    // Seed disease data if not exists
    await seedDiseaseData();
  } catch (error) {
    console.error('Error setting up database:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

async function seedDiseaseData() {
  try {
    // Check if diseases already exist
    const existingDiseases = await db.select().from(diseases);
    if (existingDiseases.length > 0) {
      console.log('Disease data already exists, skipping seed');
      return;
    }

    console.log('Seeding disease data...');
    
    const diseaseData = [
      {
        name: 'Healthy',
        description: 'Normal blood values with no disease indicators',
        symptoms: ['No symptoms', 'Normal energy levels', 'Good overall health'],
        causes: ['Balanced lifestyle', 'Regular exercise', 'Proper nutrition'],
        treatments: ['Maintain healthy lifestyle', 'Regular check-ups', 'Balanced diet'],
        preventions: ['Regular exercise', 'Balanced diet', 'Adequate sleep', 'Stress management'],
        riskFactors: ['Sedentary lifestyle', 'Poor diet', 'Lack of sleep'],
        category: 'Normal',
        severity: 'None'
      },
      {
        name: 'Diabetes',
        description: 'A group of metabolic disorders characterized by high blood sugar levels',
        symptoms: ['Frequent urination', 'Increased thirst', 'Unexplained weight loss', 'Fatigue', 'Blurred vision'],
        causes: ['Insulin resistance', 'Genetics', 'Obesity', 'Sedentary lifestyle', 'Age'],
        treatments: ['Insulin therapy', 'Oral medications', 'Diet modification', 'Regular exercise', 'Blood glucose monitoring'],
        preventions: ['Maintain healthy weight', 'Regular physical activity', 'Balanced diet', 'Avoid refined sugars'],
        riskFactors: ['Family history', 'Obesity', 'Age over 45', 'Sedentary lifestyle', 'High blood pressure'],
        category: 'Metabolic',
        severity: 'Moderate to High'
      },
      {
        name: 'Anemia',
        description: 'A condition where the blood lacks enough healthy red blood cells or hemoglobin',
        symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath', 'Dizziness', 'Cold hands and feet'],
        causes: ['Iron deficiency', 'Vitamin deficiency', 'Chronic diseases', 'Blood loss', 'Genetic disorders'],
        treatments: ['Iron supplements', 'Vitamin supplements', 'Dietary changes', 'Treatment of underlying causes'],
        preventions: ['Iron-rich diet', 'Vitamin C intake', 'Regular medical check-ups', 'Manage chronic conditions'],
        riskFactors: ['Poor diet', 'Menstruation', 'Pregnancy', 'Chronic kidney disease', 'Family history'],
        category: 'Hematologic',
        severity: 'Mild to Moderate'
      },
      {
        name: 'Thalassemia',
        description: 'An inherited blood disorder that affects the production of hemoglobin',
        symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Facial bone deformities', 'Slow growth', 'Abdominal swelling'],
        causes: ['Genetic mutations', 'Inherited from parents', 'Alpha or beta globin gene defects'],
        treatments: ['Blood transfusions', 'Chelation therapy', 'Bone marrow transplant', 'Folic acid supplements'],
        preventions: ['Genetic counseling', 'Carrier screening', 'Prenatal diagnosis'],
        riskFactors: ['Mediterranean ancestry', 'Asian ancestry', 'African ancestry', 'Family history'],
        category: 'Genetic',
        severity: 'Moderate to Severe'
      },
      {
        name: 'Thrombocytopenia',
        description: 'A condition characterized by low platelet count in the blood',
        symptoms: ['Easy bruising', 'Excessive bleeding', 'Petechial rash', 'Prolonged bleeding from cuts', 'Heavy menstrual periods'],
        causes: ['Immune system disorders', 'Medications', 'Infections', 'Bone marrow disorders', 'Enlarged spleen'],
        treatments: ['Platelet transfusions', 'Medications to increase platelet production', 'Splenectomy', 'Immunosuppressive therapy'],
        preventions: ['Avoid medications that affect platelets', 'Manage underlying conditions', 'Protective measures to prevent injury'],
        riskFactors: ['Autoimmune disorders', 'Certain medications', 'Viral infections', 'Bone marrow diseases'],
        category: 'Hematologic',
        severity: 'Moderate to High'
      },
      {
        name: 'Heart Disease',
        description: 'Various conditions that affect the heart and blood vessels',
        symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Irregular heartbeat', 'Swelling in legs and feet'],
        causes: ['High cholesterol', 'High blood pressure', 'Smoking', 'Diabetes', 'Obesity', 'Family history'],
        treatments: ['Lifestyle changes', 'Medications', 'Medical procedures', 'Surgery', 'Cardiac rehabilitation'],
        preventions: ['Healthy diet', 'Regular exercise', 'No smoking', 'Limit alcohol', 'Stress management', 'Regular check-ups'],
        riskFactors: ['Age', 'Gender', 'Family history', 'Smoking', 'High cholesterol', 'High blood pressure', 'Diabetes'],
        category: 'Cardiovascular',
        severity: 'High'
      }
    ];

    for (const disease of diseaseData) {
      await db.insert(diseases).values(disease);
    }

    console.log('Disease data seeded successfully!');
  } catch (error) {
    console.error('Error seeding disease data:', error);
  }
}

export { setupDatabase };