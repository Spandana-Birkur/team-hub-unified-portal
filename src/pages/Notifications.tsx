import React, { useState } from 'react';
import { Bell, Search, Filter, Trash2, Check, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { useNotifications, Notification } from '../contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteMultipleNotifications,
    clearAllNotifications,
    filterNotifications 
  } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    category: '',
    read: undefined as boolean | undefined
  });

  const filteredNotifications = filterNotifications(filters).filter(
    notification =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, id]);
    } else {
      setSelectedNotifications(prev => prev.filter(n => n !== id));
    }
  };

  const handleBulkAction = (action: 'mark-read' | 'delete') => {
    if (action === 'mark-read') {
      selectedNotifications.forEach(id => markAsRead(id));
    } else if (action === 'delete') {
      deleteMultipleNotifications(selectedNotifications);
    }
    setSelectedNotifications([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Badge variant="secondary">{notifications.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={notifications.every(n => n.read)}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="it">IT</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={filters.read?.toString() || ''} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, read: value === '' ? undefined : value === 'true' }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="false">Unread</SelectItem>
                <SelectItem value="true">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedNotifications.length} notification(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('mark-read')}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                    />
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm font-medium flex items-center ${!notification.read ? 'font-semibold' : ''}`}>
                              {!notification.read && <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2" />}
                              {notification.title}
                            </p>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                            {notification.actionUrl && (
                              <span className="text-blue-600 hover:underline cursor-pointer">
                                View Details
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => markAsRead(notification.id)}
                            disabled={notification.read}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;