# Blood Disease Classification API Documentation

## Overview
This API provides endpoints for blood disease prediction, real-time analytics, and AI-powered medical consultation.

**Base URL**: `http://localhost:5000/api`  
**Version**: 1.0.0  
**Accuracy**: 98.559%

## Quick Start

### 1. Health Check
```bash
GET /api/health
```

### 2. Make a Prediction
```bash
POST /api/predict
Content-Type: application/json

{
  "glucose": 120,
  "hemoglobin": 14.5,
  "platelets": 250000,
  "cholesterol": 180,
  "whiteBloodCells": 7000,
  "hematocrit": 42
}
```

### 3. Get Live Metrics
```bash
GET /api/live-metrics
```

## Authentication
No authentication required for this hackathon demo.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

## Endpoints

### Core Prediction Endpoints

#### POST /predict
Submit blood parameters for disease prediction.

**Request Body:**
```json
{
  "glucose": 120,        // Blood glucose level (mg/dL)
  "hemoglobin": 14.5,    // Hemoglobin level (g/dL)
  "platelets": 250000,   // Platelet count (per μL)
  "cholesterol": 180,    // Total cholesterol (mg/dL)
  "whiteBloodCells": 7000, // White blood cell count (per μL)
  "hematocrit": 42      // Hematocrit percentage (%)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prediction": "Diabetes",
    "confidence": 0.92,
    "probability": {
      "Diabetes": 0.92,
      "Healthy": 0.05,
      "Anemia": 0.02,
      "Heart Disease": 0.01,
      "Thrombocytopenia": 0.00,
      "Thalassemia": 0.00
    },
    "recommendation": "Consult with healthcare provider for diabetes management",
    "urgency": "moderate"
  }
}
```

#### POST /predictions
Create a prediction (internal format).

**Request Body:** Same as `/predict`

**Response:**
```json
{
  "glucose": 120,
  "hemoglobin": 14.5,
  "platelets": 250000,
  "cholesterol": 180,
  "whiteBloodCells": 7000,
  "hematocrit": 42,
  "prediction": "Healthy",
  "confidence": 0.85,
  "id": 1,
  "createdAt": "2025-01-18T10:30:00Z"
}
```

#### GET /predictions
Get all predictions from the system.

**Response:**
```json
[
  {
    "id": 1,
    "glucose": 120,
    "hemoglobin": 14.5,
    "platelets": 250000,
    "cholesterol": 180,
    "whiteBloodCells": 7000,
    "hematocrit": 42,
    "prediction": "Healthy",
    "confidence": 0.85,
    "createdAt": "2025-01-18T10:30:00Z"
  }
]
```

#### GET /recent-predictions
Fetch recent blood disease predictions.

**Query Parameters:**
- `limit` (optional): Number of predictions to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pred_123",
      "prediction": "Diabetes",
      "confidence": 0.92,
      "timestamp": "2025-01-18T10:30:00Z",
      "parameters": { ... }
    }
  ],
  "total": 1247,
  "page": 1
}
```

#### GET /live-metrics
Get real-time system metrics and dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPredictions": 1247,
    "accuracyRate": 0.98559,
    "activeCases": 156,
    "avgConfidence": 0.942,
    "diseaseStats": {
      "Diabetes": 35,
      "Anemia": 28,
      "Heart Disease": 18,
      "Thrombocytopenia": 12,
      "Thalassemia": 7
    },
    "timestamp": "2025-01-18T10:30:00Z"
  }
}
```

#### GET /disease-distribution
Get disease classification distribution data.

**Response:**
```json
{
  "success": true,
  "data": {
    "Diabetes": "32%",
    "Anemia": "24%",
    "Heart Disease": "18%",
    "Thrombocytopenia": "15%",
    "Thalassemia": "8%",
    "Healthy": "3%"
  }
}
```

### Disease Information Endpoints

#### GET /diseases
Get all available diseases in the system.

**Response:**
```json
[
  {
    "name": "Diabetes",
    "description": "A group of metabolic disorders characterized by high blood sugar levels.",
    "category": "Metabolic"
  },
  {
    "name": "Anemia",
    "description": "A condition in which you lack enough healthy red blood cells.",
    "category": "Blood"
  }
]
```

#### GET /disease/:name
Get detailed information about a specific disease.

