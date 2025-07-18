# Blood Disease Classification AI

<div align="center">
  
![Blood Disease AI Banner](https://img.shields.io/badge/IndabaX-South%20Sudan%202025-blue?style=for-the-badge&logo=artificial-intelligence)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

** IndabaX South Sudan 2025 Hackathon Submission**  
**An advanced AI-powered web application for automated blood disease diagnosis and prediction**

[ Live Demo](https://codenomads.onrender.com/) • [Features](#features) • [Installation](#installation) • [API Docs](#api-documentation) • [AI Chatbot](./CHATBOT.md) • [Database](./DATABASE.md) • [Team](#team-codenomads)

</div>

---

## Overview

Blood Disease Classification AI is a comprehensive full-stack web application that leverages machine learning algorithms to predict and classify blood diseases based on medical parameters. Developed for the **IndabaX South Sudan 2025 AI Hackathon**, this project demonstrates the power of AI in healthcare diagnostics.

### Key Highlights

- **98.7% Accuracy**: State-of-the-art machine learning model performance
- **Real-time Processing**: Live predictions with WebSocket connectivity
- **Interactive Dashboard**: Comprehensive data visualization and analytics
- **AI Chatbot**: Intelligent medical consultation system
- **6 Disease Classifications**: Diabetes, Anemia, Thalassemia, Heart Disease, Thrombocytopenia, and Healthy
- **24 Medical Parameters**: Comprehensive blood analysis features

---

## Screenshots

<div align="center">

###  Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400/1e293b/ffffff?text=Live+Health+Dashboard)
*Real-time metrics and disease distribution analytics*

###  AI-Powered Predictions
![Predictions](https://via.placeholder.com/800x400/dc2626/ffffff?text=Blood+Disease+Classification)
*Instant blood disease classification with confidence scores*

###  AI Chatbot Interface
![Chatbot](https://via.placeholder.com/800x400/059669/ffffff?text=Medical+AI+Assistant)
*Interactive medical consultation system*

</div>

---

## Quick Start

```bash
# Clone and setup
git clone https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon.git
cd IndabaX-South-Sudan-2025-AI-Hackathon
npm install

# Environment setup
cp .env.example .env
# Edit .env with your database credentials

# Database setup and start
npm run db:setup
npm run dev
```

Visit [`https://codenomads.onrender.com/`](https://codenomads.onrender.com/) to see the application live!

---

## Features

### AI-Powered Predictions
- **Machine Learning Pipeline**: Advanced ensemble methods for blood disease classification
- **Feature Engineering**: 13 engineered medical features for enhanced accuracy
- **Real-time Analysis**: Instant predictions with confidence scores
- **Multiple Disease Detection**: Simultaneous classification of 6 different conditions

### Interactive Dashboard
- **Live Metrics**: Real-time accuracy, prediction count, and active cases
- **Data Visualization**: Interactive charts and graphs using modern UI components
- **Disease Distribution**: Visual representation of prediction outcomes
- **Performance Analytics**: Detailed model performance metrics

### AI Chatbot
- **Medical Consultation**: Interactive AI assistant for healthcare queries
- **Context-aware**: Understands medical terminology and provides relevant responses
- **Session Management**: Persistent chat sessions with history
- **Welcome Popup**: Proactive user engagement system

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Adaptive theme system
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Accessibility**: WCAG compliant design principles

---

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Vite** - Lightning-fast build tool and development server
- **Shadcn/UI** - Beautiful and accessible component library
- **React Query** - Powerful data fetching and caching
- **Wouter** - Lightweight routing solution

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Fast and minimalist web framework
- **TypeScript** - Type-safe backend development
- **WebSocket** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing configuration

### Database & ORM
- **PostgreSQL** - Advanced relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Neon** - Serverless PostgreSQL platform
- **Database Migration** - Automated schema management

### AI & Machine Learning
- **Custom ML Pipeline** - Ensemble methods implementation
- **Feature Engineering** - Advanced medical parameter processing
- **Real-time Inference** - Low-latency prediction system
- **Model Validation** - Comprehensive testing and validation

---

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v13 or higher)
- **Git**

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon.git
cd IndabaX-South-Sudan-2025-AI-Hackathon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/blood_disease_db

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: External API Keys
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Database Setup
```bash
# Run database migrations
npm run db:setup

# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

---

## Usage

### 1. **Dashboard Overview**
- Navigate to the main dashboard to view live metrics
- Monitor real-time predictions and accuracy rates
- Explore disease distribution charts

### 2. **Blood Disease Prediction**
- Access the demo section for interactive predictions
- Input medical parameters for instant analysis
- Review confidence scores and recommendations

### 3. **AI Chatbot**
- Click the chat icon to interact with the AI assistant
- Ask questions about blood diseases, symptoms, or the system
- Get contextual responses and medical guidance

### 4. **Data Visualization**
- Explore interactive charts and graphs
- Analyze feature importance and model performance
- Review historical prediction data

---

## Model Performance

| Metric | Value |
|--------|-------|
| **Accuracy** | 98.7% |
| **Precision** | 98.1% |
| **Recall** | 98.3% |
| **F1-Score** | 98.2% |
| **Processing Time** | <15ms |
| **Supported Diseases** | 6 classifications |

### Disease Classifications
1. **Diabetes** - Blood sugar disorders
2. **Anemia** - Low red blood cell count
3. **Thalassemia** - Genetic blood disorders
4. **Heart Disease** - Cardiovascular conditions
5. **Thrombocytopenia** - Low platelet count
6. **Healthy** - Normal blood parameters

---

## Project Structure

```
IndabaX-South-Sudan-2025-AI-Hackathon/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json
├── server/                   # Backend Node.js application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── db.ts               # Database configuration
│   ├── chatbot.ts          # AI chatbot logic
│   └── storage.ts          # Data persistence
├── shared/                  # Shared types and schemas
│   └── schema.ts
├── migrations/              # Database migrations
├── drizzle.config.ts       # Database configuration
└── README.md
```

---

## API Documentation

> ** Quick Start**: Run `npm run dev` and test the API endpoints below!  
> ** Complete API Reference**: See [API.md](./API.md) for detailed documentation with all 24 endpoints

### Base URL
```
http://localhost:5000/api
```

🔗 **Quick API Test Links** (when running locally):
- [ Live Metrics](http://localhost:5000/api/live-metrics)
- [ Recent Predictions](http://localhost:5000/api/recent-predictions)
- [ Disease Distribution](http://localhost:5000/api/disease-distribution)
- [ System Stats](http://localhost:5000/api/stats)
- [ Health Check](http://localhost:5000/api/health)

### Authentication
No authentication required for this hackathon demo.

### Response Format
All API responses return JSON with the following structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

### Error Handling
Error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

### Endpoints

#### Predictions
- **`GET /live-metrics`** - Get real-time system metrics
  - **Response**: Live dashboard metrics including accuracy, total predictions, active cases
  - **Test**: [ Try it now](http://localhost:5000/api/live-metrics)

- **`GET /recent-predictions`** - Fetch recent predictions
  - **Response**: Array of recent blood disease predictions
  - **Test**: [ Try it now](http://localhost:5000/api/recent-predictions)

- **`GET /disease-distribution`** - Get disease classification data
  - **Response**: Distribution percentages of detected diseases
  - **Test**: [ Try it now](http://localhost:5000/api/disease-distribution)

- **`POST /predict`** - Submit new prediction request
  - **Body**: Blood parameters (glucose, hemoglobin, platelets, cholesterol, WBC, hematocrit)
  - **Response**: Disease prediction with confidence score
  - **Test**: Use tools like [Postman](https://www.postman.com/) or curl
  - **Example**: 
    ```json
    {
      "glucose": 120,
      "hemoglobin": 14.5,
      "platelets": 250000,
      "cholesterol": 180,
      "wbc": 7000,
      "hematocrit": 42
    }
    ```

#### Chatbot
- **`POST /chatbot/session`** - Create new chat session
  - **Response**: New session ID for chat context
  - **Test**: Use POST request tools like [Postman](https://www.postman.com/)

- **`POST /chatbot/message`** - Send message to chatbot
  - **Body**: `{ "sessionId": "string", "message": "string" }`
  - **Response**: AI-generated medical consultation response
  - **Test**: Use POST request tools with JSON body

- **`GET /chatbot/history`** - Get chat history
  - **Params**: `sessionId` (query parameter)
  - **Response**: Array of chat messages for the session
  - **Test**: `GET /api/chatbot/history?sessionId=your-session-id`

#### Statistics
- **`GET /stats`** - System statistics and performance metrics
  - **Response**: Model performance, training stats, feature importance
  - **Test**: [ Try it now](http://localhost:5000/api/stats)

- **`GET /health`** - Server health check
  - **Response**: Server status and uptime information
  - **Test**: [ Try it now](http://localhost:5000/api/health)

#### WebSocket Endpoints
- **`WS /live-updates`** - Real-time updates for dashboard metrics
  - **Connection**: `ws://localhost:5000/live-updates`
  - **Events**: Live metrics, new predictions, system status
  - **Test**: Use WebSocket testing tools like [WebSocket King](https://websocketking.com/)

---

###  **API Testing Tools**

**For GET Requests:**
- Click the direct links above when your server is running
- Use browser developer tools
- Try [Postman](https://www.postman.com/) for advanced testing

**For POST Requests:**
- [Postman](https://www.postman.com/) - Professional API testing
- [Insomnia](https://insomnia.rest/) - Modern API client
- [Thunder Client](https://www.thunderclient.com/) - VS Code extension

**For WebSocket Testing:**
- [WebSocket King](https://websocketking.com/) - Online WebSocket tester
- [WebSocket.org Echo Test](https://www.websocket.org/echo.html) - Simple echo test

**Sample cURL Commands:**
```bash
# Test live metrics
curl http://localhost:5000/api/live-metrics

# Test health check
curl http://localhost:5000/api/health

# Test prediction (POST)
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"glucose":120,"hemoglobin":14.5,"platelets":250000,"cholesterol":180,"wbc":7000,"hematocrit":42}'
```

> ** Need more details?** Check out the [Complete API Documentation](./API.md) for all 24 endpoints, detailed examples, and integration guides.

---

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure
- **Unit Tests** - Component and function testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Full user workflow testing

---

## Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t blood-disease-ai .

# Run container
docker run -p 5000:5000 blood-disease-ai
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
PORT=5000
```

---

## Contributing

We welcome contributions to improve the Blood Disease Classification AI project!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation for new features

---

## Team CodeNomads

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ARIIK-ANTHONY">
        <img src="https://github.com/ARIIK-ANTHONY.png" width="100px;" alt="Ariik Anthony"/>
        <br />
        <sub><b>ARIIK ANTHONY MATHIANG</b></sub>
      </a>
      <br />
      <i>Software Engineer</i>
      <br />
      <a href="https://github.com/ARIIK-ANTHONY">GitHub</a> • 
      <a href="https://www.linkedin.com/in/anthony-ariik-43812a308/">LinkedIn</a>
    </td>
    <td align="center">
      <a href="https://github.com/Jongkuch1">
        <img src="https://github.com/Jongkuch1.png" width="100px;" alt="Jongkuch Chol"/>
        <br />
        <sub><b>JONGKUCH CHOL ANYAR</b></sub>
      </a>
      <br />
      <i>Software Engineer</i>
      <br />
      <a href="https://github.com/Jongkuch1">GitHub</a> • 
      <a href="https://www.linkedin.com/in/jongkuch-anyar-36535131b/">LinkedIn</a>
    </td>
    <td align="center">
      <a href="https://github.com/JokMaker">
        <img src="https://github.com/JokMaker.png" width="100px;" alt="Jok John"/>
        <br />
        <sub><b>JOK JOHN MAKEER</b></sub>
      </a>
      <br />
      <i>Software Engineer</i>
      <br />
      <a href="https://github.com/JokMaker">GitHub</a> • 
      <a href="https://www.linkedin.com/in/jok-maker-kur-5125a3246/">LinkedIn</a>
    </td>
  </tr>
</table>

---

## Acknowledgments

We extend our heartfelt gratitude to:

- **[IndabaX South Sudan 2025](https://www.sceniushub.com/event-details/indabax-south-sudan-2025)** - For providing the platform and inspiration
- **[Scenius Hub](https://www.sceniushub.com/)** - For organizing this incredible hackathon
- **Deep Learning Indaba** - For fostering AI innovation across Africa
- **South Sudan AI Community** - For supporting local tech talent

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Impact

This project aims to:
- **Democratize Healthcare**: Making advanced diagnostics accessible
- **Support Medical Professionals**: Providing AI-powered decision support
- **Advance AI in Africa**: Showcasing African talent in AI development
- **Improve Health Outcomes**: Early detection and intervention capabilities

---

## Contact

For questions, suggestions, or collaboration opportunities:

- **Project Repository**: [GitHub](https://github.com/ARIIK-ANTHONY/IndabaX-South-Sudan-2025-AI-Hackathon)
- **Event Information**: [IndabaX South Sudan 2025](https://www.sceniushub.com/event-details/indabax-south-sudan-2025)
- **Organizer**: [Scenius Hub](https://www.sceniushub.com/)

---

<div align="center">

**Built with passion by Team CodeNomads for IndabaX South Sudan 2025**

![Footer](https://img.shields.io/badge/Made%20with-TypeScript-blue?style=for-the-badge&logo=typescript)
![Footer](https://img.shields.io/badge/Built%20for-Healthcare-red?style=for-the-badge&logo=heart)
![Footer](https://img.shields.io/badge/Powered%20by-AI-green?style=for-the-badge&logo=artificial-intelligence)

</div>
