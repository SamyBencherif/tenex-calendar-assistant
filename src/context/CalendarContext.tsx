import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addHours, startOfToday } from 'date-fns';
import { initGapi, listEvents, createEvent as apiCreateEvent, updateEvent as apiUpdateEvent, deleteEvent as apiDeleteEvent } from '../lib/googleCalendar';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const apiEvents = await listEvents();
      const formattedEvents = apiEvents.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description,
        color: 'bg-blue-500' // Default color
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }, []);

  useEffect(() => {
    const initializeGoogleApi = async () => {
      try {
        await initGapi();
        
        const client = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: async (response) => {
            if (response.error !== undefined) {
              throw response;
            }
            setIsAuthenticated(true);
            await fetchEvents();
          },
        });
        setTokenClient(client);

        // Check if we have a token already (e.g. from session)
        const token = gapi.client.getToken();
        if (token) {
          setIsAuthenticated(true);
          await fetchEvents();
        }
      } catch (error) {
        console.error('Error initializing Google API:', error);
      }
    };

    if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
      initializeGoogleApi();
    }
  }, [fetchEvents]);

  const signIn = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  };

  const signOut = () => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken(null);
      setIsAuthenticated(false);
      setEvents([]);
    }
  };

  const addEvent = async (event) => {
    if (!isAuthenticated) return;
    try {
      const createdEvent = await apiCreateEvent(event);
      const newEvent = {
        id: createdEvent.id,
        title: createdEvent.summary,
        start: createdEvent.start.dateTime || createdEvent.start.date,
        end: createdEvent.end.dateTime || createdEvent.end.date,
        description: createdEvent.description,
        color: event.color || 'bg-blue-500'
      };
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (id, updatedFields) => {
    if (!isAuthenticated) return;
    try {
      const eventToUpdate = events.find(e => e.id === id);
      const mergedEvent = { ...eventToUpdate, ...updatedFields };
      const updatedEvent = await apiUpdateEvent(id, mergedEvent);
      
      setEvents(prev => prev.map(evt => evt.id === id ? {
        ...evt,
        title: updatedEvent.summary,
        start: updatedEvent.start.dateTime || updatedEvent.start.date,
        end: updatedEvent.end.dateTime || updatedEvent.end.date,
        description: updatedEvent.description,
      } : evt));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (id) => {
    if (!isAuthenticated) return;
    try {
      await apiDeleteEvent(id);
      setEvents(prev => prev.filter(evt => evt.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
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
      deleteEvent,
      isAuthenticated,
      signIn,
      signOut
    }}>
      {children}
    </CalendarContext.Provider>
  );
};
