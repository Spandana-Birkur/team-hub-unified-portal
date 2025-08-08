import React, { useState } from 'react';
import { Calendar as CalendarUI } from '../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useEvents } from '@/contexts/EventsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Calendar as CalendarIcon, Briefcase, Gift, Clock, Star, User as UserIcon, Plus, Edit, Trash2 } from 'lucide-react';
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
  Meeting: { color: 'bg-blue-100 text-blue-700 border border-blue-300', icon: <Briefcase className="inline w-4 h-4 mr-1" /> },
  Holiday: { color: 'bg-green-100 text-green-700 border border-green-300', icon: <Gift className="inline w-4 h-4 mr-1" /> },
  Deadline: { color: 'bg-red-100 text-red-700 border border-red-300', icon: <Clock className="inline w-4 h-4 mr-1" /> },
  Event: { color: 'bg-orange-100 text-orange-700 border border-orange-300', icon: <Star className="inline w-4 h-4 mr-1" /> },
  Personal: { color: 'bg-purple-100 text-purple-700 border border-purple-300', icon: <UserIcon className="inline w-4 h-4 mr-1" /> },
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
      <div className="text-slate-200">{date.getDate()}</div>
      {dayEvents.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-0.5">
          {dayEvents.slice(0, 2).map((event, idx) => (
            <TooltipProvider key={event.id} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`rounded-sm px-1 text-xs ${eventTypeMeta[event.type]?.color || 'bg-gray-100 text-gray-700 border border-gray-300'}`}>{eventTypeMeta[event.type]?.icon}{event.title.length > 6 ? event.title.slice(0, 6) + '…' : event.title}</span>
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 text-gray-800 shadow-lg">
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-xs">{event.description}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {dayEvents.length > 2 && <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded border border-gray-300">+{dayEvents.length - 2}</span>}
        </div>
      )}
    </div>
  );
};

