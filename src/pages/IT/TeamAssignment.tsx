import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import TicketAssignment from '@/components/TicketAssignment';

const TeamAssignment = () => {
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
    }
  ];

  const agents = ['John Smith', 'Jane Doe', 'Bob Wilson', 'Alice Brown'];
  const teams = ['Hardware Support', 'Network Team', 'Software Support'];

  const assignmentStats = [
    { title: 'Total Agents', value: agents.length.toString(), icon: Users, color: 'bg-blue-500' },
    { title: 'Active Teams', value: teams.length.toString(), icon: UserCheck, color: 'bg-green-500' },
    { title: 'Unassigned Tickets', value: '2', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Workload Distribution', value: 'Balanced', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Team Assignment Management</h1>
        <p className="text-muted-foreground">Manage ticket assignments and team workload distribution.</p>
      </div>

      {/* Assignment Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {assignmentStats.map((stat, index) => (
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

      {/* Team Assignment Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Assignment Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TicketAssignment tickets={tickets} agents={agents} teams={teams} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAssignment;
