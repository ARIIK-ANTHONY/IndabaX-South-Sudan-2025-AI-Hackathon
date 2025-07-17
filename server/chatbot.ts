// Simple AI chatbot implementation
import { nanoid } from 'nanoid';
import { storage } from './storage';
import dashboardData from './chatbot-data';
import { getDiseaseInfo, getAllDiseases, DiseaseInfo } from './disease-database';
import { MedicalKnowledgeEngine } from './knowledge-engine';
import { 
  trainChatbot, 
  trainingData, 
  medicalTrainingDataset, 
  symptomDiseaseMapping,
  TrainingExample 
} from './chatbot-training';

// Function to get dynamic dashboard data
async function getDynamicDashboardData() {
  const predictions = await storage.getAllPredictions();
  const totalPredictions = predictions.length;
  const testSamples = Math.floor(totalPredictions * 0.2);
  
  return {
    ...dashboardData,
    totalPredictions,
    trainingSamples: totalPredictions,
    testSamples,
    activeCases: Math.floor(totalPredictions * 0.3), // 30% of predictions as active cases
    avgConfidence: predictions.length > 0 ? 
      Math.round((predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length) * 100) / 100 : 
      0
  };
}

// Define types
export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export type ChatSession = {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

// In-memory storage for chat sessions
const chatSessions = new Map<string, ChatSession>();

// Initialize training system
let trainingModel: any = null;
let isTrainingComplete = false;
let knowledgeEngine: MedicalKnowledgeEngine | null = null;

// Initialize training and knowledge engine on startup
async function initializeTraining() {
  if (!isTrainingComplete) {
    console.log('Initializing chatbot training...');
    trainingModel = trainChatbot();
    
    console.log('Initializing knowledge engine...');
    knowledgeEngine = new MedicalKnowledgeEngine();
    
    isTrainingComplete = true;
    console.log('Chatbot training and knowledge engine initialized successfully');
  }
}

// Advanced response generation using knowledge engine
async function generateTrainedResponse(userMessage: string, sessionId: string): Promise<string> {
  // Ensure knowledge engine is initialized
  if (!knowledgeEngine) {
    await initializeTraining();
  }
  
  // Get user's conversation history for context
  const session = getChatSession(sessionId);
  const userHistory = session ? session.messages.filter(msg => msg.sender === 'user').map(msg => msg.text) : [];
  
  try {
    // First, try to use the knowledge engine for intelligent response
    if (knowledgeEngine) {
      const knowledgeResponse = await knowledgeEngine.processQuestion(userMessage, userHistory);
      
      // If knowledge engine provides a good response, use it
      if (knowledgeResponse && knowledgeResponse.length > 50) {
        return knowledgeResponse;
      }
    }
    
    // Fall back to training-based response if knowledge engine doesn't have good answer
    const processedMessage = preprocessText(userMessage);
    const keywords = extractKeywords(userMessage);
    const intent = classifyIntent(userMessage);
    
    // Get dynamic dashboard data
    const dynamicData = await getDynamicDashboardData();
    
    // Check for exact matches in training data
    const exactMatch = medicalTrainingDataset.find(example => 
      similarity(processedMessage, preprocessText(example.input)) > 0.8
    );
    
    if (exactMatch) {
      return exactMatch.output;
    }
    
    // Check for symptom-based responses
    const symptomMatch = findSymptomMatch(keywords, userMessage);
    if (symptomMatch) {
      return symptomMatch;
    }
    
    // Check for disease-specific information
    const diseaseMatch = findDiseaseMatch(keywords, userMessage);
    if (diseaseMatch) {
      return diseaseMatch;
    }
    
    // Use intent-based response
    const intentResponse = generateIntentResponse(intent, keywords);
    if (intentResponse) {
      return intentResponse;
    }
    
    // Fall back to traditional knowledge base (now with dynamic data)
    return await generateKnowledgeBaseResponse(userMessage, dynamicData);
    
  } catch (error) {
    console.error('Error in generateTrainedResponse:', error);
    return "I apologize, but I encountered an error processing your question. Please try rephrasing it, and I'll do my best to help you with accurate medical information.";
  }
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
  
  for (const [intent, category] of Object.entries(trainingData.categories)) {
    const patterns = category.patterns;
    if (patterns.some(pattern => processedText.includes(pattern.toLowerCase()))) {
      return intent;
    }
  }
  
  return 'general_inquiry';
}

// Calculate similarity between two texts
function similarity(text1: string, text2: string): number {
  const words1 = text1.split(' ');
  const words2 = text2.split(' ');
  const intersection = words1.filter(word => words2.includes(word));
  const union = Array.from(new Set([...words1, ...words2]));
  return intersection.length / union.length;
}

// Find symptom-based matches
function findSymptomMatch(keywords: string[], userMessage: string): string | null {
  const lowerMessage = userMessage.toLowerCase();
  
  const symptomsFound = keywords.filter(keyword => 
    Object.keys(symptomDiseaseMapping).includes(keyword.replace(/s$/, ''))
  );
  
  if (symptomsFound.length > 0) {
    const symptom = symptomsFound[0].replace(/s$/, '');
    const relatedDiseases = symptomDiseaseMapping[symptom as keyof typeof symptomDiseaseMapping];
    
    if (relatedDiseases) {
      const diseaseList = relatedDiseases.join(', ');
      return `**Medical Information - ${symptom.charAt(0).toUpperCase() + symptom.slice(1)} Symptom:**\n\nThe symptom "${symptom}" can be associated with several conditions including:\n\n${relatedDiseases.map(disease => `• ${disease}`).join('\n')}\n\nThis symptom should be evaluated by a healthcare provider for proper diagnosis and treatment. Can you tell me more about when this symptom started and any other symptoms you're experiencing?\n\nWould you like more information about any of these specific conditions?`;
    }
  }
  
  return null;
}

// Find disease-specific matches
function findDiseaseMatch(keywords: string[], userMessage: string): string | null {
  const diseases = ['diabetes', 'anemia', 'thrombocytopenia', 'thalassemia', 'heart disease'];
  const lowerMessage = userMessage.toLowerCase();
  
  const diseaseFound = keywords.find(keyword => 
    diseases.some(disease => disease.includes(keyword) || keyword.includes(disease.replace(' ', '')))
  );
  
  if (diseaseFound) {
    let matchedDisease = diseaseFound;
    if (diseaseFound.includes('heart') || diseaseFound.includes('cardiac')) {
      matchedDisease = 'heart disease';
    }
    
    // Capitalize the disease name for database lookup
    const diseaseKey = matchedDisease.charAt(0).toUpperCase() + matchedDisease.slice(1);
    const diseaseInfo = getDiseaseInfo(diseaseKey);
    
    if (diseaseInfo) {
      // Check what specific information the user is asking for
      if (lowerMessage.includes('symptom') || lowerMessage.includes('sign')) {
        return `**${diseaseInfo.name} - Symptoms:**\n\nThe common symptoms of ${diseaseInfo.name.toLowerCase()} include:\n\n${diseaseInfo.symptoms.map(symptom => `• ${symptom}`).join('\n')}\n\nIf you're experiencing any of these symptoms, I recommend consulting with a healthcare provider for proper evaluation. Would you like to know about treatments or prevention strategies?`;
      }
      
      if (lowerMessage.includes('cause') || lowerMessage.includes('reason')) {
        return `**${diseaseInfo.name} - Causes:**\n\nThe main causes of ${diseaseInfo.name.toLowerCase()} include:\n\n${diseaseInfo.causes.map(cause => `• ${cause}`).join('\n')}\n\nUnderstanding the causes can help with prevention and treatment planning. Would you like to know more about treatments or prevention strategies?`;
      }
      
      if (lowerMessage.includes('treatment') || lowerMessage.includes('cure') || lowerMessage.includes('medicine')) {
        return `**${diseaseInfo.name} - Treatments:**\n\nTreatment options for ${diseaseInfo.name.toLowerCase()} include:\n\n${diseaseInfo.treatments.map(treatment => `• ${treatment}`).join('\n')}\n\nTreatment plans are individualized based on severity and other factors. Always consult with your healthcare provider before starting any treatment. Would you like to know about prevention strategies?`;
      }
      
      if (lowerMessage.includes('prevention') || lowerMessage.includes('prevent') || lowerMessage.includes('avoid')) {
        return `**${diseaseInfo.name} - Prevention:**\n\nTo help prevent ${diseaseInfo.name.toLowerCase()}, consider these strategies:\n\n${diseaseInfo.preventions.map(prevention => `• ${prevention}`).join('\n')}\n\nPrevention is often the best approach to maintaining good health. Would you like to know more about symptoms or treatments?`;
      }
      
      // Default comprehensive information
      return `**${diseaseInfo.name} - Complete Information:**\n\n**Description:** ${diseaseInfo.description}\n\n**Common Symptoms:**\n${diseaseInfo.symptoms.slice(0, 4).map(symptom => `• ${symptom}`).join('\n')}\n\n**Main Causes:**\n${diseaseInfo.causes.slice(0, 3).map(cause => `• ${cause}`).join('\n')}\n\n**Treatment Options:**\n${diseaseInfo.treatments.slice(0, 3).map(treatment => `• ${treatment}`).join('\n')}\n\nWould you like more detailed information about any specific aspect of ${diseaseInfo.name.toLowerCase()}?`;
    }
  }
  
  return null;
}

// Generate intent-based responses
function generateIntentResponse(intent: string, keywords: string[]): string | null {
  const responses = {
    symptom_inquiry: [
      "I understand you're experiencing symptoms. Can you describe them in more detail? This will help me provide better guidance about potential conditions and when to seek medical care.",
      "Symptoms can be concerning, but describing them clearly helps in understanding what might be happening. What specific symptoms are you experiencing, and how long have you had them?",
      "Let's work together to understand your symptoms. Can you tell me about their severity, duration, and any patterns you've noticed? This information is crucial for proper assessment."
    ],
    treatment_information: [
      "Treatment approaches vary depending on the specific condition and its severity. Can you tell me which condition you're asking about? I can provide information about various treatment options.",
      "I'd be happy to discuss treatment options. Each condition has different approaches - some focus on lifestyle changes, others on medications, and some on combination therapies. What specific condition interests you?",
      "Treatment planning is individualized based on many factors. Are you asking about a specific condition? I can explain the general approaches and what to expect."
    ],
    prevention_information: [
      "Prevention is often the best medicine! Many blood disorders can be prevented or their risk reduced through lifestyle modifications. What specific condition would you like prevention information about?",
      "I'm glad you're thinking about prevention - it's a proactive approach to health. Different conditions have different prevention strategies. Which area of blood health are you most concerned about?",
      "Prevention strategies vary by condition but often include diet, exercise, regular monitoring, and avoiding risk factors. What specific condition or risk factors are you concerned about?"
    ],
    emergency_response: [
      "If you're experiencing severe symptoms, it's important to seek immediate medical attention. Can you describe what you're experiencing? Some symptoms require emergency care.",
      "Severe or sudden symptoms should always be evaluated promptly. Are you experiencing chest pain, severe bleeding, difficulty breathing, or other concerning symptoms that need immediate attention?",
      "Your safety is the priority. If you're having severe symptoms, please consider calling emergency services or going to the nearest emergency room. Can you describe what you're experiencing?"
    ]
  };
  
  const responseArray = responses[intent as keyof typeof responses];
  if (responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }
  
  return null;
}

// Generate knowledge base response (fallback)
async function generateKnowledgeBaseResponse(userMessage: string, dynamicData?: any): Promise<string> {
  const lowerMessage = userMessage.toLowerCase();
  const dataToUse = dynamicData || await getDynamicDashboardData();
  
  // Create knowledge base with dynamic data
  const knowledgeBase = createKnowledgeBase(dataToUse);
  
  for (const entry of knowledgeBase) {
    for (const keyword of entry.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        const randomResponse = entry.responses[Math.floor(Math.random() * entry.responses.length)];
        return randomResponse;
      }
    }
  }
  
  return getRandomDefaultResponse();
}

