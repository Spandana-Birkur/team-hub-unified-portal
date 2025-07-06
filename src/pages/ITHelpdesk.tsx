
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, Laptop, Wifi, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ITHelpdesk = () => {
  const tickets = [
    {
      id: 'TKT-001',
      title: 'Laptop Screen Flickering',
      user: 'Sarah Johnson',
      priority: 'high',
      status: 'open',
      category: 'Hardware',
      created: '2024-01-15',
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
      description: 'Need Adobe Creative Suite installed on my workstation.'
    },
    {
      id: 'TKT-004',
      title: 'Email Sync Problems',
      user: 'Tom Wilson',
      priority: 'medium',
      status: 'open',
      category: 'Email',
      created: '2024-01-12',
      description: 'Outlook is not syncing emails properly since the last update.'
    }
  ];

  const assets = [
    { id: 'LAP-001', type: 'Laptop', model: 'MacBook Pro 16"', user: 'John Doe', status: 'assigned', location: 'Office' },
    { id: 'MON-001', type: 'Monitor', model: 'Dell UltraSharp 27"', user: 'Sarah Johnson', status: 'assigned', location: 'Office' },
    { id: 'PRT-001', type: 'Printer', model: 'HP LaserJet Pro', user: 'Shared', status: 'active', location: 'Floor 2' },
    { id: 'PHN-001', type: 'Phone', model: 'iPhone 13', user: 'Mike Chen', status: 'assigned', location: 'Remote' },
  ];

  const helpdeskStats = [
    { title: 'Open Tickets', value: '12', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'In Progress', value: '8', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Resolved Today', value: '15', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Total Assets', value: '324', icon: Laptop, color: 'bg-blue-500' },
  ];

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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Helpdesk</h1>
        <p className="text-gray-600">Manage support tickets, assets, and IT infrastructure.</p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="assets">Asset Management</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Headphones className="w-5 h-5" />
                <span>Support Tickets</span>
              </CardTitle>
              <Button>Create Ticket</Button>
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
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>User: {ticket.user}</span>
                          <span>Category: {ticket.category}</span>
                          <span>Created: {ticket.created}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm">Update</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={asset.status === 'assigned' ? 'default' : 'secondary'}>
                        {asset.status}
                      </Badge>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                  <Button variant="outline">Setup Guides</Button>
                  <Button variant="outline">Troubleshooting</Button>
                  <Button variant="outline">Security Policies</Button>
                  <Button variant="outline">Software Manuals</Button>
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
