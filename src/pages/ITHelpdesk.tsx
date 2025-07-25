import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Headphones, Laptop, Wifi, Shield, AlertTriangle, CheckCircle, Clock, Users, Calendar, History, TrendingUp, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import TicketEscalation from '@/components/TicketEscalation';
import TicketAssignment from '@/components/TicketAssignment';
import AssetLifecycle from '@/components/AssetLifecycle';
import AssetHistory from '@/components/AssetHistory';
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

  const assets = [
    { 
      id: 'LAP-001', 
      type: 'Laptop', 
      model: 'MacBook Pro 16"', 
      user: 'John Doe', 
      status: 'assigned', 
      location: 'Office',
      purchaseDate: '2023-01-15',
      warrantyExpiry: '2026-01-15',
      lastMaintenance: '2024-06-01',
      depreciationValue: '$2,400',
      condition: 'Excellent'
    },
    { 
      id: 'MON-001', 
      type: 'Monitor', 
      model: 'Dell UltraSharp 27"', 
      user: 'Sarah Johnson', 
      status: 'assigned', 
      location: 'Office',
      purchaseDate: '2023-03-20',
      warrantyExpiry: '2026-03-20',
      lastMaintenance: '2024-03-15',
      depreciationValue: '$320',
      condition: 'Good'
    },
    { 
      id: 'PRT-001', 
      type: 'Printer', 
      model: 'HP LaserJet Pro', 
      user: 'Shared', 
      status: 'active', 
      location: 'Floor 2',
      purchaseDate: '2022-08-10',
      warrantyExpiry: '2025-08-10',
      lastMaintenance: '2024-01-05',
      depreciationValue: '$180',
      condition: 'Fair'
    },
    { 
      id: 'PHN-001', 
      type: 'Phone', 
      model: 'iPhone 13', 
      user: 'Mike Chen', 
      status: 'assigned', 
      location: 'Remote',
      purchaseDate: '2023-09-15',
      warrantyExpiry: '2024-09-15',
      lastMaintenance: 'N/A',
      depreciationValue: '$450',
      condition: 'Good'
    },
  ];

  // Calculate dynamic stats
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

  // Filter tickets for employees to only their own
  const filteredTickets = tickets.filter(ticket => {
    if (userRole === 'employee') {
      const fullName = `${profile.firstName} ${profile.lastName}`;
      return ticket.user === fullName;
    }
    if (selectedAgent !== 'all' && ticket.assignedTo !== selectedAgent) return false;
    if (selectedTeam !== 'all' && ticket.team !== selectedTeam) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">IT Helpdesk</h1>
        <p className="text-muted-foreground">Manage support tickets, assets, and IT infrastructure with advanced tracking.</p>
      </div>

      {/* Stats Overview */}
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

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="flex w-full">
          <TabsTrigger className="flex-1" value="tickets">Support Tickets</TabsTrigger>
          {userRole !== 'employee' && <TabsTrigger className="flex-1" value="escalation">SLA & Escalation</TabsTrigger>}
          {userRole !== 'employee' && <TabsTrigger className="flex-1" value="assignment">Team Assignment</TabsTrigger>}
          {userRole !== 'employee' && <TabsTrigger className="flex-1" value="assets">Asset Management</TabsTrigger>}
          {userRole !== 'employee' && <TabsTrigger className="flex-1" value="lifecycle">Asset Lifecycle</TabsTrigger>}
          <TabsTrigger className="flex-1" value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
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
                        {userRole !== 'employee' && (
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
        </TabsContent>

        <TabsContent value="escalation">
          {userRole !== 'employee' && <TicketEscalation tickets={tickets} />}
        </TabsContent>

        <TabsContent value="assignment">
          {userRole !== 'employee' && <TicketAssignment tickets={tickets} agents={agents} teams={teams} />}
        </TabsContent>

        <TabsContent value="assets">
          {userRole !== 'employee' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Laptop className="w-5 h-5" />
                  <span>IT Assets</span>
                </CardTitle>
                <Button>Add Asset</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Laptop className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{asset.model}</h4>
                            <p className="text-sm text-muted-foreground">{asset.type} • {asset.id}</p>
                            <p className="text-xs text-muted-foreground opacity-70">Assigned to: {asset.user} • {asset.location}</p>
                            <p className="text-xs text-muted-foreground opacity-70">Condition: {asset.condition} • Value: {asset.depreciationValue}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={asset.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-muted text-muted-foreground'}>
                          {asset.status}
                        </Badge>
                        <Button className="h-9 px-3 border border-border bg-background hover:bg-accent/50 text-foreground">View History</Button>
                        <Button className="h-9 px-3 border border-border bg-background hover:bg-accent/50 text-foreground">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lifecycle">
          {userRole !== 'employee' && <AssetLifecycle assets={assets} />}
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Knowledge Base</span>
              </CardTitle>
              {userRole !== 'employee' && <Button>Add Article</Button>}
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-muted-foreground opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">IT Knowledge Base</h3>
                <p className="text-muted-foreground mb-4">Common solutions, troubleshooting guides, and IT policies.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button className="border border-border bg-background hover:bg-accent/50 text-foreground">Setup Guides</Button>
                  <Button className="border border-border bg-background hover:bg-accent/50 text-foreground">Troubleshooting</Button>
                  <Button className="border border-border bg-background hover:bg-accent/50 text-foreground">Security Policies</Button>
                  <Button className="border border-border bg-background hover:bg-accent/50 text-foreground">Software Manuals</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

export default ITHelpdesk;
