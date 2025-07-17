// Advanced Knowledge Engine for Medical Chatbot
import { DiseaseInfo, getDiseaseInfo, getAllDiseases } from './disease-database';

// Knowledge Base Interface
interface KnowledgeEntry {
  topic: string;
  category: string;
  keywords: string[];
  content: any;
  confidence: number;
  relations: string[];
}

// Question Analysis Interface
interface QuestionAnalysis {
  intent: string;
  entities: string[];
  questionType: string;
  medicalTopic: string | null;
  confidence: number;
}

// Response Generation Interface
interface ResponseContext {
  question: string;
  analysis: QuestionAnalysis;
  relevantKnowledge: KnowledgeEntry[];
  userHistory?: string[];
}

export class MedicalKnowledgeEngine {
  private knowledgeBase: KnowledgeEntry[] = [];
  private questionPatterns: { [key: string]: RegExp[] } = {};
  private medicalEntities: { [key: string]: string[] } = {};

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeQuestionPatterns();
    this.initializeMedicalEntities();
  }

  // Initialize comprehensive knowledge base
  private initializeKnowledgeBase(): void {
    const diseases = getAllDiseases();
    
    diseases.forEach(diseaseName => {
      const diseaseInfo = getDiseaseInfo(diseaseName);
      if (diseaseInfo) {
        this.addDiseaseKnowledge(diseaseInfo);
      }
    });

    // Add general medical knowledge
    this.addGeneralMedicalKnowledge();
  }

  // Add disease-specific knowledge entries
  private addDiseaseKnowledge(diseaseInfo: DiseaseInfo): void {
    const diseaseName = diseaseInfo.name.toLowerCase();
    
    // Symptoms knowledge
    this.knowledgeBase.push({
      topic: `${diseaseName}_symptoms`,
      category: 'symptoms',
      keywords: [diseaseName, 'symptoms', 'signs', 'manifestations'],
      content: {
        disease: diseaseInfo.name,
        symptoms: diseaseInfo.symptoms,
        description: diseaseInfo.description
      },
      confidence: 0.95,
      relations: [`${diseaseName}_causes`, `${diseaseName}_treatment`]
    });

    // Causes knowledge
    this.knowledgeBase.push({
      topic: `${diseaseName}_causes`,
      category: 'causes',
      keywords: [diseaseName, 'causes', 'reasons', 'why', 'etiology'],
      content: {
        disease: diseaseInfo.name,
        causes: diseaseInfo.causes,
        riskFactors: diseaseInfo.riskFactors
      },
      confidence: 0.95,
      relations: [`${diseaseName}_symptoms`, `${diseaseName}_prevention`]
    });

    // Treatment knowledge
    this.knowledgeBase.push({
      topic: `${diseaseName}_treatment`,
      category: 'treatment',
      keywords: [diseaseName, 'treatment', 'therapy', 'cure', 'medicine', 'medication'],
      content: {
        disease: diseaseInfo.name,
        treatments: diseaseInfo.treatments,
        diagnosticTests: diseaseInfo.diagnosticTests
      },
      confidence: 0.95,
      relations: [`${diseaseName}_symptoms`, `${diseaseName}_prevention`]
    });

    // Prevention knowledge
    this.knowledgeBase.push({
      topic: `${diseaseName}_prevention`,
      category: 'prevention',
      keywords: [diseaseName, 'prevention', 'prevent', 'avoid', 'reduce risk'],
      content: {
        disease: diseaseInfo.name,
        preventions: diseaseInfo.preventions,
        riskFactors: diseaseInfo.riskFactors
      },
      confidence: 0.95,
      relations: [`${diseaseName}_causes`, `${diseaseName}_treatment`]
    });

    // Complications knowledge
    this.knowledgeBase.push({
      topic: `${diseaseName}_complications`,
      category: 'complications',
      keywords: [diseaseName, 'complications', 'risks', 'dangers', 'consequences'],
      content: {
        disease: diseaseInfo.name,
        complications: diseaseInfo.complications,
        riskFactors: diseaseInfo.riskFactors
      },
      confidence: 0.90,
      relations: [`${diseaseName}_symptoms`, `${diseaseName}_treatment`]
    });
  }

  // Add general medical knowledge
  private addGeneralMedicalKnowledge(): void {
    // Blood test knowledge
    this.knowledgeBase.push({
      topic: 'blood_tests',
      category: 'diagnostic',
      keywords: ['blood test', 'laboratory', 'blood work', 'blood panel'],
      content: {
        types: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel', 'Lipid Panel', 'Liver Function Tests'],
        importance: 'Blood tests help diagnose diseases, monitor health conditions, and guide treatment decisions.',
        frequency: 'Regular blood tests are recommended annually for healthy adults, more frequently for those with chronic conditions.'
      },
      confidence: 0.85,
      relations: ['symptoms_general', 'prevention_general']
    });

    // General health advice
    this.knowledgeBase.push({
      topic: 'general_health',
      category: 'lifestyle',
      keywords: ['health', 'healthy lifestyle', 'wellness', 'general advice'],
      content: {
        principles: ['Balanced diet', 'Regular exercise', 'Adequate sleep', 'Stress management', 'Regular check-ups'],
        importance: 'Maintaining good health helps prevent disease and improves quality of life.',
        recommendations: 'Consult healthcare providers for personalized advice based on your individual health needs.'
      },
      confidence: 0.80,
      relations: ['prevention_general']
    });

    // Add dashboard-specific knowledge
    this.addDashboardKnowledge();
  }

  // Add dashboard-specific knowledge
  private addDashboardKnowledge(): void {
    // Dashboard overview
    this.knowledgeBase.push({
      topic: 'dashboard_overview',
      category: 'dashboard',
      keywords: ['dashboard', 'overview', 'sections', 'components', 'layout', 'what is on dashboard'],
      content: {
        topic: 'Dashboard Overview',
        information: [
          'The dashboard contains multiple sections: Hero, Live Dashboard, Real-time Metrics, Data Visualization, Project Overview, Features, Team, Methodology, Demo, Results, and Footer',
          'Each section provides specific information about the medical prediction system',
          'The layout is responsive and works on both desktop and mobile devices'
        ]
      },
      confidence: 0.9,
      relations: ['live_dashboard', 'real_time_metrics', 'data_visualization']
    });

    // Live Dashboard section
    this.knowledgeBase.push({
      topic: 'live_dashboard',
      category: 'dashboard',
      keywords: ['live', 'dashboard', 'real-time', 'websocket', 'predictions', 'metrics', 'live data'],
      content: {
        topic: 'Live Dashboard',
        information: [
          'The Live Dashboard shows real-time metrics including total predictions, accuracy rate, and average confidence',
          'It uses WebSocket connections for live updates from the server',
          'Displays recent predictions timeline and historical data trends',
          'Shows connection status and health monitoring indicators'
        ]
      },
      confidence: 0.95,
      relations: ['real_time_metrics', 'websocket_connection']
    });

    // Real-time Metrics section
    this.knowledgeBase.push({
      topic: 'real_time_metrics',
      category: 'dashboard',
      keywords: ['metrics', 'real-time', 'charts', 'performance', 'accuracy', 'confidence', 'statistics'],
      content: {
        topic: 'Real-time Metrics',
        information: [
          'Displays live performance metrics with animated counters',
          'Shows prediction trends using line charts and disease distribution using bar charts',
          'Tracks accuracy over time and displays confidence scores',
          'Updates automatically with new prediction data'
        ]
      },
      confidence: 0.9,
      relations: ['live_dashboard', 'data_visualization']
    });

    // Data Visualization section
    this.knowledgeBase.push({
      topic: 'data_visualization',
      category: 'dashboard',
      keywords: ['visualization', 'charts', 'graphs', 'pie chart', 'bar chart', 'disease distribution'],
      content: {
        topic: 'Data Visualization',
        information: [
          'Shows disease class distribution using pie charts: Diabetes (60.5%), Anemia (15.2%), Heart Disease (12.8%), Thalassemia (8.3%), Thrombocytopenia (3.2%)',
          'Displays feature importance using bar charts to show which medical parameters matter most',
          'Includes model performance metrics and accuracy statistics',
          'Uses interactive charts with hover effects and tooltips'
        ]
      },
      confidence: 0.92,
      relations: ['disease_distribution', 'model_performance']
    });

    // Chatbot information
    this.knowledgeBase.push({
      topic: 'chatbot_info',
      category: 'dashboard',
      keywords: ['chatbot', 'ai', 'assistant', 'questions', 'chat', 'help', 'bot'],
      content: {
        topic: 'AI Chatbot',
        information: [
          'The chatbot (that\'s me!) is located in the bottom-right corner of the dashboard',
          'I can answer questions about medical conditions, diseases, symptoms, treatments, and prevention',
          'I also have knowledge about the dashboard components and features',
          'I use intelligent natural language processing to understand your questions and provide relevant medical information'
        ]
      },
      confidence: 0.95,
      relations: ['medical_knowledge', 'dashboard_features']
    });

    // Demo section
    this.knowledgeBase.push({
      topic: 'demo_section',
      category: 'dashboard',
      keywords: ['demo', 'prediction', 'test', 'input', 'medical parameters', 'results', 'try'],
      content: {
        topic: 'Interactive Demo',
        information: [
          'The demo section allows you to input medical parameters and get live disease predictions',
          'You can enter values for glucose, hemoglobin, platelets, cholesterol, white blood cells, and hematocrit',
          'The system provides real-time predictions with confidence scores',
          'Sample data is available for testing the prediction system'
        ]
      },
      confidence: 0.9,
      relations: ['prediction_system', 'medical_parameters']
    });

    // Navigation and features
    this.knowledgeBase.push({
      topic: 'navigation_features',
      category: 'dashboard',
      keywords: ['navigation', 'menu', 'features', 'sections', 'scroll', 'mobile', 'header'],
      content: {
        topic: 'Navigation & Features',
        information: [
          'The top navigation menu includes links to Live Dashboard, Overview, Team, Results, and Demo sections',
          'The dashboard is fully responsive and works on mobile devices',
          'Features include real-time WebSocket connections, animated charts, and interactive elements',
          'The design uses modern gradients, smooth animations, and professional medical theme'
        ]
      },
      confidence: 0.85,
      relations: ['dashboard_design', 'user_interface']
    });

    // Team section
    this.knowledgeBase.push({
      topic: 'team_section',
      category: 'dashboard',
      keywords: ['team', 'members', 'developers', 'creators', 'who made this'],
      content: {
        topic: 'Team Information',
        information: [
          'The team section showcases the developers and creators of this medical prediction system',
          'Includes team member profiles with photos, names, and roles',
          'Shows expertise areas like Medical AI, Data Science, Frontend and Backend development',
          'Provides contact information and social links for team members'
        ]
      },
      confidence: 0.88,
      relations: ['project_info', 'contact_info']
    });

    // Results and methodology
    this.knowledgeBase.push({
      topic: 'results_methodology',
      category: 'dashboard',
      keywords: ['results', 'methodology', 'accuracy', 'model', 'training', 'validation'],
      content: {
        topic: 'Results & Methodology',
        information: [
          'The results section shows overall system accuracy and performance metrics',
          'Methodology explains the data processing pipeline and model training approach',
          'Uses ensemble machine learning models with cross-validation techniques',
          'Includes performance comparisons and validation results on test datasets'
        ]
      },
      confidence: 0.9,
      relations: ['model_performance', 'data_processing']
    });
  }

  // Initialize question pattern recognition
  private initializeQuestionPatterns(): void {
    this.questionPatterns = {
      'what': [
        /what\s+(is|are)\s+(.+)/i,
        /what\s+(causes?|reasons?)\s+(.+)/i,
        /what\s+(symptoms?|signs?)\s+(.+)/i,
        /what\s+(treatments?|cures?)\s+(.+)/i,
        /what\s+(cause|causes)\s+(.+)/i,
        /what\s+(leads?\s+to|results?\s+in)\s+(.+)/i
      ],
      'how': [
        /how\s+(do|can|is)\s+(.+)/i,
        /how\s+to\s+(.+)/i,
        /how\s+(does|can)\s+(.+)/i
      ],
      'why': [
        /why\s+(do|does|is|are)\s+(.+)/i,
        /why\s+(would|should)\s+(.+)/i
      ],
      'when': [
        /when\s+(should|do|does)\s+(.+)/i,
        /when\s+(is|are)\s+(.+)/i
      ],
      'can': [
        /can\s+(you|i)\s+(.+)/i,
        /could\s+(you|i)\s+(.+)/i
      ],
      'tell_me': [
        /tell\s+me\s+about\s+(.+)/i,
        /explain\s+(.+)/i,
        /describe\s+(.+)/i
      ],
      'causes': [
        /(.+)\s+(causes?|reasons?)\s*$/i,
        /(.+)\s+(cause)\s*$/i,
        /causes?\s+of\s+(.+)/i,
        /reasons?\s+for\s+(.+)/i,
        /why\s+(.+)\s+happens?/i
      ]
    };
  }

  // Initialize medical entity recognition
  private initializeMedicalEntities(): void {
    this.medicalEntities = {
      diseases: getAllDiseases().map(d => d.toLowerCase()),
      symptoms: [
        'fatigue', 'weakness', 'pain', 'fever', 'headache', 'dizziness',
        'nausea', 'vomiting', 'shortness of breath', 'chest pain',
        'abdominal pain', 'back pain', 'joint pain', 'muscle pain',
        'skin rash', 'swelling', 'bleeding', 'bruising', 'pale skin',
        'yellow skin', 'weight loss', 'weight gain', 'appetite loss',
        'frequent urination', 'excessive thirst', 'vision problems',
        'hearing problems', 'memory problems', 'concentration problems'
      ],
      body_parts: [
        'heart', 'lungs', 'liver', 'kidneys', 'brain', 'blood',
        'bones', 'muscles', 'skin', 'eyes', 'ears', 'stomach',
        'intestines', 'bladder', 'pancreas', 'thyroid'
      ],
      medical_actions: [
        'treatment', 'diagnosis', 'prevention', 'cure', 'therapy',
        'surgery', 'medication', 'exercise', 'diet', 'lifestyle'
      ]
    };
  }

  // Main method to process questions and generate responses
  public async processQuestion(question: string, userHistory?: string[]): Promise<string> {
    try {
      // Analyze the question
      const analysis = this.analyzeQuestion(question);
      
      // Find relevant knowledge
      const relevantKnowledge = this.findRelevantKnowledge(analysis, question);
      
      // Generate response
      const response = this.generateResponse({
        question,
        analysis,
        relevantKnowledge,
        userHistory
      });
      
      return response;
    } catch (error) {
      console.error('Error processing question:', error);
      return "I apologize, but I encountered an error processing your question. Please try rephrasing it or ask me something else about medical topics.";
    }
  }

  // Analyze question to understand intent and extract entities
  private analyzeQuestion(question: string): QuestionAnalysis {
    const lowerQuestion = question.toLowerCase();
    
    // Determine question type
    let questionType = 'general';
    let intent = 'information_request';
    
    for (const [type, patterns] of Object.entries(this.questionPatterns)) {
      if (patterns.some(pattern => pattern.test(lowerQuestion))) {
        questionType = type;
        break;
      }
    }
    
    // Extract medical entities
    const entities = this.extractMedicalEntities(lowerQuestion);
    
    // Determine medical topic
    const medicalTopic = this.identifyMedicalTopic(lowerQuestion, entities);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(lowerQuestion, entities, medicalTopic);
    
    return {
      intent,
      entities,
      questionType,
      medicalTopic,
      confidence
    };
  }

  // Extract medical entities from question
  private extractMedicalEntities(question: string): string[] {
    const entities: string[] = [];
    
    // Handle common misspellings and variations
    const normalizedQuestion = this.normalizeQuestion(question);
    
    Object.entries(this.medicalEntities).forEach(([category, items]) => {
      items.forEach(item => {
        if (normalizedQuestion.includes(item) || question.includes(item)) {
          entities.push(item);
        }
      });
    });
    
    return Array.from(new Set(entities)); // Remove duplicates
  }

  // Normalize question to handle misspellings and variations
  private normalizeQuestion(question: string): string {
    const corrections: { [key: string]: string } = {
      'aneamia': 'anemia',
      'anemia': 'anemia',
      'diabetis': 'diabetes',
      'diabeties': 'diabetes',
      'hart': 'heart',
      'desease': 'disease',
      'diesease': 'disease',
      'symtoms': 'symptoms',
      'symptom': 'symptoms',
      'treatement': 'treatment',
      'preventation': 'prevention',
      'cause': 'causes',
      'reason': 'causes'
    };
    
    let normalized = question.toLowerCase();
    
    // Apply corrections
    Object.entries(corrections).forEach(([wrong, correct]) => {
      normalized = normalized.replace(new RegExp(wrong, 'gi'), correct);
    });
    
    return normalized;
  }

  // Identify main medical topic
  private identifyMedicalTopic(question: string, entities: string[]): string | null {
    // Check for disease names
    const diseaseEntities = entities.filter(entity => 
      this.medicalEntities.diseases.includes(entity)
    );
    
    if (diseaseEntities.length > 0) {
      return diseaseEntities[0];
    }
    
    // Check for symptoms that might indicate a disease
    const symptomEntities = entities.filter(entity => 
      this.medicalEntities.symptoms.includes(entity)
    );
    
    if (symptomEntities.length > 0) {
      return this.mapSymptomToDisease(symptomEntities[0]);
    }
    
    return null;
  }

  // Map symptom to potential disease
  private mapSymptomToDisease(symptom: string): string | null {
    const symptomDiseaseMap: { [key: string]: string } = {
      'fatigue': 'anemia',
      'weakness': 'anemia',
      'excessive thirst': 'diabetes',
      'frequent urination': 'diabetes',
      'chest pain': 'heart disease',
      'shortness of breath': 'heart disease',
      'pale skin': 'anemia',
      'bruising': 'thrombocytopenia',
      'bleeding': 'thrombocytopenia'
    };
    
    return symptomDiseaseMap[symptom] || null;
  }

  // Calculate confidence score
  private calculateConfidence(question: string, entities: string[], medicalTopic: string | null): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence for medical entities
    confidence += entities.length * 0.1;
    
    // Increase confidence for identified medical topic
    if (medicalTopic) {
      confidence += 0.3;
    }
    
    // Increase confidence for clear question patterns
    const hasQuestionPattern = Object.values(this.questionPatterns).some(patterns =>
      patterns.some(pattern => pattern.test(question))
    );
    
    if (hasQuestionPattern) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }

  // Find relevant knowledge entries
  private findRelevantKnowledge(analysis: QuestionAnalysis, question: string): KnowledgeEntry[] {
    const relevantEntries: KnowledgeEntry[] = [];
    
    this.knowledgeBase.forEach(entry => {
      let relevanceScore = 0;
      
      // Check keyword matches
      const keywordMatches = entry.keywords.filter(keyword =>
        analysis.entities.includes(keyword) || 
        question.toLowerCase().includes(keyword)
      );
      
      relevanceScore += keywordMatches.length * 0.3;
      
      // Check medical topic match
      if (analysis.medicalTopic && entry.topic.includes(analysis.medicalTopic)) {
        relevanceScore += 0.5;
      }
      
      // Check question type relevance
      if (this.isQuestionTypeRelevant(analysis.questionType, entry.category)) {
        relevanceScore += 0.3;
      }
      
      if (relevanceScore > 0.3) {
        relevantEntries.push({
          ...entry,
          confidence: relevanceScore
        });
      }
    });
    
    // Sort by relevance score
    return relevantEntries.sort((a, b) => b.confidence - a.confidence);
  }

  // Check if question type is relevant to knowledge category
  private isQuestionTypeRelevant(questionType: string, category: string): boolean {
    const relevanceMap: { [key: string]: string[] } = {
      'what': ['symptoms', 'causes', 'treatment', 'prevention', 'complications', 'dashboard'],
      'how': ['treatment', 'prevention', 'diagnostic', 'dashboard'],
      'why': ['causes', 'complications'],
      'when': ['treatment', 'diagnostic'],
      'tell_me': ['symptoms', 'causes', 'treatment', 'prevention', 'dashboard'],
      'causes': ['causes'], // New pattern for cause-specific questions
      'can': ['symptoms', 'causes', 'treatment', 'prevention', 'dashboard']
    };
    
    return relevanceMap[questionType]?.includes(category) || false;
  }

  // Generate intelligent response
  private generateResponse(context: ResponseContext): string {
    const { question, analysis, relevantKnowledge } = context;
    
    if (relevantKnowledge.length === 0) {
      return this.generateFallbackResponse(analysis);
    }
    
    // Use the most relevant knowledge entry
    const primaryKnowledge = relevantKnowledge[0];
    
    switch (primaryKnowledge.category) {
      case 'symptoms':
        return this.generateSymptomsResponse(primaryKnowledge, analysis);
      case 'causes':
        return this.generateCausesResponse(primaryKnowledge, analysis);
      case 'treatment':
        return this.generateTreatmentResponse(primaryKnowledge, analysis);
      case 'prevention':
        return this.generatePreventionResponse(primaryKnowledge, analysis);
      case 'complications':
        return this.generateComplicationsResponse(primaryKnowledge, analysis);
      default:
        return this.generateGeneralResponse(primaryKnowledge, analysis);
    }
  }

  // Generate symptoms response
  private generateSymptomsResponse(knowledge: KnowledgeEntry, analysis: QuestionAnalysis): string {
    const content = knowledge.content;
    
    let response = `**${content.disease} - Symptoms & Signs**\n\n`;
    response += `${content.description}\n\n`;
    response += `**Common symptoms include:**\n`;
    
    content.symptoms.forEach((symptom: string, index: number) => {
      response += `${index + 1}. ${symptom}\n`;
    });
    
    response += `\n**Important:** If you're experiencing any of these symptoms, especially if they're severe or persistent, please consult with a healthcare provider for proper evaluation and diagnosis.`;
    
    return response;
  }

  // Generate causes response
  private generateCausesResponse(knowledge: KnowledgeEntry, analysis: QuestionAnalysis): string {
    const content = knowledge.content;
    
    let response = `**${content.disease} - Causes & Risk Factors**\n\n`;
    response += `**Main causes include:**\n`;
    
    content.causes.forEach((cause: string, index: number) => {
      response += `${index + 1}. ${cause}\n`;
    });
    
    if (content.riskFactors && content.riskFactors.length > 0) {
      response += `\n**Risk factors:**\n`;
      content.riskFactors.forEach((factor: string, index: number) => {
        response += `• ${factor}\n`;
      });
    }
    
    response += `\n**Note:** Understanding the causes can help with prevention and early detection. Consult your healthcare provider for personalized risk assessment.`;
    
    return response;
  }

  // Generate treatment response
  private generateTreatmentResponse(knowledge: KnowledgeEntry, analysis: QuestionAnalysis): string {
    const content = knowledge.content;
    
    let response = `**${content.disease} - Treatment Options**\n\n`;
    response += `**Available treatments include:**\n`;
    
    content.treatments.forEach((treatment: string, index: number) => {
      response += `${index + 1}. ${treatment}\n`;
    });
    
    if (content.diagnosticTests && content.diagnosticTests.length > 0) {
      response += `\n**Diagnostic tests may include:**\n`;
      content.diagnosticTests.forEach((test: string) => {
        response += `• ${test}\n`;
      });
    }
    
    response += `\n**Important:** Treatment plans should always be individualized based on your specific condition, severity, and other health factors. Never start or stop treatments without consulting your healthcare provider.`;
    
    return response;
  }

  // Generate prevention response
  private generatePreventionResponse(knowledge: KnowledgeEntry, analysis: QuestionAnalysis): string {
    const content = knowledge.content;
    
    let response = `**${content.disease} - Prevention Strategies**\n\n`;
    response += `**To help prevent ${content.disease.toLowerCase()}, consider these strategies:**\n`;
    
    content.preventions.forEach((prevention: string, index: number) => {
      response += `${index + 1}. ${prevention}\n`;
    });
    
    response += `\n**Remember:** Prevention is often the best medicine. While not all cases can be prevented, following these guidelines can significantly reduce your risk.`;
    
    return response;
  }

  // Generate complications response
  private generateComplicationsResponse(knowledge: KnowledgeEntry, analysis: QuestionAnalysis): string {
    const content = knowledge.content;
    
    let response = `**${content.disease} - Potential Complications**\n\n`;
    response += `**If left untreated, ${content.disease.toLowerCase()} may lead to:**\n`;
    
    content.complications.forEach((complication: string, index: number) => {
      response += `${index + 1}. ${complication}\n`;
    });
    
    response += `\n**Important:** Early detection and proper treatment can prevent most complications. Regular monitoring and following your healthcare provider's recommendations are essential.`;
    
    return response;
  }

  // Generate general response
  private generateGeneralResponse(knowledge: KnowledgeEntry, analysis: QuestionAnalysis): string {
    const content = knowledge.content;
    
    let response = `**Medical Information - ${knowledge.topic.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    
    if (typeof content === 'object') {
      Object.entries(content).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          response += `**${key.charAt(0).toUpperCase() + key.slice(1)}:**\n`;
          value.forEach((item: string, index: number) => {
            response += `${index + 1}. ${item}\n`;
          });
          response += '\n';
        } else {
          response += `**${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}\n\n`;
        }
      });
    }
    
    response += `**Note:** This information is for educational purposes. Always consult with healthcare professionals for medical advice.`;
    
    return response;
  }

  // Generate fallback response
  private generateFallbackResponse(analysis: QuestionAnalysis): string {
    if (analysis.entities.length > 0) {
      return `I understand you're asking about ${analysis.entities.join(', ')}. While I have extensive knowledge about blood diseases and dashboard features, I may not have specific information about your exact question. 

Could you please rephrase your question or ask about:
• Symptoms of specific diseases (diabetes, anemia, heart disease, etc.)
• Causes and risk factors
• Treatment options
• Prevention strategies
• Dashboard features and components
• When to seek medical care

I'm here to help with evidence-based medical information and dashboard guidance!`;
    }
    
    return `I'd be happy to help you with medical information and dashboard features! I can provide detailed, evidence-based answers about:

**Blood Diseases:** Anemia, Thrombocytopenia, Thalassemia
**Chronic Conditions:** Diabetes, Heart Disease
**Dashboard Features:** Live Dashboard, Data Visualization, Demo Section, Real-time Metrics
**General Topics:** Symptoms, Causes, Treatments, Prevention

Could you please ask a specific question about any of these topics? For example:
• "What are the symptoms of anemia?"
• "What causes anemia?"
• "How is diabetes treated?"
• "What's on the dashboard?"
• "How does the demo work?"

I'm here to provide accurate medical information and help you understand the dashboard features better.`;
  }
}
