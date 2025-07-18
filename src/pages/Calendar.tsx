import React, { useState } from 'react';
import { Calendar as CalendarUI } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useEvents } from '@/contexts/EventsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Calendar as CalendarIcon, Briefcase, Gift, Clock, Star, User as UserIcon } from 'lucide-react';

// Helper function to get events for a specific date
function getEventsForDate(dateStr: string, events: any[]) {
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

// Helper for event type color/icon
const eventTypeMeta = {
  Meeting: { color: 'bg-blue-200 text-blue-800', icon: <Briefcase className="inline w-4 h-4 mr-1" /> },
  Holiday: { color: 'bg-green-200 text-green-800', icon: <Gift className="inline w-4 h-4 mr-1" /> },
  Deadline: { color: 'bg-red-200 text-red-800', icon: <Clock className="inline w-4 h-4 mr-1" /> },
  Event: { color: 'bg-yellow-200 text-yellow-800', icon: <Star className="inline w-4 h-4 mr-1" /> },
  Personal: { color: 'bg-purple-200 text-purple-800', icon: <UserIcon className="inline w-4 h-4 mr-1" /> },
};

// 1. Define your custom Day component above your CalendarPage
const CustomDay = (props) => {
  const { date, events, handleDayDoubleClick, ...rest } = props;
  const iso = date.toISOString().slice(0, 10);
  const dayEvents = getEventsForDate(iso, events);
  return (
    <div
      {...rest}
      className="relative w-full h-full"
      onDoubleClick={() => handleDayDoubleClick(date)}
    >
      <div>{date.getDate()}</div>
      {dayEvents.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-0.5">
          {dayEvents.slice(0, 2).map((event, idx) => (
            <TooltipProvider key={event.id} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`rounded px-1 text-xs ${eventTypeMeta[event.type]?.color || 'bg-gray-200 text-gray-800'}`}>{eventTypeMeta[event.type]?.icon}{event.title.length > 6 ? event.title.slice(0, 6) + '…' : event.title}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-xs">{event.description}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {dayEvents.length > 2 && <span className="text-xs text-gray-400">+{dayEvents.length - 2}</span>}
        </div>
      )}
    </div>
  );
};

const CalendarPage = () => {
  const { events, addEvent } = useEvents();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [eventsForDay, setEventsForDay] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'Meeting' as 'Meeting' | 'Holiday' | 'Deadline' | 'Event' | 'Personal',
    title: '',
    date: '',
    time: '',
    endTime: '',
    isAllDay: false,
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

  // Add double-click handler for CalendarUI
  const handleDayDoubleClick = (date) => {
    setNewEvent({ ...newEvent, date: date.toISOString().slice(0, 10) });
    setCreateDialogOpen(true);
  };

  // Weekly view navigation state
  const [weekBaseDate, setWeekBaseDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  const weekDates = getWeekDates(weekBaseDate);

  // When switching to week view, reset weekBaseDate to today or selectedDate
  React.useEffect(() => {
    if (viewMode === 'week') {
      setWeekBaseDate(selectedDate ? new Date(selectedDate) : new Date());
    }
  }, [viewMode, selectedDate]);

  const goToPrevWeek = () => {
    const prev = new Date(weekBaseDate);
    prev.setDate(prev.getDate() - 7);
    setWeekBaseDate(prev);
  };
  const goToNextWeek = () => {
    const next = new Date(weekBaseDate);
    next.setDate(next.getDate() + 7);
    setWeekBaseDate(next);
  };

  return (
    <div className="p-6 w-full">
      <Card className="w-full max-w-5xl mx-auto p-12">
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
            <div className="flex justify-center">
              <div className="scale-125">
                <CalendarUI
                  mode="single"
                  onSelect={handleDateSelect}
                  className="w-full"
                  modifiers={{ today: new Date() }}
                  modifiersClassNames={{ today: 'ring-2 ring-blue-500' }}
                  components={{ Day: (props) => <CustomDay {...props} events={events} handleDayDoubleClick={handleDayDoubleClick} /> }}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center mt-8">
              <div className="border rounded-lg p-8 bg-white w-full max-w-2xl scale-125">
                <div className="flex justify-between items-center mb-4 w-full">
                  <Button variant="outline" size="sm" onClick={goToPrevWeek}>&lt; Previous Week</Button>
                  <div className="font-semibold text-lg">Week of {weekDates[0].toLocaleDateString()}</div>
                  <Button variant="outline" size="sm" onClick={goToNextWeek}>Next Week &gt;</Button>
                </div>
                <div className="flex justify-between mb-2 w-full">
                  {weekDates.map(date => (
                    <div key={date.toISOString()} className={`flex-1 text-center ${date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500 rounded' : ''}`}>
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
                      <div key={iso} className={`flex-1 min-h-[60px] border rounded p-1 mx-1 bg-gray-50 ${date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500' : ''}`}
                        onDoubleClick={() => handleDayDoubleClick(date)}>
                        {dayEvents.length === 0 ? (
                          <div className="text-xs text-gray-400 text-center flex flex-col items-center justify-center h-full">
                            <span>No events</span>
                            <span className="text-[10px]">Double-click to add</span>
                          </div>
                        ) : (
                          dayEvents.map(event => (
                            <TooltipProvider key={event.id} delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`mb-1 p-1 rounded cursor-pointer flex items-center gap-1 ${eventTypeMeta[event.type]?.color || 'bg-gray-200 text-gray-800'}`}
                                    onClick={() => { setEventsForDay([event]); setSelectedDate(iso); setShowDialog(true); }}>
                                    {eventTypeMeta[event.type]?.icon}
                                    <span className="text-xs font-medium">{event.title}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="font-semibold">{event.title}</div>
                                  <div className="text-xs">{event.description}</div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setCreateDialogOpen(true)}>
              Create Event
            </Button>
          </div>
        </CardContent>
      </Card>
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
                  {event.isAllDay ? (
                    <div className="text-xs text-gray-500">All Day Event</div>
                  ) : event.time ? (
                    <div className="text-xs text-gray-500">
                      Time: {event.time}{event.endTime && ` - ${event.endTime}`}
                    </div>
                  ) : null}
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
                onChange={e => setNewEvent({ ...newEvent, type: e.target.value as 'Meeting' | 'Holiday' | 'Deadline' | 'Event' | 'Personal' })}
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
              <label className="text-sm font-medium">All Day Event</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="checkbox"
                  checked={newEvent.isAllDay}
                  onChange={e => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">This is an all-day event</span>
              </div>
            </div>
            {!newEvent.isAllDay && (
              <>
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <select
                    className="w-full border rounded px-2 py-1 mt-1"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                  >
                    <option value="">Select start time</option>
                    <option value="12:00 AM">12:00 AM</option>
                    <option value="12:30 AM">12:30 AM</option>
                    <option value="1:00 AM">1:00 AM</option>
                    <option value="1:30 AM">1:30 AM</option>
                    <option value="2:00 AM">2:00 AM</option>
                    <option value="2:30 AM">2:30 AM</option>
                    <option value="3:00 AM">3:00 AM</option>
                    <option value="3:30 AM">3:30 AM</option>
                    <option value="4:00 AM">4:00 AM</option>
                    <option value="4:30 AM">4:30 AM</option>
                    <option value="5:00 AM">5:00 AM</option>
                    <option value="5:30 AM">5:30 AM</option>
                    <option value="6:00 AM">6:00 AM</option>
                    <option value="6:30 AM">6:30 AM</option>
                    <option value="7:00 AM">7:00 AM</option>
                    <option value="7:30 AM">7:30 AM</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="8:30 AM">8:30 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="9:30 AM">9:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="9:30 PM">9:30 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="10:30 PM">10:30 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="11:30 PM">11:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <select
                    className="w-full border rounded px-2 py-1 mt-1"
                    value={newEvent.endTime}
                    onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  >
                    <option value="">Select end time</option>
                    <option value="12:00 AM">12:00 AM</option>
                    <option value="12:30 AM">12:30 AM</option>
                    <option value="1:00 AM">1:00 AM</option>
                    <option value="1:30 AM">1:30 AM</option>
                    <option value="2:00 AM">2:00 AM</option>
                    <option value="2:30 AM">2:30 AM</option>
                    <option value="3:00 AM">3:00 AM</option>
                    <option value="3:30 AM">3:30 AM</option>
                    <option value="4:00 AM">4:00 AM</option>
                    <option value="4:30 AM">4:30 AM</option>
                    <option value="5:00 AM">5:00 AM</option>
                    <option value="5:30 AM">5:30 AM</option>
                    <option value="6:00 AM">6:00 AM</option>
                    <option value="6:30 AM">6:30 AM</option>
                    <option value="7:00 AM">7:00 AM</option>
                    <option value="7:30 AM">7:30 AM</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="8:30 AM">8:30 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="9:30 AM">9:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="9:30 PM">9:30 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="10:30 PM">10:30 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="11:30 PM">11:30 PM</option>
                  </select>
                </div>
              </>
            )}
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
                addEvent({
                  type: newEvent.type,
                  title: newEvent.title,
                  date: newEvent.date,
                  time: newEvent.isAllDay ? undefined : newEvent.time || undefined,
                  endTime: newEvent.isAllDay ? undefined : newEvent.endTime || undefined,
                  isAllDay: newEvent.isAllDay,
                  location: newEvent.location || undefined,
                  description: newEvent.description || undefined,
                  createdBy: 'current-user',
                  isPersonal: false
                });
                setNewEvent({ 
                  type: 'Meeting' as 'Meeting' | 'Holiday' | 'Deadline' | 'Event' | 'Personal', 
                  title: '', 
                  date: '', 
                  time: '', 
                  endTime: '',
                  isAllDay: false,
                  location: '', 
                  description: '' 
                });
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