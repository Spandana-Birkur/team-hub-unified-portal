import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, AlertTriangle, TrendingUp, CheckCircle, Laptop } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

const ITHelpdesk = () => {
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const { userRole } = useRole();
  const { profile } = useUserProfile();

  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      title: 'Laptop Screen Flickering',
      user: 'Sarah Johnson',
      priority: 'high',
      status: 'open',
      category: 'Hardware',
      created: '2024-01-15',
      slaDeadline: '2024-01-16T14:00:00Z',
      assignedTo: 'John Smith',
      team: 'Hardware Support',
      escalated: false,
      description: 'My laptop screen has been flickering intermittently since this morning.',
      updatedAt: null
    },
    {
      id: 'TKT-002',
      title: 'WiFi Connection Issues',
      user: 'Mike Chen',
      priority: 'medium',
      status: 'in-progress',
      category: 'Network',
      created: '2024-01-14',
      slaDeadline: '2024-01-17T10:00:00Z',
      assignedTo: 'Jane Doe',
      team: 'Network Team',
      escalated: false,
      description: 'Cannot connect to the office WiFi network from conference room B.',
      updatedAt: null
    },
    {
      id: 'TKT-003',
      title: 'Software Installation Request',
      user: 'Emily Davis',
      priority: 'low',
      status: 'resolved',
      category: 'Software',
      created: '2024-01-13',
      slaDeadline: '2024-01-20T16:00:00Z',
      assignedTo: 'Bob Wilson',
      team: 'Software Support',
      escalated: false,
      description: 'Need Adobe Creative Suite installed on my workstation.',
      resolutionNotes: 'Adobe Creative Suite was successfully installed on the workstation.',
      updatedAt: '2024-01-21T10:00:00Z'
    },
    {
      id: 'TKT-004',
      title: 'Email Sync Problems',
      user: 'Tom Wilson',
      priority: 'medium',
      status: 'escalated',
      category: 'Email',
      created: '2024-01-12',
      slaDeadline: '2024-01-15T12:00:00Z',
      assignedTo: 'Alice Brown',
      team: 'Software Support',
      escalated: true,
      description: 'Outlook is not syncing emails properly since the last update.',
      resolutionNotes: 'Outlook sync issues were resolved by reinstalling the email client.',
      updatedAt: null
    }
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const resolvedTodayCount = tickets.filter(ticket => ticket.status === 'resolved' && ticket.updatedAt && ticket.updatedAt.slice(0, 10) === today).length;
  const openCount = tickets.filter(ticket => ticket.status === 'open').length;
  const escalatedCount = tickets.filter(ticket => ticket.status === 'escalated').length;

  const helpdeskStats = [
    { title: 'Open Tickets', value: openCount.toString(), icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Escalated', value: escalatedCount.toString(), icon: TrendingUp, color: 'bg-orange-500' },
    { title: 'Resolved Today', value: resolvedTodayCount.toString(), icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Total Assets', value: '324', icon: Laptop, color: 'bg-blue-500' },
  ];

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'bot', text: 'Hi! I’m your IT Helpdesk Assistant. How can I help you today?' }
  ]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('http://localhost:5000/api/analyze-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput, tickets }),
      });

      const data = await res.json();
      const botReply = data.response || 'I am still learning, please try again.';

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }

    setUserInput('');
  };

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">IT Helpdesk</h1>
        <p className="text-muted-foreground">Manage support tickets, assets, and IT infrastructure with advanced tracking.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {helpdeskStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Chatbot */}
      <div className="fixed bottom-5 right-5">
        {!chatOpen ? (
          <Button onClick={() => setChatOpen(true)} className="bg-blue-600 hover:bg-blue-700 rounded-full p-4">
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        ) : (
          <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col">
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
              <h2 className="font-semibold">AI Chatbot</h2>
              <button onClick={() => setChatOpen(false)} className="text-white">✖</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`p-2 rounded-lg max-w-[75%] ${msg.sender === 'bot' ? 'bg-gray-200 self-start' : 'bg-blue-500 text-white self-end ml-auto'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border rounded p-2 text-sm"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white">Send</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ITHelpdesk;
