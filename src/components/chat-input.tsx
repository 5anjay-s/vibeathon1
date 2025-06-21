'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SendHorizonal } from 'lucide-react';

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
};

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about your next adventure..."
        disabled={isLoading}
        className="flex-1"
        autoFocus
      />
      <Button type="submit" disabled={isLoading || !message.trim()} size="icon">
        <SendHorizonal className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