// Modern Calendar Component with New Design
const NewModernCalendar = ({ events, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Calculate event statistics
  const eventStats = {
    total: events.length,
    meeting: events.filter(e => e.type === 'Meeting').length,
    holiday: events.filter(e => e.type === 'Holiday').length,
    deadline: events.filter(e => e.type === 'Deadline').length,
    event: events.filter(e => e.type === 'Event').length,
    personal: events.filter(e => e.type === 'Personal').length,
  };
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Month navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="p-8">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-blue-600">
            {monthNames[month]} {year}
          </h2>
          <p className="text-gray-500 mt-1">
            Today is {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          
          {/* Quick Stats in Calendar */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-700">{eventStats.total} Total</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-700">{eventStats.holiday} Holidays</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl border border-orange-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-orange-700">{eventStats.meeting} Meetings</span>
              </div>
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-700">{eventStats.deadline} Deadlines</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-2xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center py-3">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }
          
          const date = new Date(year, month, day);
          const dateStr = date.toISOString().slice(0, 10);
          const dayEvents = getEventsForDate(dateStr, events);
          const isToday = date.toDateString() === today.toDateString();
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          return (
            <button
              key={day}
              onClick={() => onDateSelect(date)}
              className={`aspect-square p-4 rounded-3xl relative transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
                isToday
                  ? 'bg-blue-500 text-white shadow-lg'
                  : dayEvents.length > 0
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200'
                  : isWeekend
                  ? 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                  : 'bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col h-full">
                <span className={`text-lg font-bold mb-2 ${
                  isToday ? 'text-white' : 'text-gray-800'
                }`}>
                  {day}
                </span>
                
                {/* Event indicators */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded-lg truncate ${
                        isToday
                          ? 'bg-white/20 text-white'
                          : eventTypeMeta[event.type]?.color || 'bg-gray-100 text-gray-700'
                      }`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className={`text-xs px-2 py-1 rounded-lg ${
                      isToday
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
                
                {/* Event count badge */}
                {dayEvents.length > 0 && !isToday && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                    {dayEvents.length}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Calendar Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-200 rounded-full"></div>
              <span>Has Events</span>
            </div>
          </div>
          <div>
            Click any date to view or add events
          </div>
        </div>
      </div>
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

  // Enhanced Custom Day component for CalendarUI with better styling and interaction
  const CalendarDay = (props) => {
    const { date, selected, ...rest } = props;
    const iso = date.toISOString().slice(0, 10);
    const dayEvents = getEventsForDate(iso, events);
    const isToday = date.toDateString() === new Date().toDateString();
    const hasEvents = dayEvents.length > 0;
    
    return (
      <button
        {...rest}
        className={`aspect-square w-full p-3 font-normal rounded-xl relative flex flex-col items-start justify-start transition-all duration-200 hover:shadow-lg border-2
          ${isToday ? 'bg-blue-50 border-blue-400 shadow-md' : 'border-gray-200 hover:border-gray-300'}
          ${hasEvents ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-white hover:bg-gray-50'}
          ${selected ? 'ring-2 ring-blue-500' : ''}
        `}
        tabIndex={0}
        onClick={() => handleDateSelect(date)}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <span className={`text-lg font-semibold ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>
            {date.getDate()}
          </span>
          {hasEvents && (
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {dayEvents.length}
            </span>
          )}
        </div>
        
        {/* Show event previews */}
        <div className="w-full space-y-1 overflow-hidden">
          {dayEvents.slice(0, 2).map((event, idx) => (
            <div
              key={event.id}
              className={`text-xs px-2 py-1 rounded-md truncate ${eventTypeMeta[event.type]?.color || 'bg-gray-100 text-gray-700 border border-gray-300'}`}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-gray-500 px-2 bg-gray-100 rounded border border-gray-300">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Top Navigation Bar with People and Quick Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant={viewMode === 'month' ? 'default' : 'outline'} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setViewMode('month')}>Monthly</Button>
            <Button size="sm" variant={viewMode === 'week' ? 'default' : 'outline'} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setViewMode('week')}>Weekly</Button>
          </div>
          {viewingEmployee && (
            <span className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              <UserIcon className="w-4 h-4" />
              Viewing: {viewingEmployee.name}
              <button className="ml-1 text-xs underline hover:text-blue-900" onClick={() => setViewingEmployee(null)}>Switch back</button>
            </span>
          )}
        </div>
        
        {/* People Dropdown */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const emp = employees.find(emp => emp.id === e.target.value);
                setViewingEmployee(emp || null);
              }}
              value={viewingEmployee?.id || ''}
            >
              <option value="">My Calendar</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
              ))}
            </select>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md px-6 py-2 rounded-lg font-medium" onClick={() => setCreateDialogOpen(true)}>
            + New Event
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Main Calendar Area - New Modern Design */}
        <div className="flex-1">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <NewModernCalendar events={events} onDateSelect={handleDateSelect} />
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Compact */}
        <div className="w-80 space-y-4">
          {/* Upcoming Events */}
          <Card className="shadow-lg border border-gray-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {upcomingEvents.length === 0 ? (
                <div className="text-gray-500 text-sm py-4 text-center">No events in the next 7 days</div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {upcomingEvents.map(ev => (
                    <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer border border-gray-100 hover:border-blue-200 transition-colors" onClick={() => { setEventsForDay([ev]); setSelectedDate(ev.date); setShowDialog(true); }}>
                      <div className={`mt-1 ${eventTypeMeta[ev.type]?.color} rounded-full p-2`}>
                        {eventTypeMeta[ev.type]?.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{ev.title}</div>
                        <div className="text-xs text-gray-600">{ev.date} {ev.time && `at ${ev.time}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Event Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800 text-xl font-semibold">Events on {selectedDate}</DialogTitle>
          </DialogHeader>
          {eventsForDay.length === 0 ? (
            <div className="text-gray-500 py-4 text-center">No events on this day.</div>
          ) : (
            <div className="space-y-3">
              {eventsForDay.map(event => (
                <div key={event.id} className="border rounded-lg p-4 bg-gray-50 border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge className={`${eventTypeMeta[event.type]?.color || 'bg-gray-100 text-gray-700 border border-gray-300'}`}>{event.type}</Badge>
                    <span className="font-semibold text-gray-800">{event.title}</span>
                  </div>
                  {event.isAllDay ? (
                    <div className="text-sm text-gray-600">All Day Event</div>
                  ) : event.time ? (
                    <div className="text-sm text-gray-600">
                      Time: {event.time}{event.endTime && ` - ${event.endTime}`}
                    </div>
                  ) : null}
                  {event.location && <div className="text-sm text-gray-600">Location: {event.location}</div>}
                  <div className="text-sm text-gray-600">{event.description}</div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create Event Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800 text-xl font-semibold">Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Event Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={newEvent.type}
                onChange={e => setNewEvent({ ...newEvent, type: e.target.value as 'Meeting' | 'Holiday' | 'Deadline' | 'Event' | 'Personal' })}
              >
                <option value="Meeting">Meeting</option>
                <option value="Holiday">Holiday</option>
                <option value="Deadline">Deadline</option>
                <option value="Event">Event</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Event Title</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">All Day Event</label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={newEvent.isAllDay}
                  onChange={e => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">This is an all-day event</span>
              </div>
            </div>
            {!newEvent.isAllDay && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Time</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
                  <label className="text-sm font-medium text-gray-700">End Time</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="e.g. Conference Room A"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="space-x-3">
            <Button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
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
