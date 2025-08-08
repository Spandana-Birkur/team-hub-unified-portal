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
    // Existing July 2024 events
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
    // New August 2025 events (weekdays only, starting Aug 11)
    {
      id: 'EVT-009',
      type: 'Meeting',
      title: 'Weekly Project Check-In',
      date: '2025-08-11',
      time: '9:00 AM',
      endTime: '10:00 AM',
      isAllDay: false,
      location: 'Conference Room B',
      description: 'Weekly status meeting to review project progress and discuss any blockers.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2025-08-01T00:00:00Z'
    },
    {
      id: 'EVT-010',
      type: 'Deadline',
      title: 'Submit Monthly Payroll Report',
      date: '2025-08-12',
      time: '5:00 PM',
      endTime: '5:00 PM',
      isAllDay: false,
      description: 'Monthly payroll reports must be submitted to HR department by end of day.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2025-08-01T00:00:00Z'
    },
    {
      id: 'EVT-011',
      type: 'Holiday',
      title: 'Company Culture Day',
      date: '2025-08-13',
      isAllDay: true,
      location: 'Office & Virtual',
      description: 'Celebrating our company culture with team building activities, presentations, and appreciation events.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2025-08-01T00:00:00Z'
    },
    {
      id: 'EVT-012',
      type: 'Meeting',
      title: 'Design Review – Portal UI',
      date: '2025-08-14',
      time: '2:00 PM',
      endTime: '4:00 PM',
      isAllDay: false,
      location: 'Design Lab',
      description: 'Review and feedback session for the new portal UI designs with the development and UX teams.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2025-08-01T00:00:00Z'
    },
    {
      id: 'EVT-013',
      type: 'Deadline',
      title: 'Finalize Q3 Strategy Deck',
      date: '2025-08-15',
      time: '6:00 PM',
      endTime: '6:00 PM',
      isAllDay: false,
      description: 'Final submission deadline for Q3 strategy presentation deck to executive team.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2025-08-01T00:00:00Z'
    },
    {
      id: 'EVT-014',
      type: 'Meeting',
      title: 'HR & IT Joint Planning Session',
      date: '2025-08-18',
      time: '10:00 AM',
      endTime: '12:00 PM',
      isAllDay: false,
      location: 'Executive Conference Room',
      description: 'Strategic planning session between HR and IT departments for Q4 initiatives and system improvements.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2025-08-01T00:00:00Z'
    },
    {
      id: 'EVT-015',
      type: 'Holiday',
      title: 'Admin Appreciation Day',
      date: '2025-08-20',
      isAllDay: true,
      location: 'Office-wide',
      description: 'Dedicated day to appreciate and celebrate our administrative staff with special events and recognition.',
      createdBy: 'system',
      isPersonal: false,
      createdAt: '2025-08-01T00:00:00Z'
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