// Create knowledge base with dynamic data
function createKnowledgeBase(data: any) {
  return [
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
      responses: [
        'Hello! I\'m Dr. CodeNomads, your virtual medical assistant specializing in blood disease analysis. I\'m here to help you understand your blood test results and provide medical guidance. How may I assist you today?',
        'Good day! I\'m Dr. CodeNomads, and I\'m here to help you with any questions about blood diseases, symptoms, or medical concerns. Please feel free to share what\'s on your mind.',
        'Hello there! As your virtual doctor, I\'m here to provide you with comprehensive information about blood-related health conditions. What would you like to discuss today?'
      ]
    },
    {
      keywords: ['total', 'predictions', 'total predictions'],
      responses: [
        `Currently, we have ${data.totalPredictions} total predictions in our system with an average confidence of ${data.avgConfidence} and model accuracy of ${data.modelAccuracy}.`,
        `Our dashboard shows ${data.totalPredictions} total predictions with ${data.activeCases} active cases. The model accuracy is ${data.modelAccuracy}, which is above our target of 98.55%.`,
        `We've made ${data.totalPredictions} predictions so far with an average confidence level of ${data.avgConfidence}. Our system is performing above the target accuracy with ${data.modelAccuracy} accuracy.`
      ]
    },
    {
      keywords: ['display', 'show', 'see', 'here'],
      responses: [
        `Here are the latest predictions: ${data.recentPredictions.slice(0, 5).map((p: any) => `${p.disease} (${p.confidence} confidence)`).join(', ')}. The total number of predictions is ${data.totalPredictions} with an average confidence of ${data.avgConfidence}.`,
        `Current disease distribution: ${Object.entries(data.diseaseDistribution).map(([disease, percentage]) => `${disease}: ${percentage}`).join(', ')}. We have ${data.totalPredictions} total predictions with ${data.modelAccuracy} model accuracy.`,
        `Here's the data you requested: We have ${data.totalPredictions} total predictions with ${data.modelAccuracy} accuracy. Recent predictions include ${data.recentPredictions.slice(0, 3).map((p: any) => p.disease).join(', ')}, and more.`
      ]
    },
    {
      keywords: ['team', 'codenomads', 'who'],
      responses: [
        `CodeNomads is our team of AI researchers dedicated to advancing healthcare through technology. The team includes ${data.team[0].name} (${data.team[0].role}), ${data.team[1].name} (${data.team[1].role}), and ${data.team[2].name} (${data.team[2].role}).`,
        `Our team CodeNomads consists of three members: ${data.team[0].name}, who specializes in medical domain feature engineering; ${data.team[1].name}, an expert in data analysis; and ${data.team[2].name}, who specializes in feature engineering and model validation.`,
        `CodeNomads is a team of passionate AI researchers working on blood disease prediction technology. The team includes ${data.team[0].name}, ${data.team[1].name}, and ${data.team[2].name}.`
      ]
    }
  ];
}

