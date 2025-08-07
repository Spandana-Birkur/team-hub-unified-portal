import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

const HRAnnouncements = () => {
  const [hrAnnouncements, setHrAnnouncements] = useState([
    { id: 1, title: 'Holiday Schedule Updated', content: 'Please review the updated holiday schedule for 2024', priority: 'info', date: '2024-01-15' },
    { id: 2, title: 'New Benefits Enrollment', content: 'Open enrollment period starts February 1st', priority: 'urgent', date: '2024-01-14' },
    { id: 3, title: 'Team Building Event', content: 'Join us for the quarterly team building event', priority: 'reminder', date: '2024-01-12' },
  ]);
  const [newAnnouncementModalOpen, setNewAnnouncementModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'info'
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'info': return <Badge variant="default">Info</Badge>;
      case 'reminder': return <Badge variant="secondary">Reminder</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  // HR Announcements functions
  const handleNewAnnouncement = () => {
    setNewAnnouncementModalOpen(true);
  };

  const handleSubmitNewAnnouncement = () => {
    const newId = Math.max(...hrAnnouncements.map(a => a.id)) + 1;
    const newAnnouncementData = {
      id: newId,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority,
      date: new Date().toISOString().split('T')[0]
    };
    setHrAnnouncements(prev => [newAnnouncementData, ...prev]);
    setNewAnnouncement({ title: '', content: '', priority: 'info' });
    setNewAnnouncementModalOpen(false);
  };

  const closeNewAnnouncementModal = () => {
    setNewAnnouncementModalOpen(false);
    setNewAnnouncement({ title: '', content: '', priority: 'info' });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>HR Announcements</span>
          </CardTitle>
          <Button onClick={handleNewAnnouncement}>New Announcement</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hrAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(announcement.priority)}
                    <span className="text-xs text-gray-500">{announcement.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{announcement.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Announcement Modal */}
      <Dialog open={newAnnouncementModalOpen} onOpenChange={setNewAnnouncementModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>New Announcement</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input 
                placeholder="Enter announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea 
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
                placeholder="Enter announcement content..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="info">Info</option>
                <option value="urgent">Urgent</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewAnnouncementModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.content}>
                Post Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRAnnouncements;
