import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userInput = input;
    setMessages(prev => [...prev, { text: userInput, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      // Send prompt and history to backend
      const response = await fetch('http://localhost:8000/api/AIRequestHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userInput,
          history: history,
        }),
      });
      const data = await response.json();
      const aiText = data.response || 'No response from AI.';

      setMessages(prev => [
        ...prev,
        { text: aiText, sender: 'ai' },
      ]);
      // Update history for next turn
      setHistory(prev => [
        ...prev,
        { role: 'user', content: userInput },
        { role: 'assistant', content: aiText },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { text: 'Error: Could not get AI response.', sender: 'ai' },
      ]);
    } finally {
      setLoading(false);
    }
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
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 w-fit mb-1 max-w-xl break-words ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 text-blue-800 ml-auto'
                      : 'bg-gray-100 text-gray-800 mr-auto'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 rounded-lg px-4 py-2 w-fit mb-1 mr-auto">
                  AI is typing...
                </div>
              </div>
            )}
          </div>
          <form className="flex items-center border-t p-4 bg-gray-50" onSubmit={handleSend}>
            <Input
              className="flex-1 mr-2"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
              disabled={loading}
            />
            <Button type="submit" disabled={input.trim() === '' || loading}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;