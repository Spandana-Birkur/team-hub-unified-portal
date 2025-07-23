
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Headphones, Plus, Clock, CheckCircle, AlertCircle, Search, HelpCircle, MessageCircle } from 'lucide-react';

const EmployeeITSupport = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      title: 'Laptop Screen Flickering',
      priority: 'high',
      status: 'in-progress',
      category: 'Hardware',
      created: '2024-01-15',
      lastUpdate: '2024-01-16',
      description: 'My laptop screen has been flickering intermittently since this morning.',
      resolution: null
    },
    {
      id: 'TKT-002',
      title: 'WiFi Connection Issues',
      priority: 'medium',
      status: 'open',
      category: 'Network',
      created: '2024-01-14',
      lastUpdate: '2024-01-14',
      description: 'Cannot connect to the office WiFi network from conference room B.',
      resolution: null
    },
    {
      id: 'TKT-003',
      title: 'Software Installation Request',
      priority: 'low',
      status: 'resolved',
      category: 'Software',
      created: '2024-01-13',
      lastUpdate: '2024-01-21',
      description: 'Need Adobe Creative Suite installed on my workstation.',
      resolution: 'Adobe Creative Suite was successfully installed on your workstation. Please restart your computer to complete the installation.'
    }
  ]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
  });

  const categories = ['Hardware', 'Software', 'Network', 'Email', 'Other'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const openTicketsCount = tickets.filter(t => t.status !== 'resolved').length;
  const resolvedTicketsCount = tickets.filter(t => t.status === 'resolved').length;

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page or contacting IT support."
    },
    {
      question: "My computer is running slowly, what should I do?",
      answer: "Try restarting your computer first. If the issue persists, check for Windows updates and run a disk cleanup."
    },
    {
      question: "How do I connect to the office WiFi?",
      answer: "Select 'CompanyWiFi' from available networks and enter your employee credentials."
    },
    {
      question: "I can't access a shared drive, what's wrong?",
      answer: "Check your network connection and ensure you have the correct permissions. Contact IT if the issue continues."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Support</h1>
        <p className="text-gray-600">Get help with technical issues and submit support requests.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-blue-600">{openTicketsCount}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedTicketsCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit New Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Headphones className="w-5 h-5" />
            <span>My Support Tickets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                      <Badge variant="outline">{ticket.id}</Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Category: {ticket.category}</span>
                      <span>Created: {ticket.created}</span>
                      <span>Last Update: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => { setSelectedTicket(ticket); setViewDialogOpen(true); }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                <p className="text-sm text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your technical issue and we'll help you resolve it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Issue Title</label>
              <input
                className="w-full border rounded px-3 py-2 mt-1"
                value={newTicket.title}
                onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="w-full mt-1"
                value={newTicket.description}
                onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Please provide detailed information about the issue..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High - Urgent</SelectItem>
                    <SelectItem value="medium">Medium - Normal</SelectItem>
                    <SelectItem value="low">Low - When Possible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.category) return;
                const newId = `TKT-${(tickets.length + 1).toString().padStart(3, '0')}`;
                setTickets([{
                  id: newId,
                  title: newTicket.title,
                  priority: newTicket.priority,
                  status: 'open',
                  category: newTicket.category,
                  created: new Date().toISOString().slice(0, 10),
                  lastUpdate: new Date().toISOString().slice(0, 10),
                  description: newTicket.description,
                  resolution: null
                }, ...tickets]);
                setNewTicket({ title: '', description: '', priority: 'medium', category: '' });
                setCreateDialogOpen(false);
              }}
              disabled={!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.category}
            >
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-semibold text-gray-900">{selectedTicket.title}</h4>
                <Badge variant="outline">{selectedTicket.id}</Badge>
                <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(selectedTicket.status)}
                    <span>{selectedTicket.status}</span>
                  </div>
                </Badge>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Description:</h5>
                <p className="text-sm text-gray-600">{selectedTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {selectedTicket.category}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {selectedTicket.created}
                </div>
                <div>
                  <span className="font-medium">Last Update:</span> {selectedTicket.lastUpdate}
                </div>
              </div>
              {selectedTicket.resolution && (
                <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">Resolution:</span>
                  </div>
                  <p className="text-sm text-green-700">{selectedTicket.resolution}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeITSupport;
