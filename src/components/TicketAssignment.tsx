
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, User, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

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

const TicketAssignment: React.FC<TicketAssignmentProps> = ({ tickets: initialTickets, agents, teams }) => {
  const [selectedView, setSelectedView] = useState('agents');
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [reassignmentModalOpen, setReassignmentModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newAssignee, setNewAssignee] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [reassignmentReason, setReassignmentReason] = useState('');
  const [reassignmentType, setReassignmentType] = useState<'agent' | 'team'>('agent');

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

  const handleReassign = (ticket: Ticket, type: 'agent' | 'team') => {
    setSelectedTicket(ticket);
    setReassignmentType(type);
    setNewAssignee(type === 'agent' ? ticket.assignedTo : '');
    setNewTeam(type === 'team' ? ticket.team : '');
    setReassignmentReason('');
    setReassignmentModalOpen(true);
  };

  const handleSubmitReassignment = () => {
    if (selectedTicket && reassignmentReason) {
      const updatedTicket = {
        ...selectedTicket,
        ...(reassignmentType === 'agent' && { assignedTo: newAssignee }),
        ...(reassignmentType === 'team' && { team: newTeam })
      };

      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));

      // Log the reassignment for audit purposes
      console.log('Ticket reassigned:', {
        ticketId: selectedTicket.id,
        type: reassignmentType,
        from: reassignmentType === 'agent' ? selectedTicket.assignedTo : selectedTicket.team,
        to: reassignmentType === 'agent' ? newAssignee : newTeam,
        reason: reassignmentReason,
        timestamp: new Date().toISOString()
      });

      setReassignmentModalOpen(false);
      setSelectedTicket(null);
      setNewAssignee('');
      setNewTeam('');
      setReassignmentReason('');
    }
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

  const getWorkloadStatus = (workload: { open: number; inProgress: number; resolved: number; total: number }) => {
    const activeTickets = workload.open + workload.inProgress;
    if (activeTickets >= 10) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Overloaded' };
    if (activeTickets >= 7) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'High' };
    if (activeTickets >= 4) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Medium' };
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'Low' };
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
                  const workloadStatus = getWorkloadStatus(stats);
                  return (
                    <div key={agent} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-semibold text-foreground">{agent}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${workloadStatus.bg} ${workloadStatus.color}`}>
                            {workloadStatus.label}
                          </Badge>
                          <Badge variant="outline">
                            {stats.total} tickets
                          </Badge>
                        </div>
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
                      <h5 className="font-medium text-foreground">{ticket.title}</h5>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Assigned to: {ticket.assignedTo}</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Team: {ticket.team}</span>
                      <span>ID: {ticket.id}</span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReassign(ticket, 'agent')}
                      >
                        <User className="w-3 h-3 mr-1" />
                        Reassign Agent
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReassign(ticket, 'team')}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Reassign Team
                      </Button>
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
                  const workloadStatus = getWorkloadStatus(stats);
                  return (
                    <div key={team} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-semibold text-foreground">{team}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${workloadStatus.bg} ${workloadStatus.color}`}>
                            {workloadStatus.label}
                          </Badge>
                          <Badge variant="outline">
                            {stats.total} tickets
                          </Badge>
                        </div>
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
                      <h5 className="font-medium text-foreground">{ticket.title}</h5>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Team: {ticket.team}</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Assigned to: {ticket.assignedTo}</span>
                      <span>ID: {ticket.id}</span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReassign(ticket, 'team')}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Reassign Team
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReassign(ticket, 'agent')}
                      >
                        <User className="w-3 h-3 mr-1" />
                        Reassign Agent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reassignment Modal */}
      <Dialog open={reassignmentModalOpen} onOpenChange={setReassignmentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Reassign Ticket</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTicket && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">Ticket: {selectedTicket.id}</p>
                <p className="text-sm text-gray-600">{selectedTicket.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Current: {reassignmentType === 'agent' ? selectedTicket.assignedTo : selectedTicket.team}
                </p>
              </div>
            )}
            
            <div>
              <Label htmlFor="new-assignee">
                New {reassignmentType === 'agent' ? 'Agent' : 'Team'}
              </Label>
              <Select 
                value={reassignmentType === 'agent' ? newAssignee : newTeam} 
                onValueChange={(value) => {
                  if (reassignmentType === 'agent') {
                    setNewAssignee(value);
                  } else {
                    setNewTeam(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select new ${reassignmentType}`} />
                </SelectTrigger>
                <SelectContent>
                  {reassignmentType === 'agent' 
                    ? agents.map(agent => (
                        <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                      ))
                    : teams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reassignment-reason">Reason for Reassignment</Label>
              <Textarea 
                id="reassignment-reason"
                rows={3}
                placeholder="Explain why this ticket needs to be reassigned..."
                value={reassignmentReason}
                onChange={(e) => setReassignmentReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setReassignmentModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReassignment} 
                disabled={!reassignmentReason || (reassignmentType === 'agent' ? !newAssignee : !newTeam)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Reassign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketAssignment;
