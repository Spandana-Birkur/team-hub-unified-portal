import React, { useState } from 'react';
import { Bell, Check, Trash2, Filter, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { useNotifications, Notification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const recentNotifications = notifications.slice(0, 5);
  const filteredNotifications = recentNotifications.filter(
    notification =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications found
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${!notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : ''}`}>
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium flex items-center ${!notification.read ? 'font-semibold' : ''}`}> 
                            {!notification.read && <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2" />}
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && (
                    <Separator className="mx-3" />
                  )}
                </div>
              ))
            )}
          </div>
          {notifications.length > 5 && (
            <>
              <Separator />
              <div className="p-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/notifications')}
                >
                  View All Notifications
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown; 