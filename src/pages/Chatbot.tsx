import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    // No AI response yet
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-2 border-b">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <CardTitle>AI Chatbot</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[700px] p-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-gray-400 text-sm mt-10">
                <MessageCircle className="w-10 h-10 mb-2" />
                <span>Start a conversation with the AI assistant.</span>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className="flex justify-end">
                <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 w-fit ml-auto mb-1">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form className="flex items-center border-t p-4 bg-gray-50" onSubmit={handleSend}>
            <Input
              className="flex-1 mr-2"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={input.trim() === ''}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot; 