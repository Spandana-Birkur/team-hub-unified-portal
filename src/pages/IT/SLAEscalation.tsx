import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Clock, CheckCircle, Filter, RefreshCw, Settings } from 'lucide-react';
import TicketEscalation from '@/components/TicketEscalation';
import SLAConfiguration from '@/components/SLAConfiguration';
import SLAReporting from '@/components/SLAReporting';

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

const SLAEscalation = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [tickets, setTickets] = useState<Ticket[]>([
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
    },
    {
      id: 'TKT-005',
      title: 'Printer Not Working',
      user: 'Lisa Davis',
      priority: 'low',
      status: 'open',
      category: 'Hardware',
      created: '2024-01-16',
      slaDeadline: '2024-01-19T16:00:00Z',
      assignedTo: 'John Smith',
      team: 'Hardware Support',
      escalated: false,
      description: 'The office printer is showing error code E-04 and won\'t print.',
      updatedAt: null
    },
    {
      id: 'TKT-006',
      title: 'VPN Connection Failed',
      user: 'David Wilson',
      priority: 'high',
      status: 'in-progress',
      category: 'Network',
      created: '2024-01-15',
      slaDeadline: '2024-01-16T18:00:00Z',
      assignedTo: 'Jane Doe',
      team: 'Network Team',
      escalated: false,
      description: 'Unable to connect to VPN from home office. Getting authentication error.',
      updatedAt: null
    }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // In a real app, this would fetch updated data from the server
      console.log('Auto-refreshing SLA data...');
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLastRefresh(new Date());
    // In a real app, this would fetch updated data from the server
    console.log('Manual refresh triggered...');
  };

  const handleTicketUpdate = (updatedTickets: Ticket[]) => {
    setTickets(updatedTickets);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">SLA & Escalation Management</h1>
            <p className="text-muted-foreground">Monitor service level agreements and manage ticket escalations.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManualRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Auto-refresh {autoRefresh ? 'On' : 'Off'}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">SLA Monitoring</TabsTrigger>
          <TabsTrigger value="configuration">SLA Configuration</TabsTrigger>
          <TabsTrigger value="reporting">SLA Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <SLAConfiguration />
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <SLAReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SLAEscalation;
