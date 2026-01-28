import React, { createContext, useContext, useState, useEffect } from 'react';
import { addHours, startOfToday, format } from 'date-fns';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar-events');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Welcome Event',
        start: addHours(startOfToday(), 10).toISOString(),
        end: addHours(startOfToday(), 11).toISOString(),
        description: 'Welcome to your new calendar!',
        color: 'bg-blue-500'
      }
    ];
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      color: event.color || 'bg-blue-500'
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, updatedFields) => {
    setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, ...updatedFields } : evt));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
  };

  return (
    <CalendarContext.Provider value={{
      events,
      currentDate,
      setCurrentDate,
      view,
      setView,
      addEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </CalendarContext.Provider>
  );
};
