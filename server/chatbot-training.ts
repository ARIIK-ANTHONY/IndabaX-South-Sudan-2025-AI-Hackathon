// Medical Training Dataset for Chatbot
import { DiseaseInfo, getAllDiseases } from './disease-database';

// Training data structure for medical conversations
export interface TrainingExample {
  input: string;
  output: string;
  context: string;
  disease?: string;
  intent: string;
  confidence: number;
}

// Medical conversation patterns for training
export const medicalTrainingDataset: TrainingExample[] = [
  // Symptom Recognition Training
  {
    input: "I've been feeling very tired lately and I'm always exhausted",
    output: "Fatigue and exhaustion can be symptoms of several blood conditions, particularly anemia. Have you noticed any other symptoms like pale skin, shortness of breath, or dizziness? When did you first start feeling this way?",
    context: "symptom_assessment",
    disease: "anemia",
    intent: "symptom_inquiry",
    confidence: 0.95
  },
  {
    input: "I bruise easily and my cuts take long to stop bleeding",
    output: "Easy bruising and prolonged bleeding are concerning symptoms that could indicate thrombocytopenia or other blood clotting disorders. Have you noticed any other symptoms like nosebleeds or heavy menstrual periods? I'd recommend getting a complete blood count test to check your platelet levels.",
    context: "symptom_assessment",
    disease: "thrombocytopenia",
    intent: "symptom_inquiry",
    confidence: 0.92
  },
  {
    input: "I've been having chest pain and feel short of breath",
    output: "Chest pain and shortness of breath are serious symptoms that require immediate medical attention. These could be signs of heart disease or other cardiovascular issues. If you're experiencing severe chest pain, please seek emergency medical care immediately. Have you checked your cholesterol levels recently?",
    context: "emergency_assessment",
    disease: "heart_disease",
    intent: "urgent_symptoms",
    confidence: 0.98
  },
  {
    input: "I'm always thirsty and urinate frequently",
    output: "Increased thirst and frequent urination are classic symptoms of diabetes. Have you noticed any other symptoms like unexplained weight loss, blurred vision, or slow-healing wounds? I'd strongly recommend getting your blood glucose levels checked as soon as possible.",
    context: "symptom_assessment",
    disease: "diabetes",
    intent: "symptom_inquiry",
    confidence: 0.96
  },
  {
    input: "My skin looks pale and I feel cold all the time",
    output: "Pale skin and feeling cold frequently can be symptoms of anemia, particularly iron-deficiency anemia. Have you noticed any changes in your energy levels, or do you experience shortness of breath during normal activities? A blood test checking your hemoglobin levels would be very helpful.",
    context: "symptom_assessment",
    disease: "anemia",
    intent: "symptom_inquiry",
    confidence: 0.94
  },
  {
    input: "I have a family history of blood disorders",
    output: "Family history is very important for blood disorders, especially conditions like thalassemia which are hereditary. Can you tell me more about the specific blood disorder in your family? Have you experienced any symptoms like fatigue, pale skin, or shortness of breath? I'd recommend genetic counseling and regular blood monitoring.",
    context: "family_history",
    disease: "thalassemia",
    intent: "risk_assessment",
    confidence: 0.91
  },

  // Treatment Guidance Training
  {
    input: "What treatment options are available for anemia?",
    output: "Treatment for anemia depends on the underlying cause. Iron-deficiency anemia is often treated with iron supplements and dietary changes including iron-rich foods like red meat, spinach, and beans. Vitamin B12 or folate deficiency anemia requires specific vitamin supplementation. More severe cases might need blood transfusions. It's important to identify and treat the underlying cause.",
    context: "treatment_inquiry",
    disease: "anemia",
    intent: "treatment_information",
    confidence: 0.93
  },
  {
    input: "How can I manage my diabetes through diet?",
    output: "Diabetes management through diet involves controlling carbohydrate intake, choosing low glycemic index foods, and maintaining regular meal timing. Focus on whole grains, lean proteins, healthy fats, and plenty of vegetables. Monitor portion sizes and limit processed foods, sugary drinks, and refined carbohydrates. Regular blood glucose monitoring is essential to see how foods affect your levels.",
    context: "treatment_inquiry",
    disease: "diabetes",
    intent: "lifestyle_management",
    confidence: 0.95
  },
  {
    input: "What should I do if I have low platelet count?",
    output: "Low platelet count (thrombocytopenia) requires careful management to prevent bleeding. Avoid activities that could cause injury, use a soft toothbrush, and be cautious with sharp objects. Treatment depends on the underlying cause - it might include medications to increase platelet production, reducing medications that affect platelets, or in severe cases, platelet transfusions. Regular monitoring is crucial.",
    context: "treatment_inquiry",
    disease: "thrombocytopenia",
    intent: "treatment_information",
    confidence: 0.90
  },

  // Diagnostic Guidance Training
  {
    input: "What blood tests do I need to check for diabetes?",
    output: "For diabetes screening, the main tests include: Fasting Blood Glucose (normal: 70-100 mg/dL), Hemoglobin A1C (normal: <5.7%), and Oral Glucose Tolerance Test. Random blood glucose can also be used. A1C is particularly useful as it shows average blood sugar over 2-3 months. If you have risk factors like family history, obesity, or symptoms, regular screening is important.",
    context: "diagnostic_inquiry",
    disease: "diabetes",
    intent: "test_information",
    confidence: 0.97
  },
  {
    input: "How do I interpret my blood test results?",
    output: "Blood test interpretation depends on the specific parameters. For example: Hemoglobin (normal: 12-16 g/dL for women, 14-18 g/dL for men), Platelets (normal: 150,000-450,000 per microliter), Glucose (normal fasting: 70-100 mg/dL), Cholesterol (total <200 mg/dL desirable). However, results should always be interpreted by a healthcare provider considering your symptoms, medical history, and other factors.",
    context: "diagnostic_inquiry",
    disease: "general",
    intent: "test_interpretation",
    confidence: 0.89
  },

  // Prevention Education Training
  {
    input: "How can I prevent heart disease?",
    output: "Heart disease prevention involves multiple lifestyle approaches: maintain a healthy diet low in saturated fats and cholesterol, exercise regularly (at least 150 minutes per week), maintain healthy weight, don't smoke, limit alcohol consumption, manage stress, and control blood pressure and diabetes. Regular cholesterol and blood pressure monitoring is essential. A Mediterranean-style diet is particularly beneficial.",
    context: "prevention_inquiry",
    disease: "heart_disease",
    intent: "prevention_information",
    confidence: 0.94
  },
  {
    input: "What can I do to prevent anemia?",
    output: "Anemia prevention focuses on ensuring adequate nutrient intake: eat iron-rich foods (red meat, poultry, fish, beans, spinach), vitamin C helps iron absorption, include B12 sources (dairy, eggs, fortified cereals), and folate-rich foods (leafy greens, citrus fruits). For women, adequate iron intake during menstruation is crucial. Vegetarians may need supplements and should focus on plant-based iron sources with vitamin C.",
    context: "prevention_inquiry",
    disease: "anemia",
    intent: "prevention_information",
    confidence: 0.92
  },

  // Emergency Situations Training
  {
    input: "I have severe chest pain and difficulty breathing",
    output: "URGENT: Severe chest pain and difficulty breathing require immediate emergency medical attention. Please call 911 or go to the nearest emergency room immediately. These symptoms could indicate a heart attack, pulmonary embolism, or other life-threatening conditions. Do not wait or try to treat this yourself. Time is critical in these situations.",
    context: "emergency_situation",
    disease: "heart_disease",
    intent: "emergency_response",
    confidence: 0.99
  },
  {
    input: "I'm bleeding heavily and can't stop it",
    output: "Heavy bleeding that won't stop is a medical emergency. Apply direct pressure to the wound with a clean cloth and elevate the area if possible. If bleeding continues or you feel faint, call 911 immediately. This could indicate a serious bleeding disorder or injury requiring immediate medical intervention. Do not delay seeking emergency care.",
    context: "emergency_situation",
    disease: "thrombocytopenia",
    intent: "emergency_response",
    confidence: 0.98
  },

  // Medication Guidance Training
  {
    input: "What medications are used for diabetes?",
    output: "Diabetes medications include several classes: Metformin (first-line for type 2), Insulin (essential for type 1, sometimes type 2), Sulfonylureas (stimulate insulin production), SGLT2 inhibitors (help kidneys remove glucose), DPP-4 inhibitors (help regulate blood sugar), and GLP-1 agonists (slow digestion, regulate blood sugar). Choice depends on type of diabetes, blood sugar levels, and individual factors. Always consult your doctor for personalized treatment.",
    context: "medication_inquiry",
    disease: "diabetes",
    intent: "medication_information",
    confidence: 0.91
  },

  // Lifestyle Counseling Training
  {
    input: "How does exercise affect blood sugar?",
    output: "Exercise has powerful effects on blood sugar: it increases insulin sensitivity, helps muscles use glucose for energy, and can lower blood sugar for hours after exercise. For people with diabetes, regular exercise can significantly improve blood sugar control. However, monitor blood sugar before, during, and after exercise, especially if taking insulin or other diabetes medications. Start slowly and increase intensity gradually.",
    context: "lifestyle_inquiry",
    disease: "diabetes",
    intent: "lifestyle_counseling",
    confidence: 0.93
  },

  // Complication Awareness Training
  {
    input: "What are the complications of untreated diabetes?",
    output: "Untreated diabetes can lead to serious complications: diabetic retinopathy (eye damage), diabetic nephropathy (kidney damage), diabetic neuropathy (nerve damage), cardiovascular disease, poor wound healing, increased infection risk, and diabetic ketoacidosis (emergency condition). Early detection and proper management can prevent or delay these complications. Regular monitoring and adherence to treatment are crucial.",
    context: "complication_inquiry",
    disease: "diabetes",
    intent: "complication_education",
    confidence: 0.96
  },

  // Support and Counseling Training
  {
    input: "I'm scared about my blood test results",
    output: "It's completely natural to feel scared about blood test results - many people experience anxiety around medical tests. Remember that early detection is actually a positive thing because it allows for early treatment. Many blood conditions are very manageable with proper care. Can you tell me more about what specific results are concerning you? We can discuss what they mean and what steps you can take.",
    context: "emotional_support",
    disease: "general",
    intent: "emotional_counseling",
    confidence: 0.88
  },
  {
    input: "How do I cope with a chronic blood disorder?",
    output: "Living with a chronic blood disorder can be challenging, but many people live full, healthy lives with proper management. Focus on: following your treatment plan consistently, maintaining regular medical check-ups, staying educated about your condition, building a support network, managing stress through relaxation techniques, maintaining a healthy lifestyle, and communicating openly with your healthcare team. Remember, you're not alone in this journey.",
    context: "emotional_support",
    disease: "general",
    intent: "coping_strategies",
    confidence: 0.90
  }
];

