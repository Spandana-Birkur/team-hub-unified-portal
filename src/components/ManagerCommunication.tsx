import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/contexts/RoleContext';
import { 
  Megaphone, 
  MessageSquare, 
  Bell, 
  Send, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Archive,
  Star,
  Settings
} from 'lucide-react';

const ManagerCommunication = () => {
  const { userRole } = useRole();
  const isManager = userRole === 'manager';
  const [activeTab, setActiveTab] = useState('announcements');
  const [newAnnouncementModalOpen, setNewAnnouncementModalOpen] = useState(false);
  const [newMessageModalOpen, setNewMessageModalOpen] = useState(false);
  const [notificationSettingsModalOpen, setNotificationSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: 'Team Meeting Tomorrow', 
      content: 'We will have our weekly team meeting tomorrow at 10 AM. Please prepare your updates.', 
      priority: 'info', 
      date: '2024-12-16',
      author: 'Manager',
      recipients: 'All Team',
      status: 'published'
    },
    { 
      id: 2, 
      title: 'Holiday Schedule Update', 
      content: 'The office will be closed from Dec 24-26 for the holidays. Please plan accordingly.', 
      priority: 'urgent', 
      date: '2024-12-15',
      author: 'Manager',
      recipients: 'All Team',
      status: 'published'
    },
    { 
      id: 3, 
      title: 'Performance Review Deadline', 
      content: 'All performance reviews are due by Dec 31. Please complete them on time.', 
      priority: 'reminder', 
      date: '2024-12-14',
      author: 'Manager',
      recipients: 'Team Leads',
      status: 'draft'
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Manager',
      to: 'John Doe',
      subject: 'Project Update Request',
      content: 'Can you provide an update on the Q4 project status?',
      date: '2024-12-16',
      status: 'sent',
      priority: 'normal'
    },
    {
      id: 2,
      from: 'Manager',
      to: 'Sarah Johnson',
      subject: 'Meeting Follow-up',
      content: 'Great discussion in today\'s meeting. Let\'s follow up on the action items.',
      date: '2024-12-15',
      status: 'sent',
      priority: 'high'
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'timesheet',
      title: 'Timesheet Approval Required',
      message: 'John Doe submitted timesheet for approval',
      date: '2024-12-16',
      status: 'unread',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'leave',
      title: 'Leave Request',
      message: 'Sarah Johnson requested vacation leave',
      date: '2024-12-16',
      status: 'unread',
      priority: 'high'
    },
    {
      id: 3,
      type: 'performance',
      title: 'Performance Review Due',
      message: 'Mike Chen\'s performance review is due in 3 days',
      date: '2024-12-15',
      status: 'read',
      priority: 'urgent'
    },
  ]);

  // Form states
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'info',
    recipients: 'all'
  });

  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'normal'
  });

  // Filter data based on search
  const filteredAnnouncements = announcements.filter(announcement => {
    const query = searchQuery.toLowerCase();
    return (
      announcement.title.toLowerCase().includes(query) ||
      announcement.content.toLowerCase().includes(query) ||
      announcement.recipients.toLowerCase().includes(query)
    );
  });

  const filteredMessages = messages.filter(message => {
    const query = searchQuery.toLowerCase();
    return (
      message.subject.toLowerCase().includes(query) ||
      message.content.toLowerCase().includes(query) ||
      message.to.toLowerCase().includes(query)
    );
  });

  const filteredNotifications = notifications.filter(notification => {
    const query = searchQuery.toLowerCase();
    return (
      notification.title.toLowerCase().includes(query) ||
      notification.message.toLowerCase().includes(query)
    );
  });

  // Handle announcements
  const handleSubmitAnnouncement = () => {
    const newId = Math.max(...announcements.map(a => a.id)) + 1;
    const newAnnouncementData = {
      id: newId,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority,
      date: new Date().toISOString().split('T')[0],
      author: 'Manager',
      recipients: newAnnouncement.recipients === 'all' ? 'All Team' : 'Specific Team',
      status: 'published'
    };
    setAnnouncements(prev => [newAnnouncementData, ...prev]);
    setNewAnnouncement({ title: '', content: '', priority: 'info', recipients: 'all' });
    setNewAnnouncementModalOpen(false);
  };

  // Handle messages
  const handleSubmitMessage = () => {
    const newId = Math.max(...messages.map(m => m.id)) + 1;
    const newMessageData = {
      id: newId,
      from: 'Manager',
      to: newMessage.to,
      subject: newMessage.subject,
      content: newMessage.content,
      date: new Date().toISOString().split('T')[0],
      status: 'sent',
      priority: newMessage.priority
    };
    setMessages(prev => [newMessageData, ...prev]);
    setNewMessage({ to: '', subject: '', content: '', priority: 'normal' });
    setNewMessageModalOpen(false);
  };

  // Handle notifications
  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, status: 'read' } : n
    ));
  };

  const handleDeleteNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Handle announcements
  const handleEditAnnouncement = (announcementId: number) => {
    const announcement = announcements.find(a => a.id === announcementId);
    if (announcement) {
      setNewAnnouncement({
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        recipients: announcement.recipients === 'All Team' ? 'all' : 'specific'
      });
      setNewAnnouncementModalOpen(true);
    }
  };

  const handleArchiveAnnouncement = (announcementId: number) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === announcementId ? { ...a, status: 'archived' } : a
    ));
  };

  // Handle notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    timesheetApprovals: true,
    leaveRequests: true,
    performanceReviews: true,
    teamMessages: false,
    inAppNotifications: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSaveNotificationSettings = () => {
    console.log('Notification settings saved:', notificationSettings);
    setNotificationSettingsModalOpen(false);
  };

  const handleToggleNotificationSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge variant="default">High</Badge>;
      case 'info': return <Badge variant="secondary">Info</Badge>;
      case 'reminder': return <Badge variant="outline">Reminder</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'timesheet': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'leave': return <Users className="w-4 h-4 text-green-500" />; // Changed from Calendar to Users
      case 'performance': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isManager ? 'Communication Tools' : 'Company Communications'}
        </h1>
        <p className="text-gray-600">
          {isManager 
            ? 'Manage team announcements, messages, and notifications' 
            : 'View company announcements, messages, and notifications'
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5" />
                <span>Team Announcements</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Search announcements..." 
                  className="w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isManager && (
                  <Button onClick={() => setNewAnnouncementModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                        <p className="text-sm text-gray-600">{announcement.content}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getPriorityBadge(announcement.priority)}
                        <Badge variant={announcement.status === 'published' ? 'default' : 'secondary'}>
                          {announcement.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>To: {announcement.recipients}</span>
                      <span>{announcement.date}</span>
                    </div>
                    {isManager && (
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleEditAnnouncement(announcement.id)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleArchiveAnnouncement(announcement.id)}>
                          <Archive className="w-4 h-4 mr-1" />
                          Archive
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Team Messages</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Search messages..." 
                  className="w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isManager && (
                  <Button onClick={() => setNewMessageModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                        <p className="text-sm text-gray-600">To: {message.to}</p>
                        <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getPriorityBadge(message.priority)}
                        <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
                          {message.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>From: {message.from}</span>
                      <span>{message.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Center</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Search notifications..." 
                  className="w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isManager && (
                  <Button onClick={() => setNotificationSettingsModalOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                    notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getPriorityBadge(notification.priority)}
                        <Badge variant={notification.status === 'unread' ? 'default' : 'secondary'}>
                          {notification.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{notification.date}</span>
                      <div className="flex space-x-2">
                        {notification.status === 'unread' && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(notification.id)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDeleteNotification(notification.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Announcement Modal */}
      <Dialog open={newAnnouncementModalOpen} onOpenChange={setNewAnnouncementModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Megaphone className="w-5 h-5" />
              <span>New Announcement</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                placeholder="Enter announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content"
                rows={4}
                placeholder="Enter announcement content..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newAnnouncement.priority} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Select value={newAnnouncement.recipients} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, recipients: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Team</SelectItem>
                    <SelectItem value="specific">Specific Team</SelectItem>
                    <SelectItem value="leads">Team Leads Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setNewAnnouncementModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.content}>
                <Send className="w-4 h-4 mr-2" />
                Post Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Message Modal */}
      <Dialog open={newMessageModalOpen} onOpenChange={setNewMessageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>New Message</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input 
                id="to"
                placeholder="Enter recipient name or email"
                value={newMessage.to}
                onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                placeholder="Enter message subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="message-content">Message</Label>
              <Textarea 
                id="message-content"
                rows={4}
                placeholder="Enter your message..."
                value={newMessage.content}
                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="message-priority">Priority</Label>
              <Select value={newMessage.priority} onValueChange={(value) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setNewMessageModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitMessage} disabled={!newMessage.to || !newMessage.subject || !newMessage.content}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Modal */}
      <Dialog open={notificationSettingsModalOpen} onOpenChange={setNotificationSettingsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Notification Settings</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Notification Types</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Timesheet Approvals</span>
                  <Button 
                    size="sm" 
                    variant={notificationSettings.timesheetApprovals ? "default" : "secondary"}
                    onClick={() => handleToggleNotificationSetting('timesheetApprovals')}
                  >
                    {notificationSettings.timesheetApprovals ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Leave Requests</span>
                  <Button 
                    size="sm" 
                    variant={notificationSettings.leaveRequests ? "default" : "secondary"}
                    onClick={() => handleToggleNotificationSetting('leaveRequests')}
                  >
                    {notificationSettings.leaveRequests ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance Reviews</span>
                  <Button 
                    size="sm" 
                    variant={notificationSettings.performanceReviews ? "default" : "secondary"}
                    onClick={() => handleToggleNotificationSetting('performanceReviews')}
                  >
                    {notificationSettings.performanceReviews ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Team Messages</span>
                  <Button 
                    size="sm" 
                    variant={notificationSettings.teamMessages ? "default" : "secondary"}
                    onClick={() => handleToggleNotificationSetting('teamMessages')}
                  >
                    {notificationSettings.teamMessages ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Delivery Methods</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">In-app Notifications</span>
                  <Button 
                    size="sm" 
                    variant={notificationSettings.inAppNotifications ? "default" : "secondary"}
                    onClick={() => handleToggleNotificationSetting('inAppNotifications')}
                  >
                    {notificationSettings.inAppNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Button 
                    size="sm" 
                    variant={notificationSettings.emailNotifications ? "default" : "secondary"}
                    onClick={() => handleToggleNotificationSetting('emailNotifications')}
                  >
                    {notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Notifications</span>
                  <Button 
                    size="sm" 
                    variant={notificationSettings.smsNotifications ? "default" : "secondary"}
                    onClick={() => handleToggleNotificationSetting('smsNotifications')}
                  >
                    {notificationSettings.smsNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setNotificationSettingsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotificationSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerCommunication; 