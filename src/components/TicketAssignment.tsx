
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, User, BarChart3, Clock, CheckCircle } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  user: string;
  priority: string;
  status: string;
  category: string;
  created: string;
  slaDeadline: string;
  assignedTo: string;
  team: string;
  escalated: boolean;
  description: string;
}

interface TicketAssignmentProps {
  tickets: Ticket[];
  agents: string[];
  teams: string[];
}

const TicketAssignment: React.FC<TicketAssignmentProps> = ({ tickets, agents, teams }) => {
  const [selectedView, setSelectedView] = useState('agents');

  const getAgentWorkload = () => {
    const workload: { [key: string]: { open: number; inProgress: number; resolved: number; total: number } } = {};
    
    agents.forEach(agent => {
      workload[agent] = { open: 0, inProgress: 0, resolved: 0, total: 0 };
    });

    tickets.forEach(ticket => {
      if (workload[ticket.assignedTo]) {
        workload[ticket.assignedTo].total++;
        if (ticket.status === 'open') workload[ticket.assignedTo].open++;
        else if (ticket.status === 'in-progress') workload[ticket.assignedTo].inProgress++;
        else if (ticket.status === 'resolved') workload[ticket.assignedTo].resolved++;
      }
    });

    return workload;
  };

  const getTeamWorkload = () => {
    const workload: { [key: string]: { open: number; inProgress: number; resolved: number; total: number } } = {};
    
    teams.forEach(team => {
      workload[team] = { open: 0, inProgress: 0, resolved: 0, total: 0 };
    });

    tickets.forEach(ticket => {
      if (workload[ticket.team]) {
        workload[ticket.team].total++;
        if (ticket.status === 'open') workload[ticket.team].open++;
        else if (ticket.status === 'in-progress') workload[ticket.team].inProgress++;
        else if (ticket.status === 'resolved') workload[ticket.team].resolved++;
      }
    });

    return workload;
  };

  const agentWorkload = getAgentWorkload();
  const teamWorkload = getTeamWorkload();

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

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Team & Agent Management</span>
            </CardTitle>
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agents">By Agent</SelectItem>
                <SelectItem value="teams">By Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {selectedView === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Workload Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Agent Workload</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map(agent => {
                  const stats = agentWorkload[agent];
                  return (
                    <div key={agent} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <h4 className="font-semibold text-gray-900">{agent}</h4>
                        </div>
                        <Badge variant="outline">
                          {stats.total} tickets
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-red-500" />
                          <span>{stats.open} Open</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>{stats.inProgress} In Progress</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{stats.resolved} Resolved</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Agent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.filter(t => t.status !== 'resolved').map(ticket => (
                  <div key={ticket.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{ticket.title}</h5>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Assigned to: {ticket.assignedTo}</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Select defaultValue={ticket.assignedTo}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map(agent => (
                            <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">Reassign</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Workload Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Team Workload</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map(team => {
                  const stats = teamWorkload[team];
                  return (
                    <div key={team} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <h4 className="font-semibold text-gray-900">{team}</h4>
                        </div>
                        <Badge variant="outline">
                          {stats.total} tickets
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-red-500" />
                          <span>{stats.open} Open</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>{stats.inProgress} In Progress</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{stats.resolved} Resolved</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Team Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Team Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.filter(t => t.status !== 'resolved').map(ticket => (
                  <div key={ticket.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{ticket.title}</h5>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Team: {ticket.team}</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Select defaultValue={ticket.team}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map(team => (
                            <SelectItem key={team} value={team}>{team}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">Reassign</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TicketAssignment;
