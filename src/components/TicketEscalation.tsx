
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, TrendingUp, Bell } from 'lucide-react';

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

interface TicketEscalationProps {
  tickets: Ticket[];
}

const TicketEscalation: React.FC<TicketEscalationProps> = ({ tickets }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getSLAProgress = (createdDate: string, deadline: string) => {
    const created = new Date(createdDate);
    const slaDeadline = new Date(deadline);
    const now = currentTime;
    
    const totalTime = slaDeadline.getTime() - created.getTime();
    const elapsedTime = now.getTime() - created.getTime();
    
    return Math.min(100, (elapsedTime / totalTime) * 100);
  };

  const getTimeRemaining = (deadline: string) => {
    const slaDeadline = new Date(deadline);
    const now = currentTime;
    const remaining = slaDeadline.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Overdue';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getSLAStatus = (progress: number, timeRemaining: string) => {
    if (timeRemaining === 'Overdue') return { color: 'text-red-600', bg: 'bg-red-100', label: 'Overdue' };
    if (progress >= 80) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' };
    if (progress >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Warning' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'On Track' };
  };

  const activeTickets = tickets.filter(ticket => ticket.status !== 'resolved');
  const escalatedTickets = tickets.filter(ticket => ticket.escalated);
  const overdueTickets = activeTickets.filter(ticket => getTimeRemaining(ticket.slaDeadline) === 'Overdue');

  return (
    <div className="space-y-6">
      {/* SLA Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Escalated Tickets</p>
                <p className="text-2xl font-bold text-orange-600">{escalatedTickets.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Tickets</p>
                <p className="text-2xl font-bold text-red-600">{overdueTickets.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SLA Compliance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(((activeTickets.length - overdueTickets.length) / activeTickets.length) * 100)}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>SLA Tracking & Escalation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTickets.map((ticket) => {
              const progress = getSLAProgress(ticket.created, ticket.slaDeadline);
              const timeRemaining = getTimeRemaining(ticket.slaDeadline);
              const slaStatus = getSLAStatus(progress, timeRemaining);

              return (
                <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-foreground">{ticket.title}</h4>
                      <Badge variant="outline">{ticket.id}</Badge>
                      {ticket.escalated && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Escalated
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${slaStatus.bg} ${slaStatus.color}`}>
                        {slaStatus.label}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground">
                        {timeRemaining}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>SLA Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-2 ${
                        progress >= 80 ? 'bg-red-100' : 
                        progress >= 60 ? 'bg-yellow-100' : 'bg-green-100'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground opacity-70">
                    <div className="flex items-center space-x-4">
                      <span>Priority: {ticket.priority}</span>
                      <span>Assigned: {ticket.assignedTo}</span>
                      <span>Team: {ticket.team}</span>
                    </div>
                    <div className="flex space-x-2">
                      {!ticket.escalated && progress >= 80 && (
                        <Button size="sm" variant="outline" className="text-orange-600 hover:text-orange-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Escalate
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Bell className="w-3 h-3 mr-1" />
                        Notify
                      </Button>
                      <Button size="sm">Update</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketEscalation;
