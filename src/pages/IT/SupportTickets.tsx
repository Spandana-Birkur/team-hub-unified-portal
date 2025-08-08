import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Headphones, CheckCircle2 } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

// Define the Ticket type based on the backend model
interface Ticket {
  ticketId: number;
  employeeId: number;  // Changed to number to match DB schema
  title: string;
  body: string;
  createdDate: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
}

const SupportTickets = () => {
  const { userRole, isLoggedIn } = useRole();
  const { profile } = useUserProfile();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in or no profile
  useEffect(() => {
    if (!isLoggedIn || !profile?.ID) {
      window.location.href = '/login';
      return;
    }
  }, [isLoggedIn, profile]);
  
  // State for dialogs
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);

  // State for the ticket currently being interacted with
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // State for forms
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
  });

  const ticketCategories = ['Hardware', 'Software', 'Network', 'Email', 'Other'];

  // Fetch tickets from the API on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tickets');
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch tickets');
          } else {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
          }
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server didn't return JSON");
        }
        const data = await response.json();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tickets');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

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
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

    const handleCreateTicket = async (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent form submission from redirecting
      
      if (!isLoggedIn || !profile?.ID) {
        setError('You must be logged in to create a ticket');
        return;
      }

      if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.category) {
        setError('Please fill in all required fields');
        return;
      }

      setIsLoading(true);
      setError(null);

    const ticketData = {
      employeeId: profile.ID,  // Keep as number
      title: newTicket.title,
      body: newTicket.description,
      createdDate: new Date().toISOString().slice(0, 10),
      priority: newTicket.priority,
      category: newTicket.category,
      status: 'open'
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to create ticket');
      }

      // Reset form and close dialog before fetching new data
      setNewTicket({ title: '', description: '', priority: 'medium', category: '' });
      setCreateDialogOpen(false);
      
      // Fetch fresh tickets to ensure we have the latest data
      const ticketsResponse = await fetch('/api/tickets');
      if (!ticketsResponse.ok) {
        throw new Error('Failed to fetch updated tickets');
      }
      const ticketsData = await ticketsResponse.json();
      setTickets(ticketsData.tickets || []);
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError(error instanceof Error ? error.message : 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResolveTicket = async (ticket: Ticket) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tickets/update/${ticket.ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to resolve ticket');
      }

      // Fetch fresh tickets to ensure we have the latest data
      const ticketsResponse = await fetch('http://127.0.0.1:8000/api/tickets');
      if (!ticketsResponse.ok) {
        throw new Error('Failed to fetch updated tickets');
      }
      const ticketsData = await ticketsResponse.json();
      setTickets(ticketsData.tickets || []);
    } catch (error) {
      console.error('Error resolving ticket:', error);
      setError(error instanceof Error ? error.message : 'Failed to resolve ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const openViewDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setViewDialogOpen(true);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (userRole === 'employee' || userRole === 'hr') {
      return ticket.employeeId === profile.ID;
    }
    return true;
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Headphones className="w-5 h-5" />
            <span>Support Tickets</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            {isLoggedIn && profile?.ID && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={() => setCreateDialogOpen(true)}
                disabled={isLoading}
              >
                Create Ticket
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center text-red-600 p-4">
              {error}
            </div>
          ) : isLoading ? (
            <div className="text-center p-4">
              Loading tickets...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <p className="text-center text-muted-foreground">No support tickets found.</p>
              ) : (
                filteredTickets.map((ticket) => (
                  <div key={ticket.ticketId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-foreground">{ticket.title}</h4>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{ticket.body}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground opacity-70">
                          <span>Category: {ticket.category}</span>
                          <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                          <span>Ticket ID: {ticket.ticketId}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="h-9 px-3"
                          onClick={() => openViewDialog(ticket)}
                          disabled={isLoading}
                        >
                          View
                        </Button>
                        {userRole !== 'employee' && userRole !== 'hr' && ticket.status !== 'resolved' && (
                          <Button 
                            onClick={() => handleResolveTicket(ticket)}
                            className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white"
                            disabled={isLoading}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new support ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newTicket.title}
                onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                placeholder="e.g., Cannot connect to printer"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTicket.description}
                onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Priority</label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newTicket.category} 
                  onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateTicket}
              disabled={isLoading || !newTicket.title.trim() || !newTicket.description.trim() || !newTicket.category}
            >
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-lg text-foreground">{selectedTicket.title}</h4>
                <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedTicket.body}</p>
              <div className="text-sm text-muted-foreground pt-2 border-t">
                  <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
                  <p><strong>Category:</strong> {selectedTicket.category}</p>
                  <p><strong>Created Date:</strong> {new Date(selectedTicket.createdDate).toLocaleDateString()}</p>
                  <p><strong>Submitted by Employee ID:</strong> {selectedTicket.employeeId}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTickets;