**Parameters:**
- `name` (required): Disease name (e.g., "Diabetes", "Anemia")

**Response:**
```json
{
  "name": "Diabetes",
  "description": "A group of metabolic disorders characterized by high blood sugar levels.",
  "symptoms": ["Excessive thirst", "Frequent urination", "Unexplained weight loss"],
  "causes": ["Genetics", "Lifestyle factors", "Autoimmune conditions"],
  "treatments": ["Insulin therapy", "Diet modification", "Exercise"],
  "preventions": ["Healthy diet", "Regular exercise", "Weight management"],
  "riskFactors": ["Family history", "Age", "Obesity"]
}
```

#### GET /disease/:name/symptoms
Get symptoms for a specific disease.

**Response:**
```json
{
  "disease": "Diabetes",
  "symptoms": [
    "Excessive thirst (polydipsia)",
    "Frequent urination (polyuria)",
    "Unexplained weight loss",
    "Increased hunger",
    "Fatigue and weakness"
  ],
  "description": "A group of metabolic disorders characterized by high blood sugar levels."
}
```

#### GET /disease/:name/treatment
Get treatment information for a specific disease.

**Response:**
```json
{
  "disease": "Diabetes",
  "treatments": [
    "Insulin therapy",
    "Oral medications",
    "Diet modification",
    "Regular exercise",
    "Blood sugar monitoring"
  ],
  "description": "A group of metabolic disorders characterized by high blood sugar levels."
}
```

#### GET /disease/:name/causes
Get causes and risk factors for a specific disease.

**Response:**
```json
{
  "disease": "Diabetes",
  "causes": [
    "Genetic predisposition",
    "Autoimmune destruction of beta cells",
    "Insulin resistance",
    "Lifestyle factors"
  ],
  "riskFactors": [
    "Family history",
    "Age over 45",
    "Obesity",
    "Sedentary lifestyle"
  ],
  "description": "A group of metabolic disorders characterized by high blood sugar levels."
}
```

#### GET /disease/:name/prevention
Get prevention strategies for a specific disease.

**Response:**
```json
{
  "disease": "Diabetes",
  "preventions": [
    "Maintain healthy weight",
    "Regular physical activity",
    "Healthy diet",
    "Avoid smoking",
    "Limit alcohol consumption"
  ],
  "riskFactors": [
    "Family history",
    "Age over 45",
    "Obesity"
  ],
  "description": "A group of metabolic disorders characterized by high blood sugar levels."
}
```

### Chatbot Endpoints

#### POST /chatbot/session
Create a new chat session with the AI medical assistant.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_abc123",
    "createdAt": "2025-01-18T10:30:00Z",
    "expiresAt": "2025-01-18T11:30:00Z"
  }
}
```

#### GET /chatbot/session/:sessionId
Get an existing chat session by ID.

**Parameters:**
- `sessionId` (required): Chat session ID

**Response:**
```json
{
  "sessionId": "session_abc123",
  "messages": [
    {
      "id": "msg_123",
      "text": "Hello! I'm Dr. CodeNomads...",
      "sender": "bot",
      "timestamp": "2025-01-18T10:30:00Z"
    }
  ]
}
```

#### POST /chatbot/message
Send a message to the AI chatbot.

**Request Body:**
```json
{
  "sessionId": "session_abc123",
  "message": "What are the symptoms of diabetes?"
}
```

**Response:**
```json
{
  "userMessage": {
    "id": "msg_123",
    "text": "What are the symptoms of diabetes?",
    "sender": "user",
    "timestamp": "2025-01-18T10:30:00Z"
  },
  "botResponse": {
    "id": "msg_124",
    "text": "The symptoms you should watch for...",
    "sender": "bot",
    "timestamp": "2025-01-18T10:30:05Z"
  }
}
```

#### GET /chatbot/history
Get chat history for a session.

**Query Parameters:**
- `sessionId` (required): Chat session ID

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_abc123",
    "messages": [
      {
        "id": "msg_123",
        "text": "What are the symptoms of diabetes?",
        "sender": "user",
        "timestamp": "2025-01-18T10:30:00Z"
      },
      {
        "id": "msg_124",
        "text": "The symptoms you should watch for...",
        "sender": "bot",
        "timestamp": "2025-01-18T10:30:05Z"
      }
    ]
  }
}
```

### Training & Demo Endpoints

