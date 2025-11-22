import React, { useEffect, useRef, useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: PartsType[];
  timestamp?: string;
};

interface PartsType {
  type: string;
  text: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      parts: [{ type: 'text', text: input }],
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('API Error:', data.error);
        return;
      }

      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching assistant reply:', error);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [messages]);

  return {
    messageRef,
    isLoading,
    messages,
    handleSubmit,
    input,
    inputRef,
    setInput,
  };
};
