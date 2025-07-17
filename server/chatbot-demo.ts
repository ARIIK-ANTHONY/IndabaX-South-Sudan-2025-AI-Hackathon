// Training Demo and Visualization System
import { medicalTrainingDataset, trainingData, symptomDiseaseMapping } from './chatbot-training';

// Training demo examples
export const trainingDemoExamples = [
  {
    id: '1',
    userInput: "I've been feeling very tired and weak lately",
    expectedOutput: "Fatigue and weakness can be symptoms of several blood conditions, particularly anemia",
    actualOutput: "",
    confidence: 0.95,
    intent: "symptom_inquiry",
    disease: "anemia"
  },
  {
    id: '2',
    userInput: "I bruise easily and have frequent nosebleeds",
    expectedOutput: "Easy bruising and frequent nosebleeds are concerning symptoms that could indicate thrombocytopenia",
    actualOutput: "",
    confidence: 0.92,
    intent: "symptom_inquiry",
    disease: "thrombocytopenia"
  },
  {
    id: '3',
    userInput: "What treatment options are available for diabetes?",
    expectedOutput: "Treatment for diabetes includes medication management, dietary changes, and lifestyle modifications",
    actualOutput: "",
    confidence: 0.94,
    intent: "treatment_information",
    disease: "diabetes"
  },
  {
    id: '4',
    userInput: "How can I prevent heart disease?",
    expectedOutput: "Heart disease prevention involves maintaining a healthy diet, regular exercise, and managing risk factors",
    actualOutput: "",
    confidence: 0.91,
    intent: "prevention_information",
    disease: "heart_disease"
  },
  {
    id: '5',
    userInput: "I'm scared about my blood test results",
    expectedOutput: "It's completely natural to feel scared about blood test results - many people experience anxiety around medical tests",
    actualOutput: "",
    confidence: 0.88,
    intent: "emotional_support",
    disease: "general"
  }
];

// Training statistics
export function getTrainingStats() {
  const totalExamples = medicalTrainingDataset.length;
  const intents = [...new Set(medicalTrainingDataset.map(ex => ex.intent))];
  const diseases = [...new Set(medicalTrainingDataset.map(ex => ex.disease).filter(d => d))];
  const avgConfidence = medicalTrainingDataset.reduce((sum, ex) => sum + ex.confidence, 0) / totalExamples;
  
  return {
    totalExamples,
    totalIntents: intents.length,
    totalDiseases: diseases.length,
    avgConfidence: avgConfidence.toFixed(3),
    intents,
    diseases,
    symptomMappings: Object.keys(symptomDiseaseMapping).length
  };
}

// Training performance metrics
export function calculateTrainingMetrics(testResults: any[]) {
  const totalTests = testResults.length;
  const correctPredictions = testResults.filter(result => result.correct).length;
  const accuracy = (correctPredictions / totalTests) * 100;
  
  const intentAccuracy = {};
  const diseaseAccuracy = {};
  
  // Calculate per-intent accuracy
  for (const result of testResults) {
    const intent = result.intent;
    if (!intentAccuracy[intent]) {
      intentAccuracy[intent] = { correct: 0, total: 0 };
    }
    intentAccuracy[intent].total++;
    if (result.correct) {
      intentAccuracy[intent].correct++;
    }
  }
  
  // Calculate per-disease accuracy
  for (const result of testResults) {
    const disease = result.disease;
    if (disease && disease !== 'general') {
      if (!diseaseAccuracy[disease]) {
        diseaseAccuracy[disease] = { correct: 0, total: 0 };
      }
      diseaseAccuracy[disease].total++;
      if (result.correct) {
        diseaseAccuracy[disease].correct++;
      }
    }
  }
  
  return {
    overall: {
      accuracy: accuracy.toFixed(2),
      totalTests,
      correctPredictions
    },
    byIntent: Object.entries(intentAccuracy).map(([intent, stats]) => ({
      intent,
      accuracy: ((stats.correct / stats.total) * 100).toFixed(2),
      correct: stats.correct,
      total: stats.total
    })),
    byDisease: Object.entries(diseaseAccuracy).map(([disease, stats]) => ({
      disease,
      accuracy: ((stats.correct / stats.total) * 100).toFixed(2),
      correct: stats.correct,
      total: stats.total
    }))
  };
}

