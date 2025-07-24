import React, { useState } from 'react';
import { Calendar as CalendarUI } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useEvents } from '@/contexts/EventsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Calendar as CalendarIcon, Briefcase, Gift, Clock, Star, User as UserIcon } from 'lucide-react';
import { employees } from '../data/employees';

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
  const [viewingEmployee, setViewingEmployee] = useState(null);

  // --- Sidebar logic ---
  // Get next 7 days' events
  const today = new Date();
  const next7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
  const upcomingEvents = events.filter(e => next7.includes(e.date)).sort((a, b) => a.date.localeCompare(b.date));
  const eventStats = {
    total: events.length,
    meeting: events.filter(e => e.type === 'Meeting').length,
    holiday: events.filter(e => e.type === 'Holiday').length,
    deadline: events.filter(e => e.type === 'Deadline').length,
    event: events.filter(e => e.type === 'Event').length,
    personal: events.filter(e => e.type === 'Personal').length,
  };

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
    <div className="p-4 w-full flex flex-row items-start justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main calendar area */}
      <div className="flex-1 flex flex-col items-center">
        <Card className="w-full max-w-4xl mx-auto shadow-lg border border-gray-100">
          <div className="flex items-center justify-between pb-2 px-6 pt-6">
            <div className="flex items-center">
              <CardTitle>My Calendar</CardTitle>
              {viewingEmployee && (
                <span className="ml-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  <UserIcon className="w-4 h-4 text-blue-500" />
                  Viewing: {viewingEmployee.name}
                  <button className="ml-2 text-xs text-blue-600 underline" onClick={() => setViewingEmployee(null)}>Back to My Calendar</button>
                </span>
              )}
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-4 py-1.5 text-base font-semibold rounded-lg" onClick={() => setCreateDialogOpen(true)}>
              + Create Event
            </Button>
          </div>
          <CardContent className="w-full pt-0">
            <div className="flex items-center mb-2 space-x-2">
              <Button size="sm" variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>Monthly View</Button>
              <Button size="sm" variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => setViewMode('week')}>Weekly View</Button>
            </div>
            <div className="flex justify-center w-full">
              {viewMode === 'month' ? (
                <div className="w-full flex justify-center">
                  <CalendarUI
                    mode="single"
                    onSelect={handleDateSelect}
                    className="w-full max-w-3xl text-base"
                    renderDay={date => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      const iso = date.toISOString().slice(0, 10);
                      const dayEvents = getEventsForDate(iso, events);
                      return (
                        <div
                          className={`relative w-full h-full rounded-lg p-0.5 ${isToday ? 'bg-blue-100 border-2 border-blue-400' : ''} ${dayEvents.length > 0 ? 'bg-yellow-50' : ''}`}
                          onDoubleClick={() => handleDayDoubleClick(date)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{date.getDate()}</span>
                            {dayEvents.length > 0 && (
                              <span className="ml-1 bg-blue-200 text-blue-800 rounded-full px-1 text-xs font-medium">{dayEvents.length}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 2).map(event => (
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
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-white w-full max-w-3xl text-base">
                  <div className="flex justify-between mb-1 w-full">
                    {weekDates.map(date => (
                      <div key={date.toISOString()} className="flex-1 text-center">
                        <div className={`font-semibold text-gray-700 ${date.toDateString() === today.toDateString() ? 'text-blue-600 underline' : ''}`}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                        <div className="text-xs text-gray-500">{date.toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between w-full">
                    {weekDates.map(date => {
                      const iso = date.toISOString().slice(0, 10);
                      const dayEvents = getEventsForDate(iso, events);
                      return (
                        <div key={iso} className={`flex-1 min-h-[60px] border rounded p-1 mx-0.5 ${date.toDateString() === today.toDateString() ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'}`}>
                          {dayEvents.length === 0 ? (
                            <div className="text-xs text-gray-400 text-center">No events</div>
                          ) : (
                            dayEvents.map(event => (
                              <div key={event.id} className="mb-1 p-1 rounded bg-blue-100 cursor-pointer flex items-center" onClick={() => { setEventsForDay([event]); setSelectedDate(iso); setShowDialog(true); }}>
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
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Sidebar */}
      <aside className="w-72 ml-6 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 sticky top-8 h-fit min-h-[400px] border border-gray-100">
        <div>
          <div className="text-base font-semibold mb-1 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-500" /> Upcoming Events</div>
          {upcomingEvents.length === 0 ? (
            <div className="text-gray-400 text-xs">No events in the next 7 days.</div>
          ) : (
            <ul className="space-y-1">
              {upcomingEvents.map(ev => (
                <li key={ev.id} className="flex items-start gap-2 p-1 rounded hover:bg-blue-50 cursor-pointer" onClick={() => { setEventsForDay([ev]); setSelectedDate(ev.date); setShowDialog(true); }}>
                  <span className={`mt-1 ${eventTypeMeta[ev.type]?.color || 'bg-gray-200 text-gray-800'} rounded-full p-1`}>{eventTypeMeta[ev.type]?.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 text-xs">{ev.title}</div>
                    <div className="text-xs text-gray-500">{ev.date} {ev.time && `at ${ev.time}`}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="text-base font-semibold mb-1 flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-500" /> Event Stats</div>
          <ul className="grid grid-cols-2 gap-1 text-xs">
            <li className="bg-blue-100 rounded p-2 flex flex-col items-center"><span className="font-bold text-base">{eventStats.total}</span><span>Total</span></li>
            <li className="bg-green-100 rounded p-2 flex flex-col items-center"><span className="font-bold text-base">{eventStats.holiday}</span><span>Holidays</span></li>
            <li className="bg-yellow-100 rounded p-2 flex flex-col items-center"><span className="font-bold text-base">{eventStats.meeting}</span><span>Meetings</span></li>
            <li className="bg-red-100 rounded p-2 flex flex-col items-center"><span className="font-bold text-base">{eventStats.deadline}</span><span>Deadlines</span></li>
            <li className="bg-purple-100 rounded p-2 flex flex-col items-center"><span className="font-bold text-base">{eventStats.event}</span><span>Events</span></li>
            <li className="bg-gray-100 rounded p-2 flex flex-col items-center"><span className="font-bold text-base">{eventStats.personal}</span><span>Personal</span></li>
          </ul>
        </div>
      </aside>
      {/* People List Sidebar */}
      <aside className="w-64 ml-6 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 sticky top-8 h-fit min-h-[400px] border border-gray-100">
        <div className="text-base font-semibold mb-2 flex items-center gap-2"><UserIcon className="w-5 h-5 text-blue-500" /> People</div>
        <ul className="overflow-y-auto max-h-[500px] divide-y divide-gray-100">
          {employees.map(emp => (
            <li key={emp.id} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-blue-50 rounded px-2" onClick={() => setViewingEmployee(emp)}>
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-base font-semibold text-blue-700">
                {emp.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-900">{emp.name}</span>
                <span className="text-xs text-gray-500">{emp.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      {/* Dialogs remain unchanged */}
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