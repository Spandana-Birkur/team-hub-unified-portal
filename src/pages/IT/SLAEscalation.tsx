import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import TicketEscalation from '@/components/TicketEscalation';

const SLAEscalation = () => {
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
  ];

  const slaStats = [
    { title: 'SLA Violations', value: '3', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Escalated Tickets', value: '1', icon: TrendingUp, color: 'bg-orange-500' },
    { title: 'Near SLA Deadline', value: '2', icon: Clock, color: 'bg-yellow-500' },
    { title: 'SLA Compliant', value: '89%', icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">SLA & Escalation Management</h1>
        <p className="text-muted-foreground">Monitor service level agreements and manage ticket escalations.</p>
      </div>

      {/* SLA Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {slaStats.map((stat, index) => (
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

      {/* SLA Escalation Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>SLA & Escalation Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TicketEscalation tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAEscalation;
