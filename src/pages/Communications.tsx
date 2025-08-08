import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/TicketColumns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CommunicationsPage = () => {
  const { toast } = useToast();
  const [isCreateTicketOpen, setCreateTicketOpen] = useState(false);
  const [ticketDescription, setTicketDescription] = useState('');

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['employee-tickets'],
    queryFn: async () => {
      // Replace with your actual API endpoint
      const response = await fetch(`${apiBaseUrl}/api/tickets/employee`);
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      return response.json();
    },
  });

  const handleCreateTicket = async () => {
    if (!ticketDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Ticket description cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Replace with your actual API endpoint for creating tickets
      const response = await fetch(`${apiBaseUrl}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: ticketDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      toast({
        title: 'Success',
        description: 'Your ticket has been created.',
      });
      setCreateTicketOpen(false);
      setTicketDescription('');
      // Optionally, refetch tickets
      // queryClient.invalidateQueries('employee-tickets');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not create ticket. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching tickets.</div>;

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>My Support Tickets</CardTitle>
          <Button onClick={() => setCreateTicketOpen(true)}>Create New Ticket</Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tickets || []} />
        </CardContent>
      </Card>

      <Dialog open={isCreateTicketOpen} onOpenChange={setCreateTicketOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="ticket-description">Description</Label>
            <Textarea
              id="ticket-description"
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setCreateTicketOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>Submit Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationsPage;
