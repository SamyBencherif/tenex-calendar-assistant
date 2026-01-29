const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export const initGapi = () => {
  return new Promise((resolve, reject) => {
    if (typeof gapi === 'undefined') {
      reject(new Error('GAPI not loaded'));
      return;
    }
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const listEvents = async (timeMin = new Date().toISOString()) => {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.result.items;
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
};

export const createEvent = async (event) => {
  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start,
        },
        end: {
          dateTime: event.end,
        },
      },
    });
    return response.result;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, event) => {
  try {
    const response = await gapi.client.calendar.events.patch({
      calendarId: 'primary',
      eventId: id,
      resource: {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start,
        },
        end: {
          dateTime: event.end,
        },
      },
    });
    return response.result;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    await gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: id,
    });
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
