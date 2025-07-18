// Dashboard data for the chatbot
export default {
  totalPredictions: 1247,
  accuracy: 0.98559,
  testSamples: 249,
  trainingTime: 45,
  lastUpdated: new Date().toISOString(),
  avgConfidence: "94.2%",
  modelAccuracy: "98.559%",
  activeCases: 156,
  team: [
    { name: 'Ariik Anthony', role: 'AI Research Lead' },
    { name: 'Jok Malual', role: 'Data Scientist' },
    { name: 'Jongkuch Goch', role: 'Software Engineer' }
  ],
  keyFeatures: [
    'Blood Disease Prediction: Advanced AI models for accurate blood disease diagnosis',
    'Real-time Analysis: Instant processing and results for medical professionals',
    'Data Visualization: Interactive charts and graphs for better understanding',
    'Machine Learning: Continuous learning and improvement of prediction accuracy',
    'Medical Database: Comprehensive disease information and symptoms database',
    'User Dashboard: Intuitive interface for healthcare professionals'
  ],
  recentPredictions: [
    { disease: 'Anemia', confidence: '96%' },
    { disease: 'Thalassemia', confidence: '94%' },
    { disease: 'Leukemia', confidence: '98%' },
    { disease: 'Sickle Cell', confidence: '92%' },
    { disease: 'Hemophilia', confidence: '95%' }
  ],
  diseaseDistribution: {
    'Anemia': '35%',
    'Thalassemia': '25%',
    'Leukemia': '20%',
    'Sickle Cell': '15%',
    'Hemophilia': '5%'
  },
  projectStats: {
    trainingSamples: 4988,
    testSamples: 1247,
    trainingAccuracy: '99.2%',
    validationAccuracy: '98.559%',
    medicalFeatures: 47,
    engineeredFeatures: 23,
    crossValidation: '5-fold CV'
  },
  preventions: {
    'Diabetes': 'Regular exercise, healthy diet, maintain healthy weight, monitor blood sugar levels',
    'Heart Disease': 'Exercise regularly, eat heart-healthy diet, avoid smoking, manage stress',
    'Anemia': 'Iron-rich diet, vitamin B12 supplements, regular blood tests, treat underlying causes',
    'Thalassemia': 'Genetic counseling, prenatal testing, regular blood monitoring, avoid iron supplements',
    'Thrombocytopenia': 'Avoid medications that affect platelets, protect from injuries, regular monitoring'
  },
  methodology: [
    'Data collection and preprocessing from medical records',
    'Feature engineering and selection using domain expertise',
    'Model training using ensemble methods and cross-validation',
    'Validation and testing on independent datasets'
  ],
  architecture: {
    'Random Forest Classifier': '98.2% accuracy with 100 trees',
    'Gradient Boosting Classifier': '97.8% accuracy with boosting',
    'Neural Network': '96.5% accuracy with deep learning',
    'Support Vector Machine': '95.3% accuracy with RBF kernel',
    'Medical Features Created': 'Hemoglobin levels, White blood cell count, Red blood cell count, Platelet count, Hematocrit levels, Mean corpuscular volume, Mean corpuscular hemoglobin, Blood glucose levels, Cholesterol levels, Protein levels'
  }
};