// Symptom to disease mapping for training
export const symptomDiseaseMapping = {
  fatigue: ['anemia', 'diabetes', 'heart_disease', 'thalassemia'],
  weakness: ['anemia', 'thalassemia'],
  pale_skin: ['anemia', 'thalassemia'],
  shortness_of_breath: ['anemia', 'heart_disease', 'thalassemia'],
  chest_pain: ['heart_disease'],
  dizziness: ['anemia', 'diabetes'],
  frequent_urination: ['diabetes'],
  excessive_thirst: ['diabetes'],
  blurred_vision: ['diabetes'],
  easy_bruising: ['thrombocytopenia'],
  prolonged_bleeding: ['thrombocytopenia'],
  nosebleeds: ['thrombocytopenia'],
  cold_hands_feet: ['anemia'],
  rapid_heartbeat: ['anemia', 'heart_disease'],
  weight_loss: ['diabetes'],
  slow_healing: ['diabetes'],
  jaundice: ['thalassemia'],
  enlarged_spleen: ['thalassemia']
};

// Training categories for intent classification
export const trainingCategories = {
  symptom_inquiry: {
    patterns: ['I have', 'I feel', 'I experience', 'symptoms', 'feeling', 'pain', 'tired', 'weak'],
    responses: 'symptom_assessment'
  },
  treatment_information: {
    patterns: ['treatment', 'cure', 'medicine', 'medication', 'therapy', 'how to treat'],
    responses: 'treatment_guidance'
  },
  prevention_information: {
    patterns: ['prevent', 'avoid', 'stop', 'reduce risk', 'prevention'],
    responses: 'prevention_education'
  },
  test_information: {
    patterns: ['test', 'blood test', 'diagnosis', 'check', 'screen', 'results'],
    responses: 'diagnostic_guidance'
  },
  emergency_response: {
    patterns: ['severe', 'emergency', 'urgent', 'help', 'bad', 'serious', 'intense'],
    responses: 'emergency_situation'
  },
  emotional_support: {
    patterns: ['scared', 'worried', 'afraid', 'anxious', 'concerned', 'fear'],
    responses: 'emotional_counseling'
  },
  lifestyle_counseling: {
    patterns: ['diet', 'exercise', 'lifestyle', 'food', 'eat', 'activity'],
    responses: 'lifestyle_guidance'
  }
};

