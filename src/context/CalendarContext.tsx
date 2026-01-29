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
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGisLoaded, setIsGisLoaded] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      console.log('Fetching events from Google Calendar...');
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
      console.log('Events fetched successfully:', formattedEvents.length);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }, []);

  // Poll for script availability
  useEffect(() => {
    const checkScripts = setInterval(() => {
      if (typeof gapi !== 'undefined' && !isGapiLoaded) {
        console.log('GAPI script detected');
        setIsGapiLoaded(true);
      }
      if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2 && !isGisLoaded) {
        console.log('Google Identity Services (GIS) script detected');
        setIsGisLoaded(true);
      }
    }, 500);

    return () => clearInterval(checkScripts);
  }, [isGapiLoaded, isGisLoaded]);

  useEffect(() => {
    const initializeGoogleApi = async () => {
      if (!isGapiLoaded || !isGisLoaded) return;

      try {
        console.log('Initializing GAPI client...');
        await initGapi();
        console.log('GAPI client initialized');
        
        console.log('Initializing GIS token client...');
        const client = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: async (response) => {
            console.log('GIS callback received:', response);
            if (response.error !== undefined) {
              console.error('GIS error:', response);
              throw response;
            }
            setIsAuthenticated(true);
            await fetchEvents();
          },
        });
        setTokenClient(client);
        console.log('GIS token client initialized');

        // Check if we have a token already
        const token = gapi.client.getToken();
        if (token) {
          console.log('Existing token found');
          setIsAuthenticated(true);
          await fetchEvents();
        }
      } catch (error) {
        console.error('Error during Google API initialization:', error);
      }
    };

    initializeGoogleApi();
  }, [isGapiLoaded, isGisLoaded, fetchEvents]);

  const signIn = () => {
    console.log('Sign In button clicked');
    if (tokenClient) {
      console.log('Requesting access token...');
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      console.error('Token client not initialized yet');
      alert('Google Calendar integration is still loading. Please try again in a moment.');
    }
  };

  const signOut = () => {
    console.log('Sign Out button clicked');
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken(null);
      setIsAuthenticated(false);
      setEvents([]);
      console.log('Signed out successfully');
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
