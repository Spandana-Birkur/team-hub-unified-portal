import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'ticket' | 'training' | 'hr' | 'it';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteMultipleNotifications: (ids: string[]) => void;
  clearAllNotifications: () => void;
  filterNotifications: (filters: {
    type?: string;
    priority?: string;
    category?: string;
    read?: boolean;
  }) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Ticket Assigned',
      message: 'You have been assigned a new IT support ticket #TKT-2024-001',
      type: 'info',
      priority: 'medium',
      category: 'ticket',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionUrl: '/it-helpdesk'
    },
    {
      id: '2',
      title: 'Training Session Reminder',
      message: 'Your cybersecurity training session starts in 1 hour',
      type: 'warning',
      priority: 'high',
      category: 'training',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: '/training'
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin at 2:00 AM tonight',
      type: 'info',
      priority: 'low',
      category: 'system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true
    },
    {
      id: '4',
      title: 'Payroll Processed',
      message: 'Your monthly payroll has been processed successfully',
      type: 'success',
      priority: 'medium',
      category: 'hr',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: true
    },
    {
      id: '5',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from your account',
      type: 'error',
      priority: 'high',
      category: 'system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const deleteMultipleNotifications = (ids: string[]) => {
    setNotifications(prev => prev.filter(notification => !ids.includes(notification.id)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filterNotifications = (filters: {
    type?: string;
    priority?: string;
    category?: string;
    read?: boolean;
  }) => {
    return notifications.filter(notification => {
      if (filters.type && notification.type !== filters.type) return false;
      if (filters.priority && notification.priority !== filters.priority) return false;
      if (filters.category && notification.category !== filters.category) return false;
      if (filters.read !== undefined && notification.read !== filters.read) return false;
      return true;
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMultipleNotifications,
    clearAllNotifications,
    filterNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 