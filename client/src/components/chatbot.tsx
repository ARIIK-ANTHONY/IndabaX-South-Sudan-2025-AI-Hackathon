import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useQuery, useMutation } from '@tanstack/react-query';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export function Chatbot() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Show welcome popup when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopup(true);
    }, 2000); // Show popup after 2 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide welcome popup after 5 seconds
  useEffect(() => {
    if (showWelcomePopup) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcomePopup]);
  
  // Create a new chat session when the chatbot is opened
  useEffect(() => {
    if (isOpen && !sessionId) {
      createNewSession();
    }
  }, [isOpen, sessionId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Create a new chat session
  const createNewSession = async () => {
    try {
      const response = await fetch('/api/chatbot/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }
      
      const data = await response.json();
      setSessionId(data.sessionId);
      setMessages(data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } catch (error) {
      console.error('Error creating chat session:', error);
      // Fallback to a default welcome message if API fails
      setMessages([
        {
          id: '1',
          text: 'Hi there! I\'m CodeNomads, your assistant for the Blood Disease Prediction platform. I can help with information about predictions, the dashboard, or how to use our system. What would you like to know?',
          sender: 'bot' as const,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Send a message to the chatbot
  const handleSendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    
    // Optimistically add user message to UI
    const tempUserMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: input,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Replace the optimistic user message with the actual one from the server
      setMessages((prev) => [
        ...prev.filter(msg => msg.id !== tempUserMessage.id),
        {
          ...data.userMessage,
          timestamp: new Date(data.userMessage.timestamp)
        },
        {
          ...data.botResponse,
          timestamp: new Date(data.botResponse.timestamp)
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add a fallback bot response if the API call fails
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I\'m having trouble connecting to the server. Please try again later.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Welcome Popup */}
      {showWelcomePopup && !isOpen && (
        <Card className="w-80 mb-4 p-4 shadow-xl animate-in slide-in-from-bottom-2 fade-in-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">CodeNomads Assistant</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowWelcomePopup(false)}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                👋 Welcome to our Blood Disease Prediction platform! I'm here to help you navigate through our AI-powered medical analysis system. 
              </p>
              <Button 
                size="sm" 
                onClick={() => {
                  setShowWelcomePopup(false);
                  setIsOpen(true);
                }}
                className="w-full"
              >
                Start Chat
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 h-96 flex flex-col shadow-xl">
          <div className="p-3 bg-primary text-primary-foreground flex justify-between items-center">
            <div className="font-semibold">CodeNomads</div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading || !sessionId}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !sessionId || !input.trim()}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                )}
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}