// Advanced training patterns for natural language understanding
export const advancedTrainingPatterns = {
  greeting_patterns: [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'greetings', 'howdy', 'what\'s up', 'how are you'
  ],
  symptom_patterns: [
    'I have been feeling', 'I experience', 'I notice', 'I suffer from',
    'I\'ve been having', 'lately I', 'recently I', 'symptoms include'
  ],
  question_patterns: [
    'what is', 'what are', 'how do', 'how can', 'why do', 'when should',
    'where can', 'tell me about', 'explain', 'help me understand'
  ],
  concern_patterns: [
    'worried about', 'concerned about', 'scared of', 'afraid of',
    'anxious about', 'nervous about', 'confused about'
  ],
  urgency_patterns: [
    'urgent', 'emergency', 'severe', 'intense', 'immediate', 'right now',
    'help me', 'what should I do', 'I need help'
  ]
};

// Training function to improve chatbot responses
export function trainChatbot() {
  console.log('Training chatbot with medical dataset...');
  
  // Process training examples
  const processedExamples = medicalTrainingDataset.map(example => ({
    ...example,
    processedInput: preprocessText(example.input),
    keywords: extractKeywords(example.input),
    intent: classifyIntent(example.input)
  }));
  
  console.log(`Processed ${processedExamples.length} training examples`);
  
  // Build knowledge graph
  const knowledgeGraph = buildKnowledgeGraph(processedExamples);
  
  console.log('Chatbot training completed');
  return {
    processedExamples,
    knowledgeGraph,
    trainingStats: {
      totalExamples: processedExamples.length,
      categories: Object.keys(trainingCategories).length,
      diseases: Object.keys(symptomDiseaseMapping).length
    }
  };
}