// Training validation system
export function validateTrainingData() {
  const validationResults = [];
  
  for (const example of medicalTrainingDataset) {
    const validation = {
      id: example.input.substring(0, 30) + '...',
      hasInput: !!example.input,
      hasOutput: !!example.output,
      hasIntent: !!example.intent,
      hasContext: !!example.context,
      confidenceInRange: example.confidence >= 0 && example.confidence <= 1,
      inputLength: example.input.length,
      outputLength: example.output.length,
      isValid: true
    };
    
    validation.isValid = validation.hasInput && validation.hasOutput && 
                        validation.hasIntent && validation.confidenceInRange;
    
    validationResults.push(validation);
  }
  
  const totalValid = validationResults.filter(v => v.isValid).length;
  const validationScore = (totalValid / validationResults.length) * 100;
  
  return {
    score: validationScore.toFixed(2),
    totalExamples: validationResults.length,
    validExamples: totalValid,
    invalidExamples: validationResults.length - totalValid,
    details: validationResults
  };
}

// Export training report
export function generateTrainingReport() {
  const stats = getTrainingStats();
  const validation = validateTrainingData();
  
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalTrainingExamples: stats.totalExamples,
      totalIntents: stats.totalIntents,
      totalDiseases: stats.totalDiseases,
      avgConfidence: stats.avgConfidence,
      validationScore: validation.score
    },
    details: {
      intents: stats.intents,
      diseases: stats.diseases,
      symptomMappings: stats.symptomMappings,
      validation: validation
    },
    recommendations: generateTrainingRecommendations(stats, validation)
  };
}

// Generate training recommendations
function generateTrainingRecommendations(stats: any, validation: any) {
  const recommendations = [];
  
  if (parseFloat(stats.avgConfidence) < 0.85) {
    recommendations.push({
      type: 'confidence',
      message: 'Average confidence is below 85%. Consider reviewing and improving training examples.',
      priority: 'high'
    });
  }
  
  if (parseFloat(validation.score) < 95) {
    recommendations.push({
      type: 'validation',
      message: 'Validation score is below 95%. Review invalid training examples.',
      priority: 'medium'
    });
  }
  
  if (stats.totalExamples < 50) {
    recommendations.push({
      type: 'data_size',
      message: 'Consider adding more training examples for better coverage.',
      priority: 'low'
    });
  }
  
  if (stats.totalIntents < 8) {
    recommendations.push({
      type: 'intent_diversity',
      message: 'Consider adding more intent categories for better understanding.',
      priority: 'medium'
    });
  }
  
  return recommendations;
}

// Demo conversation examples
export const demoConversations = [
  {
    title: "Symptom Assessment",
    conversation: [
      { role: "user", message: "I've been feeling very tired and weak lately" },
      { role: "bot", message: "Fatigue and weakness can be symptoms of several blood conditions, particularly anemia. Have you noticed any other symptoms like pale skin, shortness of breath, or dizziness? When did you first start feeling this way?" },
      { role: "user", message: "Yes, I've been short of breath during normal activities" },
      { role: "bot", message: "Shortness of breath during normal activities, combined with fatigue and weakness, are concerning symptoms that could indicate anemia. I'd strongly recommend getting a complete blood count (CBC) test to check your hemoglobin levels. Have you noticed any changes in your skin color or if you feel cold frequently?" }
    ]
  },
  {
    title: "Treatment Inquiry",
    conversation: [
      { role: "user", message: "What treatment options are available for diabetes?" },
      { role: "bot", message: "Treatment for diabetes depends on the type and severity. For Type 2 diabetes, treatment often includes: Metformin (first-line medication), lifestyle changes like diet and exercise, blood sugar monitoring, and potentially insulin or other medications. For Type 1 diabetes, insulin therapy is essential. Would you like more specific information about any of these treatment approaches?" },
      { role: "user", message: "Tell me more about dietary management" },
      { role: "bot", message: "Diabetes management through diet involves controlling carbohydrate intake, choosing low glycemic index foods, and maintaining regular meal timing. Focus on whole grains, lean proteins, healthy fats, and plenty of vegetables. Monitor portion sizes and limit processed foods, sugary drinks, and refined carbohydrates. Regular blood glucose monitoring is essential to see how foods affect your levels." }
    ]
  },
  {
    title: "Prevention Guidance",
    conversation: [
      { role: "user", message: "How can I prevent heart disease?" },
      { role: "bot", message: "Heart disease prevention involves multiple lifestyle approaches: maintain a healthy diet low in saturated fats and cholesterol, exercise regularly (at least 150 minutes per week), maintain healthy weight, don't smoke, limit alcohol consumption, manage stress, and control blood pressure and diabetes. Would you like specific guidance on any of these areas?" },
      { role: "user", message: "What kind of diet should I follow?" },
      { role: "bot", message: "A Mediterranean-style diet is particularly beneficial for heart health. Focus on: olive oil as your primary fat source, plenty of fruits and vegetables, whole grains, legumes, nuts, fish (especially fatty fish rich in omega-3s), and limited red meat. Avoid processed foods, trans fats, and excessive sodium. This dietary pattern has been shown to significantly reduce cardiovascular risk." }
    ]
  }
];
