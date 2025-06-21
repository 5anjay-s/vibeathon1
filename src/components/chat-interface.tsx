'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAdviceAction } from '@/app/actions';
import ChatMessage from './chat-message';
import ChatInput from './chat-input';
import { Input } from './ui/input';
import { KeyRound } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Start with a welcome message from the assistant
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm Globetrotter AI. Enter your Gemini API key below and ask me anything about your travel plans.",
      },
    ]);
  }, []);

  const handleSend = async (query: string) => {
    if (!query.trim() || isLoading) return;

    if (!apiKey.trim()) {
      toast({
        variant: 'destructive',
        title: 'API Key Required',
        description: 'Please enter your Gemini API Key to continue.',
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const result = await getAdviceAction(query, apiKey);

    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      // remove the user's message if the call fails
      setMessages((prev) => prev.slice(0, prev.length - 1));
    } else if (result.advice) {
      const assistantMessage: Message = { role: 'assistant', content: result.advice };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <ChatMessage role="assistant" content="" isLoading />}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-card border-t">
        <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key here"
              className="flex-1"
            />
        </div>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