// Text preprocessing function
function preprocessText(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Keyword extraction function
function extractKeywords(text: string): string[] {
  const commonWords = ['i', 'me', 'my', 'the', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  
  return preprocessText(text)
    .split(' ')
    .filter(word => word.length > 2 && !commonWords.includes(word));
}

// Intent classification function
function classifyIntent(text: string): string {
  const processedText = preprocessText(text);
  
  for (const [intent, category] of Object.entries(trainingCategories)) {
    const patterns = category.patterns;
    if (patterns.some(pattern => processedText.includes(pattern.toLowerCase()))) {
      return intent;
    }
  }
  
  return 'general_inquiry';
}

// Knowledge graph builder
function buildKnowledgeGraph(examples: any[]): any {
  const graph = {
    symptoms: {},
    diseases: {},
    treatments: {},
    connections: []
  };
  
  examples.forEach(example => {
    const keywords = example.keywords;
    const disease = example.disease;
    const intent = example.intent;
    
    // Build symptom-disease connections
    keywords.forEach(keyword => {
      if (symptomDiseaseMapping[keyword]) {
        symptomDiseaseMapping[keyword].forEach(diseaseKey => {
          graph.connections.push({
            from: keyword,
            to: diseaseKey,
            type: 'symptom_disease',
            confidence: example.confidence
          });
        });
      }
    });
  });
  
  return graph;
}

// Export training data for use in chatbot
export const trainingData = {
  dataset: medicalTrainingDataset,
  categories: trainingCategories,
  patterns: advancedTrainingPatterns,
  mapping: symptomDiseaseMapping
};