#### GET /training/stats
Get training statistics and model performance metrics.

**Response:**
```json
{
  "totalSessions": 150,
  "totalMessages": 1247,
  "avgResponseTime": "0.8s",
  "topCategories": [
    {"category": "Diabetes", "count": 45},
    {"category": "Anemia", "count": 38}
  ],
  "successRate": 96.5,
  "lastUpdated": "2025-01-18T10:30:00Z"
}
```

#### GET /training/demo
Get demo conversations and training examples.

**Response:**
```json
{
  "conversations": [
    {
      "id": "demo_1",
      "title": "Diabetes Consultation",
      "messages": [
        {"text": "What are diabetes symptoms?", "sender": "user"},
        {"text": "Diabetes symptoms include...", "sender": "bot"}
      ]
    }
  ],
  "examples": [
    {
      "input": "What causes anemia?",
      "output": "Anemia can be caused by...",
      "category": "medical_info"
    }
  ]
}
```

#### POST /training/test
Run training tests with custom inputs.

**Request Body:**
```json
{
  "testInputs": [
    "What are the symptoms of diabetes?",
    "How is anemia treated?",
    "What causes high blood pressure?"
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "input": "What are the symptoms of diabetes?",
      "output": "Diabetes symptoms include excessive thirst, frequent urination...",
      "timestamp": "2025-01-18T10:30:00Z"
    }
  ]
}
```

#### GET /training/validate
Validate training data integrity.

**Response:**
```json
{
  "isValid": true,
  "totalEntries": 500,
  "validEntries": 495,
  "errors": [
    {
      "entry": 45,
      "issue": "Missing response text",
      "severity": "warning"
    }
  ],
  "lastValidated": "2025-01-18T10:30:00Z"
}
```

### System Statistics

#### GET /stats
Get comprehensive system statistics and model performance metrics.

**Response:**
```json
{
  "totalSamples": 70,
  "testSamples": 14,
  "medicalFeatures": 24,
  "engineeredFeatures": 13,
  "diseaseClasses": 6,
  "targetAccuracy": 98.559,
  "trainingAccuracy": 100.0,
  "validationAccuracy": 100.0
}
```

#### GET /health
Server health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": "2h 45m 30s",
    "version": "1.0.0",
    "database": "connected",
    "memory": "45.2MB",
    "cpu": "12%"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": "2h 45m 30s",
    "version": "1.0.0",
    "database": "connected",
    "memory": "45MB",
    "cpu": "12%"
  }
}
```

## WebSocket Endpoints

### WS /ws
Real-time updates for dashboard metrics and live data streaming.

**Connection:** `ws://localhost:5000/ws`

**Events:**
- `live-update`: Live system metrics with predictions
- `connection`: WebSocket connection established
- `error`: Connection or data errors

**Example Message:**
```json
{
  "type": "live-update",
  "data": {
    "totalPredictions": 1248,
    "accuracyRate": 0.98559,
    "activeCases": 156,
    "avgConfidence": 0.942,
    "diseaseStats": {
      "Diabetes": 35,
      "Anemia": 28,
      "Heart Disease": 18
    },
    "recentPredictions": [
      {
        "id": 1248,
        "prediction": "Diabetes",
        "confidence": 0.92,
        "timestamp": "2025-01-18T10:30:00Z"
      }
    ],
    "timestamp": "2025-01-18T10:30:00Z"
  }
}
```

### WS /live-updates (Legacy)
Real-time updates for dashboard metrics (legacy endpoint).

**Connection:** `ws://localhost:5000/live-updates`

**Events:**
- `metrics-update`: Live system metrics
- `new-prediction`: New prediction made
- `system-status`: System status changes

**Example Message:**
```json
{
  "type": "metrics-update",
  "data": {
    "totalPredictions": 1248,
    "accuracyRate": 0.98559,
    "timestamp": "2025-01-18T10:30:00Z"
  }
}
```

## Complete Endpoint Summary

### Core Prediction (8 endpoints)
- `GET /health` - Server health check
- `POST /predict` - Blood disease prediction (enhanced)
- `POST /predictions` - Blood disease prediction (basic)
- `GET /predictions` - Get all predictions
- `GET /recent-predictions` - Get recent predictions with pagination
- `GET /live-metrics` - Real-time dashboard metrics
- `GET /disease-distribution` - Disease classification statistics
- `GET /stats` - System performance statistics