// Get random default response
function getRandomDefaultResponse(): string {
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Knowledge base for the chatbot - Doctor-like responses
const knowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      'Hello! I\'m Dr. CodeNomads, your virtual medical assistant specializing in blood disease analysis. I\'m here to help you understand your blood test results and provide medical guidance. How may I assist you today?',
      'Good day! I\'m Dr. CodeNomads, and I\'m here to help you with any questions about blood diseases, symptoms, or medical concerns. Please feel free to share what\'s on your mind.',
      'Hello there! As your virtual doctor, I\'m here to provide you with comprehensive information about blood-related health conditions. What would you like to discuss today?'
    ]
  },
  {
    keywords: ['worried', 'concerned', 'scared', 'afraid', 'nervous', 'anxious'],
    responses: [
      'I understand your concerns, and it\'s completely natural to feel worried about your health. Let me help you understand your condition better. What specific symptoms or test results are you concerned about?',
      'Your feelings are valid, and I\'m here to support you through this. Many health concerns can be managed effectively with proper care. Can you tell me more about what\'s troubling you?',
      'I can sense your anxiety, and I want to reassure you that we\'ll work through this together. Many blood conditions are treatable when caught early. What symptoms have you been experiencing?'
    ]
  },
  {
    keywords: ['pain', 'hurt', 'ache', 'discomfort', 'sore'],
    responses: [
      'I\'m sorry to hear you\'re experiencing pain. Can you describe the type of pain, its location, and when it started? This will help me better understand your condition.',
      'Pain can be concerning, but it\'s often your body\'s way of telling us something needs attention. Where exactly are you feeling this discomfort, and how would you rate it on a scale of 1-10?',
      'I understand pain can be distressing. Let\'s work together to identify what might be causing it. Can you tell me more about the nature of your pain and any associated symptoms?'
    ]
  },
  {
    keywords: ['tired', 'fatigue', 'exhausted', 'weak', 'weakness', 'energy'],
    responses: [
      'Fatigue and weakness can be symptoms of various blood conditions, including anemia. Have you noticed any other symptoms like pale skin, shortness of breath, or dizziness? When did you first notice feeling this way?',
      'Persistent fatigue is something we should take seriously. It could indicate several conditions, including anemia or other blood disorders. Are you getting adequate sleep, and have you noticed any changes in your appetite?',
      'I understand how exhausting it can be to feel constantly tired. This could be related to your blood health. Let\'s explore this - have you had any recent blood tests done?'
    ]
  },
  {
    keywords: ['dizzy', 'dizziness', 'lightheaded', 'faint', 'fainting'],
    responses: [
      'Dizziness can be a symptom of anemia or other blood-related conditions. Are you experiencing this dizziness when standing up quickly, or is it constant? Have you noticed any other symptoms like fatigue or pale skin?',
      'Lightheadedness, especially when changing positions, can indicate low blood pressure or anemia. Have you been eating and drinking normally? Any recent changes in your health?',
      'Dizziness is a symptom we shouldn\'t ignore. It could be related to various conditions including blood disorders. Can you tell me when this started and if anything seems to trigger it?'
    ]
  },
  {
    keywords: ['bleeding', 'bruising', 'bruise', 'blood', 'nosebleed'],
    responses: [
      'Unusual bleeding or easy bruising can be signs of thrombocytopenia or other blood clotting disorders. Have you noticed prolonged bleeding from minor cuts, or do you bruise easily even from minor bumps?',
      'Easy bruising and bleeding are important symptoms that we need to evaluate. This could indicate issues with your blood\'s ability to clot properly. Have you noticed any changes in your menstrual cycle (if applicable) or bleeding from your gums?',
      'Bleeding disorders require prompt attention. Can you tell me more about the type of bleeding you\'re experiencing? Are you taking any medications that might affect blood clotting?'
    ]
  },
  {
    keywords: ['shortness of breath', 'breathless', 'breathing', 'chest', 'heart'],
    responses: [
      'Shortness of breath can be a symptom of anemia or heart-related conditions. Are you experiencing this during physical activity or even at rest? Any chest pain or irregular heartbeat?',
      'Difficulty breathing is a symptom we take seriously. This could be related to anemia, heart disease, or other conditions. When did you first notice this, and does it worsen with activity?',
      'Breathing difficulties can have various causes, including blood disorders that affect oxygen delivery. Have you noticed any swelling in your legs or ankles along with the breathlessness?'
    ]
  },
  {
    keywords: ['prediction', 'predictions', 'test results', 'blood test', 'results'],
    responses: [
      'I\'d be happy to help you understand your blood test results. Our AI system analyzes multiple blood parameters to identify potential conditions. Can you share your specific test values, or would you like me to explain what different blood markers indicate?',
      'Understanding your blood test results is crucial for your health. Our prediction system has 98.55% accuracy in identifying conditions like diabetes, anemia, and other blood disorders. What specific results would you like me to explain?',
      'Blood test interpretation can be complex, but I\'m here to help you understand what your results mean. Each parameter tells us something different about your health. What concerns do you have about your results?'
    ]
  },
  {
    keywords: ['dashboard', 'metrics', 'statistics', 'stats'],
    responses: [
      'The dashboard displays real-time metrics including total predictions, accuracy rate, disease breakdown, and average confidence levels. You can see the most recent predictions and their details.',
      'Our live dashboard shows key statistics about blood disease predictions, including a breakdown of different diseases detected and their relative frequencies.',
      'The metrics dashboard provides insights into prediction patterns, confidence levels, and distribution of different blood diseases detected by our system.'
    ]
  },
  {
    keywords: ['accuracy', 'confidence', 'reliable'],
    responses: [
      'Our blood disease prediction system has a target accuracy of 98.55%. Each prediction comes with a confidence score that indicates how certain the system is about the result.',
      'The system\'s predictions are highly reliable with training accuracy of 100% and validation accuracy of 100%. In real-world use, we maintain an accuracy rate above 98%.',
      'Confidence scores for predictions typically range from 75% to 100%, with most predictions having confidence levels above 85%.'
    ]
  },
  {
    keywords: ['parameter', 'parameters', 'blood test', 'test'],
    responses: [
      'Our system analyzes six key blood parameters: glucose, hemoglobin, platelets, cholesterol, white blood cells, and hematocrit to make predictions about potential blood diseases.',
      'Blood parameters used in our prediction model include glucose (for diabetes), hemoglobin and hematocrit (for anemia and thalassemia), platelets (for thrombocytopenia), and cholesterol (for heart disease risk).',
      'To get a prediction, you need to input values for glucose, hemoglobin, platelets, cholesterol, white blood cells, and hematocrit from a blood test.'
    ]
  },
  {
    keywords: ['disease', 'diseases', 'condition', 'conditions', 'detect'],
    responses: [
      'Our system can detect several blood-related conditions including Diabetes, Anemia, Thrombocytopenia, Heart Disease, and Thalassemia, as well as confirming healthy blood profiles.',
      'The main diseases our prediction system identifies are: Diabetes (high glucose), Anemia (low hemoglobin), Thrombocytopenia (low platelets), Heart Disease (high cholesterol), and Thalassemia (low hemoglobin and hematocrit).',
      'We can detect 6 different classes of blood conditions, including 5 disease states and healthy profiles.'
    ]
  },
  {
    keywords: ['how', 'work', 'system', 'model'],
    responses: [
      'Our blood disease prediction system uses an ensemble machine learning model that analyzes blood parameters and compares them to patterns seen in known cases of various blood diseases.',
      'The system works by taking blood test parameters as input, processing them through our prediction model, and outputting the most likely condition along with a confidence score.',
      'We use a sophisticated algorithm that considers the relationships between different blood parameters to identify patterns associated with specific blood diseases.'
    ]
  },
  {
    keywords: ['platform', 'website', 'system'],
    responses: [
      'Our Blood Disease Prediction platform is an AI-powered medical diagnostics system with 98.55%+ accuracy using advanced ensemble methods.',
      'The platform provides real-time monitoring of blood disease classification with live tracking of predictions, model accuracy, and confidence levels.',
      'Our system is designed for resource-constrained environments to improve diagnostic accessibility with medical-grade accuracy.'
    ]
  },
  {
    keywords: ['help', 'assistance', 'guide', 'how to'],
    responses: [
      'I can help you navigate our platform, understand blood disease predictions, interpret results, or learn how to use the artist booking features. What specific assistance do you need?',
      'Need help with our platform? I can explain how to input blood parameters for predictions, how to interpret results, or how to use the artist booking features.',
      'I\'m here to assist with any questions about our blood disease prediction system or artist booking platform. Just let me know what you\'d like to learn more about.'
    ]
  },
  {
    keywords: ['thank', 'thanks'],
    responses: [
      'You\'re welcome! Feel free to ask if you have any other questions about our blood disease prediction system.',
      'Happy to help! Let me know if you need anything else regarding our platform or prediction system.',
      'Anytime! Don\'t hesitate to reach out if you have more questions about blood disease predictions.'
    ]
  },
  {
    keywords: ['bye', 'goodbye'],
    responses: [
      'Goodbye! Have a great day and thank you for using our Blood Disease Prediction platform!',
      'See you later! Remember to check the dashboard for the latest prediction metrics.',
      'Bye for now! Feel free to return if you have more questions about our platform.'
    ]
  },
  {
    keywords: ['javascript', 'js'],
    responses: [
      'JavaScript is the programming language we use for the frontend of our Artist Booking and Blood Disease Prediction platform.',
      'Our platform uses JavaScript with React for the user interface, allowing for an interactive dashboard that displays real-time prediction data.',
      'JavaScript powers the interactive elements of our platform, including the real-time updates of blood disease predictions.'
    ]
  },
  {
    keywords: ['react', 'react.js'],
    responses: [
      'React is the frontend framework we use for our Artist Booking and Blood Disease Prediction platform, providing a responsive and interactive user experience.',
      'Our dashboard is built with React, allowing for real-time updates of prediction data and disease statistics.',
      'We use React components to build the user interface for our platform, including the prediction input forms and results displays.'
    ]
  },
  {
    keywords: ['database', 'db', 'sql', 'data'],
    responses: [
      'Our platform uses a PostgreSQL database to store blood parameter data, prediction results, and user information securely.',
      'All prediction data is stored in our database, allowing us to track trends and improve our prediction model over time.',
      'We maintain a secure database of all predictions, which helps us analyze patterns and refine our blood disease detection algorithms.'
    ]
  },
  {
    keywords: ['team', 'codenomads', 'who'],
    responses: [
      `CodeNomads is our team of AI researchers dedicated to advancing healthcare through technology. The team includes ${dashboardData.team[0].name} (${dashboardData.team[0].role}), ${dashboardData.team[1].name} (${dashboardData.team[1].role}), and ${dashboardData.team[2].name} (${dashboardData.team[2].role}).`,
      `Our team CodeNomads consists of three members: ${dashboardData.team[0].name}, who specializes in medical domain feature engineering; ${dashboardData.team[1].name}, an expert in data analysis; and ${dashboardData.team[2].name}, who specializes in feature engineering and model validation.`,
      `CodeNomads is a team of passionate AI researchers working on blood disease prediction technology. The team includes ${dashboardData.team[0].name}, ${dashboardData.team[1].name}, and ${dashboardData.team[2].name}.`
    ]
  },
  {
    keywords: ['key features', 'features'],
    responses: [
      `Our platform offers six key features: ${dashboardData.keyFeatures[0]}; ${dashboardData.keyFeatures[1]}; ${dashboardData.keyFeatures[2]}; ${dashboardData.keyFeatures[3]}; ${dashboardData.keyFeatures[4]}; and ${dashboardData.keyFeatures[5]}.`,
      `The key features of our Blood Disease Prediction platform include AI-Powered Analysis with advanced machine learning, Real-time Monitoring with WebSocket streaming, Medical Grade Accuracy of 98.55%+, Instant Predictions for 6 blood disease types, comprehensive Performance Analytics, and Healthcare Impact for resource-constrained environments.`,
      `Our system's key features include ${dashboardData.keyFeatures[0].split(':')[0]}, ${dashboardData.keyFeatures[1].split(':')[0]}, ${dashboardData.keyFeatures[2].split(':')[0]}, ${dashboardData.keyFeatures[3].split(':')[0]}, ${dashboardData.keyFeatures[4].split(':')[0]}, and ${dashboardData.keyFeatures[5].split(':')[0]}.`
    ]
  },
  {
    keywords: ['total', 'predictions', 'total predictions'],
    responses: [
      `Currently, we have ${dashboardData.totalPredictions} total predictions in our system with an average confidence of ${dashboardData.avgConfidence} and model accuracy of ${dashboardData.modelAccuracy}.`,
      `Our dashboard shows ${dashboardData.totalPredictions} total predictions with ${dashboardData.activeCases} active cases. The model accuracy is ${dashboardData.modelAccuracy}, which is above our target of 98.55%.`,
      `We've made ${dashboardData.totalPredictions} predictions so far with an average confidence level of ${dashboardData.avgConfidence}. Our system is performing above the target accuracy with ${dashboardData.modelAccuracy} accuracy.`
    ]
  },
  {
    keywords: ['display', 'show', 'see', 'here'],
    responses: [
      `Here are the latest predictions: ${dashboardData.recentPredictions.slice(0, 5).map(p => `${p.disease} (${p.confidence} confidence)`).join(', ')}. The total number of predictions is ${dashboardData.totalPredictions} with an average confidence of ${dashboardData.avgConfidence}.`,
      `Current disease distribution: ${Object.entries(dashboardData.diseaseDistribution).map(([disease, percentage]) => `${disease}: ${percentage}`).join(', ')}. We have ${dashboardData.totalPredictions} total predictions with ${dashboardData.modelAccuracy} model accuracy.`,
      `Here's the data you requested: We have ${dashboardData.totalPredictions} total predictions with ${dashboardData.modelAccuracy} accuracy. Recent predictions include ${dashboardData.recentPredictions.slice(0, 3).map(p => p.disease).join(', ')}, and more.`
    ]
  },
  {
    keywords: ['training', 'datasets', 'samples'],
    responses: [
      `Our model was trained on ${dashboardData.projectStats.trainingSamples} samples and tested on ${dashboardData.projectStats.testSamples} samples, achieving ${dashboardData.projectStats.trainingAccuracy} training accuracy and ${dashboardData.projectStats.validationAccuracy} validation accuracy.`,
      `We used ${dashboardData.projectStats.trainingSamples} training samples and ${dashboardData.projectStats.testSamples} test samples for our model, with ${dashboardData.projectStats.medicalFeatures} medical features and ${dashboardData.projectStats.engineeredFeatures} engineered features.`,
      `The training dataset consists of ${dashboardData.projectStats.trainingSamples} samples, and we achieved ${dashboardData.projectStats.trainingAccuracy} training accuracy with ${dashboardData.projectStats.crossValidation} cross-validation.`
    ]
  },
  {
    keywords: ['live', 'distribution', 'disease distribution'],
    responses: [
      `The live disease distribution is: ${Object.entries(dashboardData.diseaseDistribution).map(([disease, percentage]) => `${disease}: ${percentage}`).join(', ')}. Diabetes is the most common at ${dashboardData.diseaseDistribution['Diabetes']}.`,
      `Our current disease distribution shows ${Object.entries(dashboardData.diseaseDistribution).map(([disease, percentage]) => `${disease}: ${percentage}`).join(', ')}. This data is updated in real-time as new predictions come in.`,
      `The live dashboard shows the following disease distribution: ${Object.entries(dashboardData.diseaseDistribution).map(([disease, percentage]) => `${disease}: ${percentage}`).join(', ')}.`
    ]
  },
  {
    keywords: ['recent', 'latest'],
    responses: [
      `The most recent predictions are: ${dashboardData.recentPredictions.slice(0, 5).map(p => `${p.disease} (${p.confidence})`).join(', ')}. These are updated in real-time as new predictions are made.`,
      `Latest predictions from our system: ${dashboardData.recentPredictions.slice(0, 5).map(p => `${p.disease} with ${p.confidence} confidence`).join(', ')}.`,
      `Recent predictions show the following diseases: ${Array.from(new Set(dashboardData.recentPredictions.slice(0, 5).map(p => p.disease))).join(', ')}. The average confidence level is ${dashboardData.avgConfidence}.`
    ]
  },
  {
    keywords: ['treatment', 'treatments', 'medication', 'cure', 'therapy'],
    responses: [
      'I can provide treatment information for specific diseases. Which disease would you like to know about? (Diabetes, Anemia, Thrombocytopenia, Thalassemia, Heart Disease)',
      'Treatment varies by disease. Please specify which condition you\'d like treatment information for: Diabetes, Anemia, Thrombocytopenia, Thalassemia, or Heart Disease.',
      'Each disease has different treatment approaches. Which specific disease treatment would you like to learn about?'
    ]
  },
  {
    keywords: ['diabetes', 'treatment', 'diabetes treatment'],
    responses: [
      `As your doctor, I want to assure you that diabetes is a manageable condition with proper care. Treatment typically includes: ${getDiseaseInfo('Diabetes')?.treatments.slice(0, 4).join(', ')}. The key is maintaining consistent blood sugar levels through a combination of medication, diet, and lifestyle changes. Have you been monitoring your blood glucose levels regularly?`,
      `Diabetes management requires a comprehensive approach. Based on your condition, we might consider: ${getDiseaseInfo('Diabetes')?.treatments.slice(0, 3).join(', ')}. I'd also recommend working with a nutritionist and maintaining regular exercise. What's your current understanding of your diabetes management plan?`,
      `I understand diabetes can feel overwhelming, but with the right treatment plan, you can live a healthy, normal life. Treatment options include: ${getDiseaseInfo('Diabetes')?.treatments.join(', ')}. The most important thing is consistency in your care routine. Do you have any concerns about your current treatment?`
    ]
  },
  {
    keywords: ['anemia', 'treatment', 'anemia treatment'],
    responses: [
      `Anemia is quite common and very treatable. Based on the type of anemia you have, treatment may include: ${getDiseaseInfo('Anemia')?.treatments.slice(0, 4).join(', ')}. The underlying cause is important - are you experiencing heavy menstrual periods, or do you have dietary restrictions that might affect iron absorption?`,
      `I want to reassure you that anemia can be effectively treated once we identify the cause. Treatment approaches include: ${getDiseaseInfo('Anemia')?.treatments.slice(0, 3).join(', ')}. Have you been feeling particularly tired or noticed any changes in your energy levels lately?`,
      `Anemia treatment varies depending on the underlying cause, but most cases respond well to appropriate treatment: ${getDiseaseInfo('Anemia')?.treatments.join(', ')}. It's important to address both the symptoms and the root cause. Have you had any recent blood loss or changes in your diet?`
    ]
  },
  {
    keywords: ['thrombocytopenia', 'treatment', 'thrombocytopenia treatment'],
    responses: [
      `Thrombocytopenia requires careful monitoring and treatment. Depending on the severity, treatment may include: ${getDiseaseInfo('Thrombocytopenia')?.treatments.slice(0, 4).join(', ')}. The main concern is preventing bleeding complications. Have you noticed any unusual bleeding or bruising recently?`,
      `I understand this diagnosis can be concerning, but thrombocytopenia is manageable with proper care: ${getDiseaseInfo('Thrombocytopenia')?.treatments.slice(0, 3).join(', ')}. We'll need to monitor your platelet count regularly. Are you currently taking any medications that might affect your platelets?`,
      `Treatment for thrombocytopenia depends on the cause and severity: ${getDiseaseInfo('Thrombocytopenia')?.treatments.join(', ')}. The good news is that many cases improve with appropriate treatment. Have you experienced any significant bleeding episodes?`
    ]
  },
  {
    keywords: ['thalassemia', 'treatment', 'thalassemia treatment'],
    responses: [
      `Thalassemia is a genetic condition that requires ongoing management. Treatment typically includes: ${getDiseaseInfo('Thalassemia')?.treatments.slice(0, 4).join(', ')}. The specific treatment depends on the type and severity of your thalassemia. Have you been experiencing symptoms like fatigue or pale skin?`,
      `As your doctor, I want to ensure you understand that thalassemia, while genetic, can be well-managed: ${getDiseaseInfo('Thalassemia')?.treatments.slice(0, 3).join(', ')}. Regular monitoring is crucial. Do you have a family history of thalassemia?`,
      `Thalassemia treatment has improved significantly over the years: ${getDiseaseInfo('Thalassemia')?.treatments.join(', ')}. For severe cases, bone marrow transplant can be curative. What type of thalassemia have you been diagnosed with?`
    ]
  },
  {
    keywords: ['heart disease', 'treatment', 'heart disease treatment'],
    responses: [
      `Heart disease is serious but very treatable, especially when caught early. Treatment typically includes: ${getDiseaseInfo('Heart Disease')?.treatments.slice(0, 4).join(', ')}. Lifestyle changes are often as important as medications. Have you been experiencing chest pain or shortness of breath?`,
      `I want to assure you that heart disease can be effectively managed with proper care: ${getDiseaseInfo('Heart Disease')?.treatments.slice(0, 3).join(', ')}. Prevention of further complications is key. Are you currently taking any heart medications?`,
      `Heart disease treatment has advanced considerably: ${getDiseaseInfo('Heart Disease')?.treatments.join(', ')}. The combination of medical treatment and lifestyle changes can significantly improve outcomes. What symptoms brought you to seek medical attention?`
    ]
  },
  {
    keywords: ['cause', 'causes', 'why', 'reason'],
    responses: [
      'I can provide information about causes of specific diseases. Which disease would you like to know about? (Diabetes, Anemia, Thrombocytopenia, Thalassemia, Heart Disease)',
      'Disease causes vary significantly. Please specify which condition you\'d like to learn about: Diabetes, Anemia, Thrombocytopenia, Thalassemia, or Heart Disease.',
      'Each disease has different underlying causes. Which specific disease causes would you like to understand?'
    ]
  },
  {
    keywords: ['diabetes', 'cause', 'diabetes cause'],
    responses: [
      `Diabetes Causes: ${getDiseaseInfo('Diabetes')?.causes.join(', ')}`,
      `Main causes of Diabetes: ${getDiseaseInfo('Diabetes')?.causes.slice(0, 3).join(', ')}. Type 1 and Type 2 diabetes have different underlying mechanisms.`,
      `Diabetes is caused by: ${getDiseaseInfo('Diabetes')?.causes.join(', ')}. Genetic and environmental factors both play important roles.`
    ]
  },
  {
    keywords: ['anemia', 'cause', 'anemia cause'],
    responses: [
      `Anemia Causes: ${getDiseaseInfo('Anemia')?.causes.join(', ')}`,
      `Main causes of Anemia: ${getDiseaseInfo('Anemia')?.causes.slice(0, 4).join(', ')}. Iron deficiency is the most common cause worldwide.`,
      `Anemia can be caused by: ${getDiseaseInfo('Anemia')?.causes.join(', ')}. The underlying cause determines the treatment approach.`
    ]
  },
  {
    keywords: ['thrombocytopenia', 'cause', 'thrombocytopenia cause'],
    responses: [
      `Thrombocytopenia Causes: ${getDiseaseInfo('Thrombocytopenia')?.causes.join(', ')}`,
      `Main causes of Thrombocytopenia: ${getDiseaseInfo('Thrombocytopenia')?.causes.slice(0, 4).join(', ')}. Autoimmune destruction is a common cause.`,
      `Thrombocytopenia can be caused by: ${getDiseaseInfo('Thrombocytopenia')?.causes.join(', ')}. Medications and infections are common triggers.`
    ]
  },
  {
    keywords: ['thalassemia', 'cause', 'thalassemia cause'],
    responses: [
      `Thalassemia Causes: ${getDiseaseInfo('Thalassemia')?.causes.join(', ')}`,
      `Main causes of Thalassemia: ${getDiseaseInfo('Thalassemia')?.causes.slice(0, 4).join(', ')}. It's an inherited genetic disorder.`,
      `Thalassemia is caused by: ${getDiseaseInfo('Thalassemia')?.causes.join(', ')}. Genetic mutations are inherited from parents.`
    ]
  },
  {
    keywords: ['heart disease', 'cause', 'heart disease cause'],
    responses: [
      `Heart Disease Causes: ${getDiseaseInfo('Heart Disease')?.causes.join(', ')}`,
      `Main causes of Heart Disease: ${getDiseaseInfo('Heart Disease')?.causes.slice(0, 4).join(', ')}. Lifestyle factors play a major role.`,
      `Heart Disease can be caused by: ${getDiseaseInfo('Heart Disease')?.causes.join(', ')}. Many risk factors are modifiable through lifestyle changes.`
    ]
  },
  {
    keywords: ['symptom', 'symptoms', 'signs', 'how to know'],
    responses: [
      'I can provide information about symptoms of specific diseases. Which disease would you like to know about? (Diabetes, Anemia, Thrombocytopenia, Thalassemia, Heart Disease)',
      'Symptoms vary by disease. Please specify which condition you\'d like to learn about: Diabetes, Anemia, Thrombocytopenia, Thalassemia, or Heart Disease.',
      'Each disease has different symptoms. Which specific disease symptoms would you like to understand?'
    ]
  },
  {
    keywords: ['diabetes', 'symptom', 'diabetes symptom'],
    responses: [
      `The symptoms you should watch for with diabetes include: ${getDiseaseInfo('Diabetes')?.symptoms.slice(0, 4).join(', ')}. These symptoms develop because your body can't properly use glucose for energy. Have you been experiencing increased thirst or frequent urination?`,
      `I want you to be aware of these diabetes symptoms: ${getDiseaseInfo('Diabetes')?.symptoms.slice(0, 3).join(', ')}. Early detection is crucial for preventing complications. If you're experiencing these symptoms, we should check your blood sugar levels promptly.`,
      `As your doctor, I want to educate you about diabetes symptoms: ${getDiseaseInfo('Diabetes')?.symptoms.join(', ')}. These symptoms can develop gradually, so it's important to monitor them closely. Are you experiencing any of these symptoms currently?`
    ]
  },
  {
    keywords: ['anemia', 'symptom', 'anemia symptom'],
    responses: [
      `Anemia symptoms develop because your body isn't getting enough oxygen-rich blood. Watch for: ${getDiseaseInfo('Anemia')?.symptoms.slice(0, 4).join(', ')}. The fatigue you might be feeling is your body's way of conserving energy. Have you noticed any pale coloring in your skin or nails?`,
      `I want you to understand what anemia symptoms look like: ${getDiseaseInfo('Anemia')?.symptoms.slice(0, 3).join(', ')}. These symptoms can significantly impact your quality of life, but they're very treatable. Are you experiencing any unusual fatigue or weakness?`,
      `Anemia affects your entire body's oxygen supply, causing symptoms like: ${getDiseaseInfo('Anemia')?.symptoms.join(', ')}. The severity depends on how low your hemoglobin levels are. Have you been feeling more tired than usual lately?`
    ]
  },
  {
    keywords: ['medication', 'medicine', 'drug', 'pill', 'side effects'],
    responses: [
      'I understand you have questions about medications. It\'s important to take medications as prescribed and report any side effects to your healthcare provider. Are you experiencing any side effects from your current medications?',
      'Medication compliance is crucial for managing your condition effectively. Every medication can have side effects, but the benefits usually outweigh the risks. What specific concerns do you have about your medications?',
      'As your doctor, I want to ensure you\'re comfortable with your medication regimen. Never stop taking prescribed medications without consulting your healthcare provider. Are you having trouble with any particular medication?'
    ]
  },
  {
    keywords: ['diet', 'food', 'nutrition', 'eating', 'meal'],
    responses: [
      'Nutrition plays a vital role in managing blood disorders. For diabetes, controlling carbohydrate intake is crucial. For anemia, iron-rich foods are important. What does your typical daily diet look like?',
      'A proper diet can significantly impact your condition. I\'d recommend working with a nutritionist to develop a meal plan that supports your health goals. Are you currently following any specific dietary restrictions?',
      'Food is medicine, and the right nutrition can help manage your condition effectively. Each blood disorder has specific dietary considerations. Would you like specific nutritional guidance for your condition?'
    ]
  },
  {
    keywords: ['exercise', 'activity', 'physical', 'workout', 'gym'],
    responses: [
      'Exercise is generally beneficial for most blood conditions, but we need to tailor it to your specific situation. For some conditions like severe anemia, we might need to start slowly. What\'s your current activity level?',
      'Physical activity can help improve your overall health and manage many blood disorders. However, if you have certain conditions like severe thrombocytopenia, we need to avoid contact sports. Are you currently exercising regularly?',
      'As your doctor, I encourage appropriate physical activity as part of your treatment plan. The key is finding the right balance for your condition. Have you experienced any symptoms during physical activity?'
    ]
  },
  {
    keywords: ['emergency', 'urgent', 'serious', 'hospital', 'emergency room'],
    responses: [
      'I understand your concern about when to seek emergency care. For blood disorders, seek immediate medical attention if you experience: severe bleeding that won\'t stop, chest pain, severe shortness of breath, or fainting. Are you experiencing any of these symptoms now?',
      'Emergency situations with blood disorders can include: uncontrolled bleeding, severe chest pain, difficulty breathing, or loss of consciousness. If you\'re experiencing any of these, please go to the emergency room immediately. What symptoms are you concerned about?',
      'Your safety is my priority. Emergency warning signs include: persistent bleeding, severe fatigue with chest pain, difficulty breathing, or signs of stroke. If you\'re having these symptoms, seek immediate medical care. Are you experiencing any emergency symptoms?'
    ]
  },
  {
    keywords: ['prognosis', 'outlook', 'future', 'cure', 'recovery'],
    responses: [
      'The prognosis for most blood disorders is quite good with proper treatment. Many conditions like anemia and diabetes can be well-managed, allowing you to live a normal, healthy life. The key is consistent care and monitoring. What aspects of your prognosis concern you most?',
      'I want to give you hope - most blood disorders have excellent outcomes when properly managed. While some conditions like thalassemia are genetic and lifelong, treatments continue to improve. Early detection and treatment are crucial. How are you feeling about your diagnosis?',
      'Your outlook depends on several factors including the specific condition, how early it was caught, and your response to treatment. Many of my patients with blood disorders live full, active lives. What questions do you have about your long-term health?'
    ]
  },
  {
    keywords: ['family', 'genetic', 'hereditary', 'children', 'inheritance'],
    responses: [
      'Family history is important for many blood disorders. Some conditions like thalassemia are genetic, while others like diabetes have both genetic and environmental factors. Do you have a family history of blood disorders?',
      'Genetic factors can play a role in blood disorders, but having a family history doesn\'t guarantee you\'ll develop the condition. We can discuss genetic counseling if you\'re concerned about passing conditions to your children. Are you planning to have children?',
      'Many blood disorders have hereditary components, but lifestyle factors also play a significant role. If you have a family history, we can implement preventive measures and early screening. What conditions run in your family?'
    ]
  },
  {
    keywords: ['test', 'blood test', 'lab', 'results', 'normal', 'abnormal'],
    responses: [
      'Blood tests are essential for diagnosing and monitoring blood disorders. Normal ranges can vary slightly between labs, but I\'ll help you understand what your results mean. Which specific test results would you like me to explain?',
      'Understanding your blood test results is important for managing your health. Each parameter tells us something different about your blood and overall health. Are there specific values in your results that concern you?',
      'Blood tests provide valuable information about your health status. Abnormal results don\'t always mean you have a serious condition - sometimes they indicate the need for further testing. What questions do you have about your recent blood work?'
    ]
  },
  {
    keywords: ['thank', 'thanks', 'grateful', 'appreciate'],
    responses: [
      'You\'re very welcome! It\'s my pleasure to help you understand your health better. Remember, I\'m here whenever you have questions or concerns. Take care of yourself, and don\'t hesitate to reach out if you need anything.',
      'I\'m so glad I could help! Your health is important, and I want you to feel confident about managing your condition. Please continue to monitor your symptoms and follow your treatment plan. Feel free to ask me anything else.',
      'Thank you for trusting me with your health concerns. Remember, managing blood disorders is a team effort between you and your healthcare providers. I\'m always here to support you on your health journey.'
    ]
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later'],
    responses: [
      'Take care of yourself! Remember to follow your treatment plan and monitor your symptoms. Don\'t hesitate to reach out if you have any concerns. I\'m here whenever you need medical guidance.',
      'Goodbye for now! Please continue to take your medications as prescribed and maintain healthy lifestyle habits. If you experience any concerning symptoms, please seek medical attention promptly.',
      'Until next time, please prioritize your health and well-being. Remember, managing your condition is a daily commitment, but you\'re not alone in this journey. Feel free to contact me anytime.'
    ]
  },
  {
    keywords: ['thrombocytopenia', 'symptom', 'thrombocytopenia symptom'],
    responses: [
      `Thrombocytopenia Symptoms: ${getDiseaseInfo('Thrombocytopenia')?.symptoms.join(', ')}`,
      `Common symptoms of Thrombocytopenia: ${getDiseaseInfo('Thrombocytopenia')?.symptoms.slice(0, 4).join(', ')}. Bleeding and bruising are key symptoms.`,
      `Thrombocytopenia symptoms include: ${getDiseaseInfo('Thrombocytopenia')?.symptoms.join(', ')}. Seek immediate medical attention for severe bleeding.`
    ]
  },
  {
    keywords: ['thalassemia', 'symptom', 'thalassemia symptom'],
    responses: [
      `Thalassemia Symptoms: ${getDiseaseInfo('Thalassemia')?.symptoms.join(', ')}`,
      `Common symptoms of Thalassemia: ${getDiseaseInfo('Thalassemia')?.symptoms.slice(0, 4).join(', ')}. Symptoms vary by type and severity.`,
      `Thalassemia symptoms include: ${getDiseaseInfo('Thalassemia')?.symptoms.join(', ')}. Some forms may not show symptoms until adulthood.`
    ]
  },
  {
    keywords: ['heart disease', 'symptom', 'heart disease symptom'],
    responses: [
      `Heart Disease Symptoms: ${getDiseaseInfo('Heart Disease')?.symptoms.join(', ')}`,
      `Common symptoms of Heart Disease: ${getDiseaseInfo('Heart Disease')?.symptoms.slice(0, 4).join(', ')}. Chest pain is a classic symptom.`,
      `Heart Disease symptoms include: ${getDiseaseInfo('Heart Disease')?.symptoms.join(', ')}. Seek immediate medical attention for chest pain.`
    ]
  },
  {
    keywords: ['prevention', 'prevent', 'avoid', 'how to prevent'],
    responses: [
      'I can provide prevention information for specific diseases. Which disease would you like to know about? (Diabetes, Anemia, Thrombocytopenia, Thalassemia, Heart Disease)',
      'Prevention strategies vary by disease. Please specify which condition you\'d like to learn about: Diabetes, Anemia, Thrombocytopenia, Thalassemia, or Heart Disease.',
      'Each disease has different prevention approaches. Which specific disease prevention would you like to understand?'
    ]
  },
  {
    keywords: ['diabetes', 'prevention', 'diabetes prevention'],
    responses: [
      `Diabetes Prevention: ${getDiseaseInfo('Diabetes')?.preventions.join(', ')}`,
      `To prevent Diabetes: ${getDiseaseInfo('Diabetes')?.preventions.slice(0, 4).join(', ')}. Lifestyle modifications are key to prevention.`,
      `Diabetes prevention strategies: ${getDiseaseInfo('Diabetes')?.preventions.join(', ')}. Type 2 diabetes is largely preventable through lifestyle changes.`
    ]
  },
  {
    keywords: ['anemia', 'prevention', 'anemia prevention'],
    responses: [
      `Anemia Prevention: ${getDiseaseInfo('Anemia')?.preventions.join(', ')}`,
      `To prevent Anemia: ${getDiseaseInfo('Anemia')?.preventions.slice(0, 4).join(', ')}. Iron-rich diet is crucial for prevention.`,
      `Anemia prevention strategies: ${getDiseaseInfo('Anemia')?.preventions.join(', ')}. Nutritional prevention is most effective.`
    ]
  },
  {
    keywords: ['thrombocytopenia', 'prevention', 'thrombocytopenia prevention'],
    responses: [
      `Thrombocytopenia Prevention: ${getDiseaseInfo('Thrombocytopenia')?.preventions.join(', ')}`,
      `To prevent Thrombocytopenia: ${getDiseaseInfo('Thrombocytopenia')?.preventions.slice(0, 4).join(', ')}. Avoiding trigger medications is important.`,
      `Thrombocytopenia prevention strategies: ${getDiseaseInfo('Thrombocytopenia')?.preventions.join(', ')}. Prevention focuses on avoiding known triggers.`
    ]
  },
  {
    keywords: ['thalassemia', 'prevention', 'thalassemia prevention'],
    responses: [
      `Thalassemia Prevention: ${getDiseaseInfo('Thalassemia')?.preventions.join(', ')}`,
      `To prevent Thalassemia: ${getDiseaseInfo('Thalassemia')?.preventions.slice(0, 4).join(', ')}. Genetic counseling is crucial for prevention.`,
      `Thalassemia prevention strategies: ${getDiseaseInfo('Thalassemia')?.preventions.join(', ')}. Since it's genetic, prevention focuses on family planning.`
    ]
  },
  {
    keywords: ['heart disease', 'prevention', 'heart disease prevention'],
    responses: [
      `Heart Disease Prevention: ${getDiseaseInfo('Heart Disease')?.preventions.join(', ')}`,
      `To prevent Heart Disease: ${getDiseaseInfo('Heart Disease')?.preventions.slice(0, 4).join(', ')}. Lifestyle modifications are highly effective.`,
      `Heart Disease prevention strategies: ${getDiseaseInfo('Heart Disease')?.preventions.join(', ')}. Most heart disease is preventable through healthy lifestyle choices.`
    ]
  },
  {
    keywords: ['complication', 'complications', 'what happens'],
    responses: [
      'I can provide information about complications of specific diseases. Which disease would you like to know about? (Diabetes, Anemia, Thrombocytopenia, Thalassemia, Heart Disease)',
      'Complications vary by disease. Please specify which condition you\'d like to learn about: Diabetes, Anemia, Thrombocytopenia, Thalassemia, or Heart Disease.',
      'Each disease has different potential complications. Which specific disease complications would you like to understand?'
    ]
  },
  {
    keywords: ['diabetes', 'complication', 'diabetes complication'],
    responses: [
      `Diabetes Complications: ${getDiseaseInfo('Diabetes')?.complications.join(', ')}`,
      `Potential complications of Diabetes: ${getDiseaseInfo('Diabetes')?.complications.slice(0, 4).join(', ')}. Good blood sugar control prevents most complications.`,
      `Diabetes can lead to: ${getDiseaseInfo('Diabetes')?.complications.join(', ')}. Early detection and management are crucial to prevent complications.`
    ]
  },
  {
    keywords: ['anemia', 'complication', 'anemia complication'],
    responses: [
      `Anemia Complications: ${getDiseaseInfo('Anemia')?.complications.join(', ')}`,
      `Potential complications of Anemia: ${getDiseaseInfo('Anemia')?.complications.slice(0, 4).join(', ')}. Severe anemia can affect heart function.`,
      `Anemia can lead to: ${getDiseaseInfo('Anemia')?.complications.join(', ')}. Treatment prevents most complications.`
    ]
  },
  {
    keywords: ['thrombocytopenia', 'complication', 'thrombocytopenia complication'],
    responses: [
      `Thrombocytopenia Complications: ${getDiseaseInfo('Thrombocytopenia')?.complications.join(', ')}`,
      `Potential complications of Thrombocytopenia: ${getDiseaseInfo('Thrombocytopenia')?.complications.slice(0, 4).join(', ')}. Severe bleeding is the main concern.`,
      `Thrombocytopenia can lead to: ${getDiseaseInfo('Thrombocytopenia')?.complications.join(', ')}. Platelet count monitoring is essential.`
    ]
  },
  {
    keywords: ['thalassemia', 'complication', 'thalassemia complication'],
    responses: [
      `Thalassemia Complications: ${getDiseaseInfo('Thalassemia')?.complications.join(', ')}`,
      `Potential complications of Thalassemia: ${getDiseaseInfo('Thalassemia')?.complications.slice(0, 4).join(', ')}. Iron overload is a major concern.`,
      `Thalassemia can lead to: ${getDiseaseInfo('Thalassemia')?.complications.join(', ')}. Regular monitoring and treatment prevent most complications.`
    ]
  },
  {
    keywords: ['heart disease', 'complication', 'heart disease complication'],
    responses: [
      `Heart Disease Complications: ${getDiseaseInfo('Heart Disease')?.complications.join(', ')}`,
      `Potential complications of Heart Disease: ${getDiseaseInfo('Heart Disease')?.complications.slice(0, 4).join(', ')}. Heart attack and stroke are serious complications.`,
      `Heart Disease can lead to: ${getDiseaseInfo('Heart Disease')?.complications.join(', ')}. Early treatment reduces complication risk.`
    ]
  },
  {
    keywords: ['prevention', 'prevent', 'avoiding', 'preventive'],
    responses: [
      `Prevention strategies for Diabetes include ${dashboardData.preventions['Diabetes']} For Heart Disease: ${dashboardData.preventions['Heart Disease']}`,
      `Disease prevention is important. For Anemia: ${dashboardData.preventions['Anemia']} For Thrombocytopenia: ${dashboardData.preventions['Thrombocytopenia']}`,
      `Preventive measures vary by condition. For example, for Heart Disease: ${dashboardData.preventions['Heart Disease']} For Diabetes: ${dashboardData.preventions['Diabetes']}`
    ]
  },
  {
    keywords: ['technical', 'methodology', 'method', 'approach'],
    responses: [
      `Our technical methodology follows a four-phase approach: ${dashboardData.methodology[0]}; ${dashboardData.methodology[1]}; ${dashboardData.methodology[2]}; ${dashboardData.methodology[3]}.`,
      `We use a sophisticated technical approach that includes data analysis with 24 medical features, feature engineering with 13 medical domain features, ensemble learning for model training, and optimization through distribution matching and medical logic integration.`,
      `Our methodology combines medical expertise with advanced machine learning techniques, including ${dashboardData.methodology[1]} and ${dashboardData.methodology[2]}.`
    ]
  },
  {
    keywords: ['solution', 'architecture', 'model', 'ensemble'],
    responses: [
      `Our solution architecture uses an ensemble of models including a Random Forest Classifier (${dashboardData.architecture['Random Forest Classifier']}) and a Gradient Boosting Classifier (${dashboardData.architecture['Gradient Boosting Classifier']}).`,
      `We've created several medical features for our model including ${dashboardData.architecture['Medical Features Created'].split(', ').slice(0, 5).join(', ')}, and others.`,
      `Our ensemble model combines Random Forest and Gradient Boosting classifiers with medical domain features to achieve high accuracy in blood disease prediction.`
    ]
  }
  
];

