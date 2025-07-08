
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, User, Wrench, AlertTriangle, ArrowUpDown, Calendar } from 'lucide-react';

interface AssetHistoryProps {
  assetId?: string;
}

const AssetHistory: React.FC<AssetHistoryProps> = ({ assetId = 'LAP-001' }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const historyEntries = [
    {
      id: 1,
      date: '2024-01-15T10:30:00Z',
      type: 'assignment',
      action: 'Asset Assigned',
      description: 'Laptop assigned to John Doe',
      user: 'HR Admin',
      previousValue: 'Unassigned',
      newValue: 'John Doe',
      icon: User,
      color: 'text-blue-600'
    },
    {
      id: 2,
      date: '2024-01-10T14:15:00Z',
      type: 'maintenance',
      action: 'Maintenance Completed',
      description: 'Regular maintenance and cleaning performed',
      user: 'IT Technician',
      previousValue: 'Due',
      newValue: 'Completed',
      icon: Wrench,
      color: 'text-green-600'
    },
    {
      id: 3,
      date: '2024-01-05T09:00:00Z',
      type: 'issue',
      action: 'Issue Reported',
      description: 'Screen flickering issue reported and resolved',
      user: 'John Doe',
      relatedTicket: 'TKT-001',
      previousValue: 'Working',
      newValue: 'Issue Resolved',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      id: 4,
      date: '2023-12-20T16:45:00Z',
      type: 'transfer',
      action: 'Location Changed',
      description: 'Asset moved from Storage to Office',
      user: 'IT Admin',
      previousValue: 'Storage Room A',
      newValue: 'Office Floor 2',
      icon: ArrowUpDown,
      color: 'text-purple-600'
    },
    {
      id: 5,
      date: '2023-12-01T11:20:00Z',
      type: 'assignment',
      action: 'User Changed',
      description: 'Asset reassigned from Sarah Johnson to John Doe',
      user: 'HR Manager',
      previousValue: 'Sarah Johnson',
      newValue: 'John Doe',
      icon: User,
      color: 'text-blue-600'
    },
    {
      id: 6,
      date: '2023-11-15T13:30:00Z',
      type: 'maintenance',
      action: 'Hardware Upgrade',
      description: 'RAM upgraded from 16GB to 32GB',
      user: 'IT Technician',
      previousValue: '16GB RAM',
      newValue: '32GB RAM',
      icon: Wrench,
      color: 'text-green-600'
    },
    {
      id: 7,
      date: '2023-01-15T08:00:00Z',
      type: 'creation',
      action: 'Asset Created',
      description: 'New laptop asset added to inventory',
      user: 'IT Manager',
      previousValue: null,
      newValue: 'MacBook Pro 16" - LAP-001',
      icon: Calendar,
      color: 'text-gray-600'
    }
  ];

  const filteredHistory = historyEntries.filter(entry => {
    if (selectedFilter === 'all') return true;
    return entry.type === selectedFilter;
  });

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-green-100 text-green-800';
      case 'issue': return 'bg-yellow-100 text-yellow-800';
      case 'transfer': return 'bg-purple-100 text-purple-800';
      case 'creation': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const typeStats = {
    assignments: historyEntries.filter(e => e.type === 'assignment').length,
    maintenance: historyEntries.filter(e => e.type === 'maintenance').length,
    issues: historyEntries.filter(e => e.type === 'issue').length,
    transfers: historyEntries.filter(e => e.type === 'transfer').length,
  };

  return (
    <div className="space-y-6">
      {/* History Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-blue-600">{typeStats.assignments}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-green-600">{typeStats.maintenance}</p>
              </div>
              <Wrench className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-yellow-600">{typeStats.issues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transfers</p>
                <p className="text-2xl font-bold text-purple-600">{typeStats.transfers}</p>
              </div>
              <ArrowUpDown className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset History Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Asset History & Logs - {assetId}</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="issue">Issues</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">Export Log</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.map((entry, index) => {
              const Icon = entry.icon;
              return (
                <div key={entry.id} className="relative flex items-start space-x-4 pb-4">
                  {/* Timeline line */}
                  {index !== filteredHistory.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center ${entry.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{entry.action}</h4>
                        <Badge className={getActionTypeColor(entry.type)}>
                          {entry.type}
                        </Badge>
                        {entry.relatedTicket && (
                          <Badge variant="outline">
                            {entry.relatedTicket}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <span>By: {entry.user}</span>
                        {entry.previousValue && entry.newValue && (
                          <span className="ml-4">
                            Changed from "{entry.previousValue}" to "{entry.newValue}"
                          </span>
                        )}
                      </div>
                      
                      {entry.relatedTicket && (
                        <Button size="sm" variant="outline">
                          View Ticket
                        </Button>
                      )}
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

export default AssetHistory;
