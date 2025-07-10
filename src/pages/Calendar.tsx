import React, { useState } from 'react';
import { Calendar as CalendarUI } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

// Mock company events data
const initialEvents = [
  {
    id: 'EVT-001',
    type: 'Meeting',
    title: 'Quarterly Planning Meeting',
    date: '2024-07-10',
    time: '10:00 AM',
    location: 'Conference Room A',
    description: 'Discuss Q3 goals and strategies with all department heads.'
  },
  {
    id: 'EVT-002',
    type: 'Holiday',
    title: 'Independence Day (Observed)',
    date: '2024-07-12',
    description: 'Office closed for national holiday.'
  },
  {
    id: 'EVT-003',
    type: 'Deadline',
    title: 'Payroll Submission Deadline',
    date: '2024-07-15',
    time: '5:00 PM',
    description: 'Submit all payroll documents to HR.'
  },
  {
    id: 'EVT-004',
    type: 'Event',
    title: 'Company Picnic',
    date: '2024-07-20',
    time: '12:00 PM',
    location: 'Central Park',
    description: 'Annual company picnic for employees and families.'
  },
  {
    id: 'EVT-005',
    type: 'Meeting',
    title: 'IT Security Briefing',
    date: '2024-07-10',
    time: '2:00 PM',
    location: 'Zoom',
    description: 'Mandatory security training for all staff.'
  },
  {
    id: 'EVT-006',
    type: 'Event',
    title: 'Product Launch',
    date: '2024-07-18',
    time: '3:00 PM',
    location: 'Main Auditorium',
    description: 'Launch of the new product line.'
  },
  {
    id: 'EVT-007',
    type: 'Meeting',
    title: '1:1 with Manager',
    date: '2024-07-13',
    time: '11:00 AM',
    location: 'Manager Office',
    description: 'Monthly check-in with your manager.'
  },
  {
    id: 'EVT-008',
    type: 'Holiday',
    title: 'Summer Break',
    date: '2024-07-25',
    description: 'Office closed for summer break.'
  },
  {
    id: 'EVT-009',
    type: 'Deadline',
    title: 'Expense Report Due',
    date: '2024-07-22',
    time: '6:00 PM',
    description: 'Submit all expense reports for July.'
  },
];

function getEventsForDate(dateStr, events) {
  return events.filter(event => event.date === dateStr);
}

function getWeekDates(date) {
  // Returns array of Date objects for the week containing 'date' (Sunday to Saturday)
  const d = new Date(date);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(start);
    dt.setDate(start.getDate() + i);
    return dt;
  });
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [eventsForDay, setEventsForDay] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'Meeting',
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  const handleDateSelect = (date) => {
    const iso = date.toISOString().slice(0, 10);
    const dayEvents = getEventsForDate(iso, events);
    setEventsForDay(dayEvents);
    setSelectedDate(iso);
    setShowDialog(true);
  };

  // For weekly view, default to today or selectedDate
  const weekBaseDate = selectedDate ? new Date(selectedDate) : new Date();
  const weekDates = getWeekDates(weekBaseDate);

  return (
    <div className="p-6 w-full">
      <Card className="w-full">
        <CardHeader className="flex items-center space-x-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <CardTitle>Company Calendar</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex items-center mb-4 space-x-2">
            <Button size="sm" variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>Monthly View</Button>
            <Button size="sm" variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => setViewMode('week')}>Weekly View</Button>
          </div>
          {viewMode === 'month' ? (
            <div className="w-full">
              <CalendarUI
                mode="single"
                onSelect={handleDateSelect}
                className="w-full"
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-white w-full">
              <div className="flex justify-between mb-2 w-full">
                {weekDates.map(date => (
                  <div key={date.toISOString()} className="flex-1 text-center">
                    <div className="font-semibold text-gray-700">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                    <div className="text-xs text-gray-500">{date.toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between w-full">
                {weekDates.map(date => {
                  const iso = date.toISOString().slice(0, 10);
                  const dayEvents = getEventsForDate(iso, events);
                  return (
                    <div key={iso} className="flex-1 min-h-[60px] border rounded p-1 mx-1 bg-gray-50">
                      {dayEvents.length === 0 ? (
                        <div className="text-xs text-gray-400 text-center">No events</div>
                      ) : (
                        dayEvents.map(event => (
                          <div key={event.id} className="mb-1 p-1 rounded bg-blue-100 cursor-pointer" onClick={() => { setEventsForDay([event]); setSelectedDate(iso); setShowDialog(true); }}>
                            <Badge className="mr-1 text-xs">{event.type}</Badge>
                            <span className="text-xs font-medium">{event.title}</span>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end mb-4">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setCreateDialogOpen(true)}>
          Create Event
        </Button>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Events on {selectedDate}</DialogTitle>
          </DialogHeader>
          {eventsForDay.length === 0 ? (
            <div className="text-gray-500">No events on this day.</div>
          ) : (
            <div className="space-y-3">
              {eventsForDay.map(event => (
                <div key={event.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className="border border-gray-300 bg-transparent text-gray-700">{event.type}</Badge>
                    <span className="font-semibold text-gray-900">{event.title}</span>
                  </div>
                  {event.time && <div className="text-xs text-gray-500">Time: {event.time}</div>}
                  {event.location && <div className="text-xs text-gray-500">Location: {event.location}</div>}
                  <div className="text-xs text-gray-500">{event.description}</div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button className="border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-800" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create Event Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full border rounded px-2 py-1 mt-1"
                value={newEvent.type}
                onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <option value="Meeting">Meeting</option>
                <option value="Holiday">Holiday</option>
                <option value="Deadline">Deadline</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1 mt-1"
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="e.g. 2:00 PM"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="e.g. Conference Room A"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full border rounded px-2 py-1 mt-1"
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-800" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (!newEvent.title.trim() || !newEvent.date.trim()) return;
                setEvents([
                  ...events,
                  {
                    ...newEvent,
                    id: `EVT-${(events.length + 1).toString().padStart(3, '0')}`,
                  },
                ]);
                setNewEvent({ type: 'Meeting', title: '', date: '', time: '', location: '', description: '' });
                setCreateDialogOpen(false);
              }}
              disabled={!newEvent.title.trim() || !newEvent.date.trim()}
            >
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage; 