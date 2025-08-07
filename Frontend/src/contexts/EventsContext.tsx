import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CalendarEvent {
  id: string;
  type: 'Meeting' | 'Holiday' | 'Deadline' | 'Event' | 'Personal';
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  isAllDay?: boolean;
  location?: string;
  description?: string;
  createdBy: string;
  isPersonal: boolean;
  createdAt: string;
}

interface EventsContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsForDateRange: (startDate: string, endDate: string) => CalendarEvent[];
  getPersonalEvents: (userId: string) => CalendarEvent[];
  getCompanyEvents: () => CalendarEvent[];
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'EVT-001',
      type: 'Meeting',
      title: 'Quarterly Planning Meeting',
      date: '2024-07-10',
      time: '10:00 AM',
      endTime: '11:30 AM',
      isAllDay: false,
      location: 'Conference Room A',
      description: 'Discuss Q3 goals and strategies with all department heads.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-002',
      type: 'Holiday',
      title: 'Independence Day (Observed)',
      date: '2024-07-12',
      isAllDay: true,
      description: 'Office closed for national holiday.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-003',
      type: 'Deadline',
      title: 'Payroll Submission Deadline',
      date: '2024-07-15',
      time: '5:00 PM',
      endTime: '5:00 PM',
      isAllDay: false,
      description: 'Submit all payroll documents to HR.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-004',
      type: 'Event',
      title: 'Company Picnic',
      date: '2024-07-20',
      time: '12:00 PM',
      endTime: '4:00 PM',
      isAllDay: false,
      location: 'Central Park',
      description: 'Annual company picnic for employees and families.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-005',
      type: 'Meeting',
      title: 'IT Security Briefing',
      date: '2024-07-10',
      time: '2:00 PM',
      endTime: '3:00 PM',
      isAllDay: false,
      location: 'Zoom',
      description: 'Mandatory security training for all staff.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-006',
      type: 'Event',
      title: 'Product Launch',
      date: '2024-07-18',
      time: '3:00 PM',
      endTime: '5:00 PM',
      isAllDay: false,
      location: 'Main Auditorium',
      description: 'Launch of the new product line.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-007',
      type: 'Meeting',
      title: '1:1 with Manager',
      date: '2024-07-13',
      time: '11:00 AM',
      endTime: '11:30 AM',
      isAllDay: false,
      location: 'Manager Office',
      description: 'Monthly check-in with your manager.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-008',
      type: 'Holiday',
      title: 'Summer Break',
      date: '2024-07-25',
      isAllDay: true,
      description: 'Office closed for summer break.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'EVT-009',
      type: 'Deadline',
      title: 'Expense Report Due',
      date: '2024-07-22',
      time: '6:00 PM',
      endTime: '6:00 PM',
      isAllDay: false,
      description: 'Submit all expense reports for July.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, ...updates }
          : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const getEventsForDateRange = (startDate: string, endDate: string) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return eventDate >= start && eventDate <= end;
    });
  };

  const getPersonalEvents = (userId: string) => {
    return events.filter(event => event.isPersonal && event.createdBy === userId);
  };

  const getCompanyEvents = () => {
    return events.filter(event => !event.isPersonal);
  };

  const value: EventsContextType = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForDateRange,
    getPersonalEvents,
    getCompanyEvents
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}; 