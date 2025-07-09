import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Headphones, Laptop, Wifi, Shield, AlertTriangle, CheckCircle, Clock, Users, Calendar, History, TrendingUp, User, AlertCircle } from 'lucide-react';
import TicketEscalation from '@/components/TicketEscalation';
import TicketAssignment from '@/components/TicketAssignment';
import AssetLifecycle from '@/components/AssetLifecycle';
import AssetHistory from '@/components/AssetHistory';

const ITHelpdesk = () => {
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const tickets = [
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
      description: 'My laptop screen has been flickering intermittently since this morning.'
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
      description: 'Cannot connect to the office WiFi network from conference room B.'
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
      description: 'Need Adobe Creative Suite installed on my workstation.'
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
      description: 'Outlook is not syncing emails properly since the last update.'
    }
  ];

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

  const helpdeskStats = [
    { title: 'Open Tickets', value: '12', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Escalated', value: '3', icon: TrendingUp, color: 'bg-orange-500' },
    { title: 'Resolved Today', value: '15', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Total Assets', value: '324', icon: Laptop, color: 'bg-blue-500' },
  ];

  const agents = ['John Smith', 'Jane Doe', 'Bob Wilson', 'Alice Brown'];
  const teams = ['Hardware Support', 'Network Team', 'Software Support'];

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

  const filteredTickets = tickets.filter(ticket => {
    if (selectedAgent !== 'all' && ticket.assignedTo !== selectedAgent) return false;
    if (selectedTeam !== 'all' && ticket.team !== selectedTeam) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Helpdesk</h1>
        <p className="text-gray-600">Manage support tickets, assets, and IT infrastructure with advanced tracking.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {helpdeskStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="escalation">SLA & Escalation</TabsTrigger>
          <TabsTrigger value="assignment">Team Assignment</TabsTrigger>
          <TabsTrigger value="assets">Asset Management</TabsTrigger>
          <TabsTrigger value="lifecycle">Asset Lifecycle</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
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
                <Button>Create Ticket</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                          <Badge className="border border-gray-300 bg-transparent text-gray-700">{ticket.id}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.escalated && <AlertCircle className="w-3 h-3 mr-1" />}
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>User: {ticket.user}</span>
                          <span>Category: {ticket.category}</span>
                          <span>Assigned to: {ticket.assignedTo}</span>
                          <span>Team: {ticket.team}</span>
                          <span>Created: {ticket.created}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="h-9 px-3">Update</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation">
          <TicketEscalation tickets={tickets} />
        </TabsContent>

        <TabsContent value="assignment">
          <TicketAssignment tickets={tickets} agents={agents} teams={teams} />
        </TabsContent>

        <TabsContent value="assets">
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
                          <h4 className="font-semibold text-gray-900">{asset.model}</h4>
                          <p className="text-sm text-gray-600">{asset.type} • {asset.id}</p>
                          <p className="text-xs text-gray-500">Assigned to: {asset.user} • {asset.location}</p>
                          <p className="text-xs text-gray-500">Condition: {asset.condition} • Value: {asset.depreciationValue}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={asset.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                        {asset.status}
                      </Badge>
                      <Button className="h-9 px-3 border border-gray-300 bg-transparent hover:bg-gray-50">View History</Button>
                      <Button className="h-9 px-3 border border-gray-300 bg-transparent hover:bg-gray-50">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle">
          <AssetLifecycle assets={assets} />
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Knowledge Base</span>
              </CardTitle>
              <Button>Add Article</Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">IT Knowledge Base</h3>
                <p className="text-gray-600 mb-4">Common solutions, troubleshooting guides, and IT policies.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button className="border border-gray-300 bg-transparent hover:bg-gray-50">Setup Guides</Button>
                  <Button className="border border-gray-300 bg-transparent hover:bg-gray-50">Troubleshooting</Button>
                  <Button className="border border-gray-300 bg-transparent hover:bg-gray-50">Security Policies</Button>
                  <Button className="border border-gray-300 bg-transparent hover:bg-gray-50">Software Manuals</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ITHelpdesk;
