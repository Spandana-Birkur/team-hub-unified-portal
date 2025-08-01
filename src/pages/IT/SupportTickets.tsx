import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Headphones, AlertTriangle, CheckCircle, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

const SupportTickets = () => {
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
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    assignedTo: '',
    team: '',
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewedTicket, setViewedTicket] = useState<any>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState<any>(null);
  const [updateFields, setUpdateFields] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    assignedTo: '',
    team: '',
  });

  const agents = ['John Smith', 'Jane Doe', 'Bob Wilson', 'Alice Brown'];
  const teams = ['Hardware Support', 'Network Team', 'Software Support'];
  const ticketCategories = ['Hardware', 'Software', 'Network', 'Email', 'Other'];

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

  const handleResolveTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setResolveDialogOpen(true);
  };

  const confirmResolveTicket = () => {
    if (selectedTicket) {
      const now = new Date().toISOString();
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === selectedTicket.id 
            ? { ...ticket, status: 'resolved', resolutionNotes, updatedAt: now }
            : ticket
        )
      );
      setResolveDialogOpen(false);
      setSelectedTicket(null);
      setResolutionNotes('');
    }
  };

  // Filter tickets for employees and HR to only their own
  const filteredTickets = tickets.filter(ticket => {
    if (userRole === 'employee' || userRole === 'hr') {
      const fullName = `${profile.firstName} ${profile.lastName}`;
      return ticket.user === fullName;
    }
    if (selectedAgent !== 'all' && ticket.assignedTo !== selectedAgent) return false;
    if (selectedTeam !== 'all' && ticket.team !== selectedTeam) return false;
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
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setCreateDialogOpen(true)}>
              Create Ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-foreground">{ticket.title}</h4>
                      <Badge className="border border-border bg-muted text-muted-foreground">{ticket.id}</Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.escalated && <AlertCircle className="w-3 h-3 mr-1" />}
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground opacity-70">
                      <span>User: {ticket.user}</span>
                      <span>Category: {ticket.category}</span>
                      <span>Assigned to: {ticket.assignedTo}</span>
                      <span>Team: {ticket.team}</span>
                      <span>Created: {ticket.created}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="w-auto h-9 px-3 border border-border bg-background text-foreground hover:bg-accent/50"
                      onClick={() => { setViewedTicket(ticket); setViewDialogOpen(true); }}
                    >
                      View
                    </Button>
                    {userRole !== 'employee' && userRole !== 'hr' && (
                      <>
                        <Button
                          className="h-9 px-3"
                          onClick={() => {
                            setTicketToUpdate(ticket);
                            setUpdateFields({
                              title: ticket.title,
                              description: ticket.description,
                              priority: ticket.priority,
                              category: ticket.category,
                              assignedTo: ticket.assignedTo,
                              team: ticket.team,
                            });
                            setUpdateDialogOpen(true);
                          }}
                        >
                          Update
                        </Button>
                        {ticket.status !== 'resolved' && (
                          <Button 
                            onClick={() => handleResolveTicket(ticket)}
                            className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resolve Ticket Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Please provide resolution notes for ticket: {selectedTicket?.id} - {selectedTicket?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Resolution Notes</label>
              <Textarea
                placeholder="Describe the solution provided..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-auto border border-border bg-background hover:bg-accent/50 text-foreground"
              onClick={() => setResolveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmResolveTicket} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Resolve Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Ticket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={newTicket.title}
                onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                placeholder="Ticket title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="w-full mt-1"
                value={newTicket.description}
                onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Describe the issue..."
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-sm font-medium">Priority</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={newTicket.priority}
                  onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={newTicket.category}
                  onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {ticketCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-sm font-medium">Assigned To</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={newTicket.assignedTo}
                  onChange={e => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Team</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={newTicket.team}
                  onChange={e => setNewTicket({ ...newTicket, team: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="border border-border bg-background hover:bg-accent/50 text-foreground" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (!newTicket.title.trim() || !newTicket.description.trim()) return;
                setTickets([
                  {
                    id: `TKT-${(tickets.length + 1).toString().padStart(3, '0')}`,
                    title: newTicket.title,
                    user: `${profile.firstName} ${profile.lastName}`,
                    priority: newTicket.priority,
                    status: 'open',
                    category: newTicket.category,
                    created: new Date().toISOString().slice(0, 10),
                    slaDeadline: '',
                    assignedTo: newTicket.assignedTo,
                    team: newTicket.team,
                    escalated: false,
                    description: newTicket.description,
                    updatedAt: null
                  },
                  ...tickets,
                ]);
                setNewTicket({ title: '', description: '', priority: 'medium', category: '', assignedTo: '', team: '' });
                setCreateDialogOpen(false);
              }}
              disabled={!newTicket.title.trim() || !newTicket.description.trim()}
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Ticket Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={updateFields.title}
                onChange={e => setUpdateFields({ ...updateFields, title: e.target.value })}
                placeholder="Ticket title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="w-full mt-1"
                value={updateFields.description}
                onChange={e => setUpdateFields({ ...updateFields, description: e.target.value })}
                placeholder="Describe the issue..."
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-sm font-medium">Priority</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={updateFields.priority}
                  onChange={e => setUpdateFields({ ...updateFields, priority: e.target.value })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={updateFields.category}
                  onChange={e => setUpdateFields({ ...updateFields, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {ticketCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-sm font-medium">Assigned To</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={updateFields.assignedTo}
                  onChange={e => setUpdateFields({ ...updateFields, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Team</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={updateFields.team}
                  onChange={e => setUpdateFields({ ...updateFields, team: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="border border-border bg-background hover:bg-accent/50 text-foreground" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (!updateFields.title.trim() || !updateFields.description.trim()) return;
                setTickets(tickets.map(t =>
                  t.id === ticketToUpdate.id
                    ? { ...t, ...updateFields }
                    : t
                ));
                setUpdateDialogOpen(false);
              }}
              disabled={!updateFields.title.trim() || !updateFields.description.trim()}
            >
              Update Ticket
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
          {viewedTicket && (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-semibold text-foreground">{viewedTicket.title}</h4>
                <Badge className="border border-border bg-muted text-muted-foreground">{viewedTicket.id}</Badge>
                <Badge className={getPriorityColor(viewedTicket.priority)}>{viewedTicket.priority}</Badge>
                <Badge className={getStatusColor(viewedTicket.status)}>{viewedTicket.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{viewedTicket.description}</div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground opacity-70 mb-2">
                <span>User: {viewedTicket.user}</span>
                <span>Category: {viewedTicket.category}</span>
                <span>Assigned to: {viewedTicket.assignedTo}</span>
                <span>Team: {viewedTicket.team}</span>
                <span>Created: {viewedTicket.created}</span>
              </div>
              {viewedTicket.resolutionNotes && (
                <div className="mt-2 p-3 bg-background border-l-4 border-green-500 rounded">
                  <div className="font-medium text-green-700 mb-1">Resolution Notes:</div>
                  <div className="text-foreground whitespace-pre-line">{viewedTicket.resolutionNotes}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button className="border border-border bg-background hover:bg-accent/50 text-foreground" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTickets;
