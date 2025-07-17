export const TEAM_MEMBERS = [
  {
    name: "ARIIK ANTHONY MATHIANG",
    role: "ML Engineer",
    description: "Solution architect specializing in medical domain feature engineering and ensemble model implementation.",
    avatar: "A"
  },
  {
    name: "JONGKUCH CHOL ANYAR", 
    role: "Data Scientist",
    description: "Expert in data analysis and machine learning model optimization with focus on healthcare applications.",
    avatar: "J"
  },
  {
    name: "JOK JOHN MAKEER",
    role: "ML Engineer", 
    description: "Specialized in feature engineering and model validation with extensive experience in ensemble methods.",
    avatar: "J"
  }
];

export const DISEASE_CLASSES = [
  { name: "Diabetes", percentage: 60.5, samples: 294, color: "hsl(228, 84%, 35%)" },
  { name: "Anemia", percentage: 17.3, samples: 84, color: "hsl(44, 93%, 56%)" },
  { name: "Thalassemia", percentage: 9.9, samples: 48, color: "hsl(0, 73%, 49%)" },
  { name: "Heart Disease", percentage: 8.0, samples: 39, color: "hsl(162, 94%, 30%)" },
  { name: "Thrombocytopenia", percentage: 3.3, samples: 16, color: "hsl(269, 84%, 68%)" },
  { name: "Healthy", percentage: 1.0, samples: 5, color: "hsl(210, 14%, 53%)" }
];

export const FEATURE_IMPORTANCE = [
  { name: "Mean Corpuscular Hemoglobin", importance: 9.44 },
  { name: "Hematocrit", importance: 6.17 },
  { name: "White Blood Cells", importance: 5.65 },
  { name: "Red Blood Cells", importance: 4.79 },
  { name: "Platelets", importance: 4.01 }
];

export const MEDICAL_FEATURES = [
  "Cholesterol_HDL_Ratio",
  "LDL_HDL_Ratio", 
  "Glucose_Insulin_Ratio",
  "Hemoglobin_RBC_Ratio",
  "BP_Product",
  "Cardiac_Risk_Score",
  "Metabolic_Score",
  "Anemia_Score",
  "Iron_Status",
  "Liver_Function"
];

export const PROJECT_STATS = {
  targetAccuracy: 98.55,
  medicalParameters: 24,
  diseaseTypes: 6,
  trainingSamples: 0, // Will be updated dynamically
  testSamples: 0, // Will be updated dynamically
  engineeredFeatures: 13
};
