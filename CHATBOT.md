# CodeNomads AI Chatbot

CodeNomads is an AI chatbot integrated into the Artist Booking application that can answer questions about programming, development, and related topics.

## Features

- Real-time chat interface
- Knowledge base of programming topics
- Session-based conversations
- Responsive design that works on mobile and desktop

## Implementation Details

### Frontend

The chatbot is implemented as a React component that can be included in any page of the application. It provides a floating chat interface that users can open and close as needed.

Key files:
- `client/src/components/chatbot.tsx`: The main chatbot UI component

### Backend

The backend provides API endpoints for creating chat sessions and sending/receiving messages.

Key files:
- `server/chatbot.ts`: Core chatbot logic and knowledge base
- `server/routes.ts`: API endpoints for the chatbot

## API Endpoints

- `POST /api/chatbot/session`: Create a new chat session
- `GET /api/chatbot/session/:sessionId`: Get an existing chat session
- `POST /api/chatbot/message`: Send a message and get a response

## Knowledge Base

The chatbot has knowledge about:
- Programming languages (JavaScript, Python, etc.)
- Web development frameworks (React, Node.js, etc.)
- Databases and APIs
- General programming concepts

## Extending the Chatbot

To extend the chatbot's knowledge:

1. Open `server/chatbot.ts`
2. Add new entries to the `knowledgeBase` array with relevant keywords and responses

Example:
```typescript
{
  keywords: ['typescript', 'ts'],
  responses: [
    'TypeScript is a strongly typed programming language that builds on JavaScript.',
    'TypeScript adds static type definitions to JavaScript, helping to catch errors early.',
    'TypeScript is developed and maintained by Microsoft.'
  ]
}
```

## Future Improvements

- Integration with a more advanced AI model
- User feedback mechanism for responses
- Ability to remember context from previous messages
- Support for code snippets and formatting