// Default responses when no match is found - Doctor-like responses
const defaultResponses = [
  'I want to make sure I understand your concern properly. Could you provide more details about your symptoms or medical question? I\'m here to help you with any blood-related health concerns.',
  'I may not have caught all the details of your question. Could you please rephrase it so I can better assist you? I can help with symptoms, treatments, causes, and prevention of blood disorders.',
  'As your virtual doctor, I want to provide you with the most accurate medical information. Could you clarify what specific aspect of your health or blood condition you\'d like to discuss?',
  'I don\'t have specific information on that particular topic, but I\'m here to help with blood disease symptoms, treatments, and medical guidance. What specific health concern would you like to address?',
  'I want to ensure I give you the most helpful medical information. Could you tell me more about your symptoms, concerns, or what specific aspect of blood health you\'d like to learn about?',
  'Every patient\'s situation is unique. Could you provide more context about your specific health concern? I can help with diabetes, anemia, thrombocytopenia, thalassemia, and heart disease questions.',
  'I\'m committed to helping you understand your health better. Could you be more specific about your medical question? I can provide information about symptoms, treatments, causes, and prevention strategies.'
];

// Create a new chat session
export function createChatSession(): ChatSession {
  const sessionId = nanoid();
  const session: ChatSession = {
    id: sessionId,
    messages: [
      {
        id: nanoid(),
        text: 'Hello! I\'m Dr. CodeNomads, your virtual medical assistant specializing in blood disease analysis and patient care. I\'m here to help you understand your blood health, symptoms, treatments, and provide medical guidance. Please feel free to share any concerns or questions you have about your health - I\'m here to listen and help. What would you like to discuss today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  chatSessions.set(sessionId, session);
  return session;
}

// Get a chat session by ID
export function getChatSession(sessionId: string): ChatSession | undefined {
  return chatSessions.get(sessionId);
}

// Add a message to a chat session
export function addUserMessage(sessionId: string, text: string): ChatMessage | null {
  const session = chatSessions.get(sessionId);
  if (!session) return null;
  
  const message: ChatMessage = {
    id: nanoid(),
    text,
    sender: 'user',
    timestamp: new Date(),
  };
  
  session.messages.push(message);
  session.updatedAt = new Date();
  return message;
}

// Generate a bot response
export async function generateBotResponse(sessionId: string, userMessage: string): Promise<ChatMessage | null> {
  const session = chatSessions.get(sessionId);
  if (!session) return null;
  
  const response = await getBotResponse(userMessage);
  
  const message: ChatMessage = {
    id: nanoid(),
    text: response,
    sender: 'bot',
    timestamp: new Date(),
  };
  
  session.messages.push(message);
  session.updatedAt = new Date();
  return message;
}

// Get all messages for a session
export function getMessages(sessionId: string): ChatMessage[] {
  const session = chatSessions.get(sessionId);
  return session ? session.messages : [];
}

// Helper function to get a bot response based on user input
async function getBotResponse(userInput: string): Promise<string> {
  // Initialize training if not done
  if (!isTrainingComplete) {
    await initializeTraining();
  }

  // Get dynamic dashboard data
  const dynamicData = await getDynamicDashboardData();

  // Use trained response generation
  const trainedResponse = await generateTrainedResponse(userInput, 'default');
  
  // If trained response is available, use it
  if (trainedResponse !== getRandomDefaultResponse()) {
    return trainedResponse;
  }
  
  // Fall back to original logic for specific cases
  const input = userInput.toLowerCase();
  
  // Special handling for data display requests
  if (input.includes('display') || input.includes('show') || input.includes('see') || input.includes('here')) {
    return `Here are the latest predictions: ${dynamicData.recentPredictions.slice(0, 5).map(p => `${p.disease} (${p.confidence})`).join(', ')}. ` +
           `Total predictions: ${dynamicData.totalPredictions}, Model accuracy: ${dynamicData.modelAccuracy}, ` +
           `Average confidence: ${dynamicData.avgConfidence}. ` +
           `Disease distribution: ${Object.entries(dynamicData.diseaseDistribution).slice(0, 3).map(([disease, percentage]) => `${disease}: ${percentage}`).join(', ')}, and others.`;
  }
  
  // Special handling for disease-specific queries with enhanced pattern matching
  const diseaseMap = {
    'diabetes': 'Diabetes',
    'diabities': 'Diabetes', // Common misspelling
    'diabetic': 'Diabetes',
    'anemia': 'Anemia',
    'aneamia': 'Anemia', // Common misspelling
    'anaemia': 'Anemia', // British spelling
    'thalassemia': 'Thalassemia',
    'thalasemia': 'Thalassemia', // Common misspelling
    'heart disease': 'Heart Disease',
    'heart': 'Heart Disease',
    'cardiac': 'Heart Disease',
    'thrombocytopenia': 'Thrombocytopenia',
    'thrombocytpenia': 'Thrombocytopenia', // Common misspelling
    'healthy': 'Healthy'
  };

  // Enhanced disease detection with multiple patterns
  for (const [lowerDisease, properDisease] of Object.entries(diseaseMap)) {
    // Check for direct mentions, "what is", "what are", "what of" patterns
    if (input.includes(lowerDisease) && 
        (input.includes('what is') || input.includes('what are') || input.includes('what of') || 
         input.includes('tell me about') || input.includes('explain') || input === lowerDisease)) {
      const diseaseInfo = getDiseaseInfo(lowerDisease === 'diabities' ? 'diabetes' : 
                                        lowerDisease === 'aneamia' ? 'anemia' : 
                                        lowerDisease === 'anaemia' ? 'anemia' :
                                        lowerDisease === 'thalasemia' ? 'thalassemia' :
                                        lowerDisease === 'cardiac' ? 'heart disease' :
                                        lowerDisease === 'heart' ? 'heart disease' :
                                        lowerDisease === 'thrombocytpenia' ? 'thrombocytopenia' :
                                        lowerDisease);
      if (diseaseInfo) {
        return `**${diseaseInfo.name}**\n\n` +
               `${diseaseInfo.description}\n\n` +
               `**Symptoms:** ${diseaseInfo.symptoms.join(', ')}\n\n` +
               `**Treatment:** ${diseaseInfo.treatments.join('. ')}\n\n` +
               `**Prevention:** ${diseaseInfo.preventions.join('. ')}\n\n` +
               `⚠️ **Important:** This information is for educational purposes. Please consult healthcare professionals for proper diagnosis and treatment.`;
      }
    }
  }

  // Special handling for direct symptom questions (e.g., "what are the symptoms of diabetes")
  if (input.includes('symptoms') || input.includes('symptom')) {
    for (const [lowerDisease, properDisease] of Object.entries(diseaseMap)) {
      if (input.includes(lowerDisease) && lowerDisease !== 'healthy') {
        const actualDisease = lowerDisease === 'diabities' ? 'diabetes' : 
                             lowerDisease === 'aneamia' ? 'anemia' : 
                             lowerDisease === 'anaemia' ? 'anemia' :
                             lowerDisease === 'thalasemia' ? 'thalassemia' :
                             lowerDisease === 'cardiac' ? 'heart disease' :
                             lowerDisease === 'heart' ? 'heart disease' :
                             lowerDisease === 'thrombocytpenia' ? 'thrombocytopenia' :
                             lowerDisease;
        
        const diseaseInfo = getDiseaseInfo(actualDisease);
        if (diseaseInfo) {
          return `**Symptoms of ${diseaseInfo.name}:**\n\n` +
                 `• ${diseaseInfo.symptoms.join('\n• ')}\n\n` +
                 `⚠️ **Important:** These symptoms can vary in severity and may overlap with other conditions. Please consult a healthcare professional for accurate diagnosis if you're experiencing any of these symptoms.`;
        }
      }
    }
  }

  // Special handling for symptom queries
  if (input.includes('symptom') || input.includes('sign') || input.includes('indicator')) {
    // Check if asking for all symptoms
    if (input.includes('each') || input.includes('all')) {
      let allSymptoms = `Here are the symptoms for each disease we detect:\n\n`;
      
      const uniqueDiseases = ['diabetes', 'anemia', 'thalassemia', 'heart disease', 'thrombocytopenia'];
      for (const disease of uniqueDiseases) {
        const diseaseInfo = getDiseaseInfo(disease);
        if (diseaseInfo) {
          allSymptoms += `**${diseaseInfo.name}:**\n• ${diseaseInfo.symptoms.join('\n• ')}\n\n`;
        }
      }
      
      allSymptoms += `⚠️ **Important:** If you're experiencing any of these symptoms, please consult with a healthcare professional for proper diagnosis and treatment.`;
      return allSymptoms;
    }
    
    // Check if a specific disease is mentioned with symptoms
    for (const [lowerDisease, properDisease] of Object.entries(diseaseMap)) {
      if (input.includes(lowerDisease) && lowerDisease !== 'healthy') {
        const actualDisease = lowerDisease === 'diabities' ? 'diabetes' : 
                             lowerDisease === 'aneamia' ? 'anemia' : 
                             lowerDisease === 'anaemia' ? 'anemia' :
                             lowerDisease === 'thalasemia' ? 'thalassemia' :
                             lowerDisease === 'cardiac' ? 'heart disease' :
                             lowerDisease === 'heart' ? 'heart disease' :
                             lowerDisease === 'thrombocytpenia' ? 'thrombocytopenia' :
                             lowerDisease;
        
        const diseaseInfo = getDiseaseInfo(actualDisease);
        if (diseaseInfo) {
          return `**Symptoms of ${diseaseInfo.name}:**\n\n` +
                 `• ${diseaseInfo.symptoms.join('\n• ')}\n\n` +
                 `⚠️ **Important:** These symptoms can vary in severity and may overlap with other conditions. Please consult a healthcare professional for accurate diagnosis if you're experiencing any of these symptoms.`;
        }
      }
    }
    
    // If no specific disease mentioned, provide general symptom info
    return `I can provide symptom information for the following conditions:\n\n` +
           `• Diabetes\n• Anemia\n• Thalassemia\n• Heart Disease\n• Thrombocytopenia\n\n` +
           `Please ask about symptoms for a specific disease (e.g., "symptoms of diabetes") or ask for "symptoms of each disease" to see all.`;
  }
  
  // Special handling for prediction-related queries to get real-time data
  if (input.includes('prediction') || input.includes('today') || input.includes('recent') || 
      input.includes('blood') || input.includes('disease')) {
    try {
      const recentPredictions = await storage.getRecentPredictions(5);
      
      if (recentPredictions && recentPredictions.length > 0) {
        // Get unique diseases from recent predictions
        const diseaseSet = new Set(recentPredictions.map(p => p.prediction));
        const diseases = Array.from(diseaseSet).join(', ');
        
        // Calculate average confidence
        const avgConfidence = (recentPredictions.reduce((sum, p) => sum + p.confidence, 0) / 
                              recentPredictions.length * 100).toFixed(1);
        
        // Get disease stats
        const stats = await storage.getDiseaseStats();
        const totalCases = Object.values(stats).reduce((sum, count) => sum + count, 0);
        
        // Most common disease
        let mostCommonDisease = "";
        let maxCount = 0;
        for (const [disease, count] of Object.entries(stats)) {
          if (count > maxCount) {
            mostCommonDisease = disease;
            maxCount = count;
          }
        }
        
        return `Based on our latest data, we've detected ${diseases} in recent predictions. ` +
               `The average confidence level is ${avgConfidence}%. ` +
               `We've analyzed ${totalCases} cases in total, with ${mostCommonDisease} being the most common condition. ` +
               `You can view more detailed statistics on the dashboard.`;
      }
    } catch (error) {
      console.error('Error getting prediction data:', error);
      // Fall back to dashboard data if there's an error
      return `According to our dashboard, we have ${dashboardData.totalPredictions} total predictions with an average confidence of ${dashboardData.avgConfidence}. ` +
             `Recent predictions include ${dashboardData.recentPredictions.slice(0, 3).map(p => p.disease).join(', ')}, and others.`;
    }
  }
  
  // Special handling for total predictions
  if (input.includes('total') && input.includes('prediction')) {
    return `Currently, we have ${dashboardData.totalPredictions} total predictions in our system with an average confidence of ${dashboardData.avgConfidence} and model accuracy of ${dashboardData.modelAccuracy}.`;
  }
  
  // Special handling for parameters
  if (input.includes('parameter') && input.includes('how many')) {
    return `We analyze 6 key blood parameters: ${dashboardData.parameters.map(p => p.split(':')[0]).join(', ')}.`;
  }
  
  // Special handling for treatment queries
  if (input.includes('treatment') || input.includes('medication') || input.includes('cure') || input.includes('therapy')) {
    // Check if asking for all treatments
    if (input.includes('each') || input.includes('all')) {
      return `Here are the treatments for each disease we detect:\n\n` +
             `1. Diabetes: ${dashboardData.treatments['Diabetes']}\n\n` +
             `2. Anemia: ${dashboardData.treatments['Anemia']}\n\n` +
             `3. Thalassemia: ${dashboardData.treatments['Thalassemia']}\n\n` +
             `4. Heart Disease: ${dashboardData.treatments['Heart Disease']}\n\n` +
             `5. Thrombocytopenia: ${dashboardData.treatments['Thrombocytopenia']}\n\n` +
             `Please note: All treatments should be supervised by healthcare professionals.`;
    }
    
    // Check if a specific disease is mentioned
    const diseases = Object.keys(dashboardData.treatments);
    for (const disease of diseases) {
      if (input.toLowerCase().includes(disease.toLowerCase())) {
        return `For ${disease}: ${(dashboardData.treatments as any)[disease]}`;
      }
    }
    
    // If no specific disease is mentioned, provide general treatment info
    return `Treatment recommendations depend on the specific disease diagnosed. Please specify which disease you'd like to know about (Diabetes, Anemia, Thalassemia, Heart Disease, or Thrombocytopenia), or ask for 'treatments for each disease' to see all.`;
  }
  
  // Special handling for training datasets
  if ((input.includes('training') || input.includes('dataset')) && input.includes('how many')) {
    return `Our model was trained on ${dashboardData.projectStats.trainingSamples} samples and tested on ${dashboardData.projectStats.testSamples} samples.`;
  }
  
  // Special handling for prevention queries
  if (input.includes('prevention') || input.includes('prevent') || input.includes('avoiding')) {
    // Check if asking for all preventions
    if (input.includes('each') || input.includes('all')) {
      return `Here are prevention strategies for each disease we detect:\n\n` +
             `1. Diabetes: ${dashboardData.preventions['Diabetes']}\n\n` +
             `2. Anemia: ${dashboardData.preventions['Anemia']}\n\n` +
             `3. Thalassemia: ${dashboardData.preventions['Thalassemia']}\n\n` +
             `4. Heart Disease: ${dashboardData.preventions['Heart Disease']}\n\n` +
             `5. Thrombocytopenia: ${dashboardData.preventions['Thrombocytopenia']}\n\n` +
             `Always consult healthcare professionals for personalized prevention strategies.`;
    }
    
    // Check if a specific disease is mentioned
    const diseases = Object.keys(dashboardData.preventions);
    for (const disease of diseases) {
      if (input.toLowerCase().includes(disease.toLowerCase())) {
        return `Prevention for ${disease}: ${(dashboardData.preventions as any)[disease]}`;
      }
    }
    
    // If no specific disease is mentioned
    return `Prevention strategies vary by disease. Please specify which disease you'd like prevention information for (Diabetes, Anemia, Heart Disease, etc.), or ask for 'prevention for each disease' to see all.`;
  }
  
  // Special handling for technical methodology
  if (input.includes('technical') && input.includes('methodology')) {
    return `Our technical methodology follows a four-phase approach:\n\n` +
           `1. ${dashboardData.methodology[0]}\n` +
           `2. ${dashboardData.methodology[1]}\n` +
           `3. ${dashboardData.methodology[2]}\n` +
           `4. ${dashboardData.methodology[3]}`;
  }
  
  // Special handling for solution architecture
  if (input.includes('solution') || (input.includes('explore') && input.includes('solution'))) {
    return `Our solution architecture uses an ensemble of models including:\n\n` +
           `- Random Forest Classifier: ${dashboardData.architecture['Random Forest Classifier']}\n` +
           `- Gradient Boosting Classifier: ${dashboardData.architecture['Gradient Boosting Classifier']}\n\n` +
           `We've created several medical features including ${dashboardData.architecture['Medical Features Created'].split(', ').slice(0, 5).join(', ')}, and others.`;
  }
  
  // Check for matches in the knowledge base
  for (const entry of knowledgeBase) {
    if (entry.keywords.some(keyword => input.includes(keyword))) {
      // Return a random response from the matching entry
      const randomIndex = Math.floor(Math.random() * entry.responses.length);
      return entry.responses[randomIndex];
    }
  }
  
  // If no match is found, return a default response
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
}