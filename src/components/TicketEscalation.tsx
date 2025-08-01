
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, TrendingUp, Bell, MessageSquare, CheckCircle } from 'lucide-react';

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
  resolutionNotes?: string;
  updatedAt?: string;
}

interface TicketEscalationProps {
  tickets: Ticket[];
}

const TicketEscalation: React.FC<TicketEscalationProps> = ({ tickets: initialTickets }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [escalationLevel, setEscalationLevel] = useState('level1');

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

  const handleEscalate = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEscalationModalOpen(true);
  };

  const handleSubmitEscalation = () => {
    if (selectedTicket && escalationReason) {
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              escalated: true, 
              status: 'escalated',
              updatedAt: new Date().toISOString()
            }
          : ticket
      ));
      setEscalationModalOpen(false);
      setEscalationReason('');
      setSelectedTicket(null);
      setEscalationLevel('level1');
    }
  };

  const handleNotify = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setNotificationMessage(`Urgent: Ticket ${ticket.id} requires immediate attention. SLA deadline: ${getTimeRemaining(ticket.slaDeadline)}`);
    setNotificationModalOpen(true);
  };

  const handleSubmitNotification = () => {
    if (selectedTicket && notificationMessage) {
      // In a real app, this would send the notification
      console.log('Notification sent:', {
        ticket: selectedTicket.id,
        message: notificationMessage,
        timestamp: new Date().toISOString()
      });
      setNotificationModalOpen(false);
      setNotificationMessage('');
      setSelectedTicket(null);
    }
  };

  const handleUpdate = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setUpdateNotes(ticket.resolutionNotes || '');
    setUpdateModalOpen(true);
  };

  const handleSubmitUpdate = () => {
    if (selectedTicket && updateNotes) {
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              resolutionNotes: updateNotes,
              updatedAt: new Date().toISOString()
            }
          : ticket
      ));
      setUpdateModalOpen(false);
      setUpdateNotes('');
      setSelectedTicket(null);
    }
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
                  {activeTickets.length > 0 ? Math.round(((activeTickets.length - overdueTickets.length) / activeTickets.length) * 100) : 100}%
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-orange-600 hover:text-orange-700"
                          onClick={() => handleEscalate(ticket)}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Escalate
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleNotify(ticket)}
                      >
                        <Bell className="w-3 h-3 mr-1" />
                        Notify
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUpdate(ticket)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  {ticket.resolutionNotes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Latest Update:</strong> {ticket.resolutionNotes}
                      </p>
                      {ticket.updatedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated: {new Date(ticket.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Modal */}
      <Dialog open={escalationModalOpen} onOpenChange={setEscalationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Escalate Ticket</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTicket && (
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium">Ticket: {selectedTicket.id}</p>
                <p className="text-sm text-gray-600">{selectedTicket.title}</p>
              </div>
            )}
            
            <div>
              <Label htmlFor="escalation-level">Escalation Level</Label>
              <Select value={escalationLevel} onValueChange={setEscalationLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level1">Level 1 - Team Lead</SelectItem>
                  <SelectItem value="level2">Level 2 - Manager</SelectItem>
                  <SelectItem value="level3">Level 3 - Director</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="escalation-reason">Reason for Escalation</Label>
              <Textarea 
                id="escalation-reason"
                rows={3}
                placeholder="Explain why this ticket needs to be escalated..."
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setEscalationModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitEscalation} 
                disabled={!escalationReason}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Escalate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Modal */}
      <Dialog open={notificationModalOpen} onOpenChange={setNotificationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Send Notification</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTicket && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">Ticket: {selectedTicket.id}</p>
                <p className="text-sm text-gray-600">{selectedTicket.title}</p>
              </div>
            )}
            
            <div>
              <Label htmlFor="notification-message">Notification Message</Label>
              <Textarea 
                id="notification-message"
                rows={4}
                placeholder="Enter notification message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setNotificationModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitNotification} 
                disabled={!notificationMessage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Bell className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Update Ticket</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTicket && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">Ticket: {selectedTicket.id}</p>
                <p className="text-sm text-gray-600">{selectedTicket.title}</p>
              </div>
            )}
            
            <div>
              <Label htmlFor="update-notes">Update Notes</Label>
              <Textarea 
                id="update-notes"
                rows={4}
                placeholder="Enter update notes..."
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitUpdate} 
                disabled={!updateNotes}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketEscalation;