### Disease Information (6 endpoints)
- `GET /diseases` - List all diseases
- `GET /disease/:name` - Get disease details
- `GET /disease/:name/symptoms` - Get disease symptoms
- `GET /disease/:name/treatment` - Get treatment options
- `GET /disease/:name/causes` - Get causes and risk factors
- `GET /disease/:name/prevention` - Get prevention strategies

### Chatbot (4 endpoints)
- `POST /chatbot/session` - Create chat session
- `GET /chatbot/session/:sessionId` - Get chat session
- `POST /chatbot/message` - Send message to bot
- `GET /chatbot/history` - Get chat history

### Training & Demo (4 endpoints)
- `GET /training/stats` - Training statistics
- `GET /training/demo` - Demo conversations
- `POST /training/test` - Run training tests
- `GET /training/validate` - Validate training data

### WebSocket (2 endpoints)
- `WS /ws` - Real-time updates (primary)
- `WS /live-updates` - Real-time updates (legacy)

**Total: 24 endpoints** providing comprehensive blood disease classification, medical consultation, and system monitoring capabilities.

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input parameters |
| `PREDICTION_FAILED` | Prediction model error |
| `SESSION_NOT_FOUND` | Chat session doesn't exist |
| `DISEASE_NOT_FOUND` | Disease information not found |
| `TRAINING_ERROR` | Training process error |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## Rate Limiting

- **Predictions**: 100 requests per minute
- **Disease Information**: 200 requests per minute
- **Chatbot**: 50 messages per minute
- **Training**: 20 requests per minute
- **Metrics**: 200 requests per minute

## Examples

### cURL Examples

```bash
# Health check
curl -X GET http://localhost:5000/api/health

# Make prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "glucose": 120,
    "hemoglobin": 14.5,
    "platelets": 250000,
    "cholesterol": 180,
    "whiteBloodCells": 7000,
    "hematocrit": 42
  }'

# Get disease information
curl -X GET http://localhost:5000/api/disease/Diabetes

# Get disease symptoms
curl -X GET http://localhost:5000/api/disease/Diabetes/symptoms

# Get all diseases
curl -X GET http://localhost:5000/api/diseases

# Get system statistics
curl -X GET http://localhost:5000/api/stats

# Get live metrics
curl -X GET http://localhost:5000/api/live-metrics

# Start chat session
curl -X POST http://localhost:5000/api/chatbot/session

# Send message to chatbot
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_abc123",
    "message": "What are the symptoms of diabetes?"
  }'

# Get chat history
curl -X GET "http://localhost:5000/api/chatbot/history?sessionId=session_abc123"

# Run training test
curl -X POST http://localhost:5000/api/training/test \
  -H "Content-Type: application/json" \
  -d '{
    "testInputs": ["What causes diabetes?", "How is anemia treated?"]
  }'

# Get training stats
curl -X GET http://localhost:5000/api/training/stats
```

### JavaScript Examples

```javascript
// Make a prediction
const prediction = await fetch('/api/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    glucose: 120,
    hemoglobin: 14.5,
    platelets: 250000,
    cholesterol: 180,
    whiteBloodCells: 7000,
    hematocrit: 42
  })
});

const result = await prediction.json();
console.log(result.data.prediction); // "Diabetes"
console.log(result.data.confidence); // 0.92

// Connect to WebSocket for live updates
const ws = new WebSocket('ws://localhost:5000/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Live update:', data);
};

// Get disease information
fetch('/api/disease/Diabetes')
  .then(response => response.json())
  .then(data => console.log('Disease info:', data));

// Get all diseases
fetch('/api/diseases')
  .then(response => response.json())
  .then(data => console.log('All diseases:', data));

// Send chat message
fetch('/api/chatbot/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId: 'session_abc123',
    message: 'What are the symptoms of diabetes?'
  })
})
.then(response => response.json())
.then(data => console.log('Chat response:', data));

// Run training test
fetch('/api/training/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    testInputs: ['What causes diabetes?', 'How is anemia treated?']
  })
})
.then(response => response.json())
.then(data => console.log('Training results:', data));
```

## Support

For questions or issues:
- **Team**: CodeNomads
- **Event**: IndabaX South Sudan 2025
- **Repository**: [GitHub](https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon)
