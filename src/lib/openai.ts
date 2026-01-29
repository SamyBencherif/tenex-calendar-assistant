import OpenAI from 'openai';

// Note: In a real app, you'd use an environment variable or a backend proxy.
// For this clone, we'll check for an API key in localStorage or prompt the user.
const getApiKey = () => {
  return import.meta.env.VITE_OPENAI_API_KEY || '';
};

export const createOpenAIClient = (apiKey) => {
  return new OpenAI({
    apiKey: apiKey || getApiKey(),
    dangerouslyAllowBrowser: true // Only for demo/clone purposes
  });
};

export const calendarTools = [
  {
    type: 'function',
    function: {
      name: 'create_event',
      description: 'Create a new calendar event',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The title of the event' },
          start: { type: 'string', description: 'ISO string for the start time' },
          end: { type: 'string', description: 'ISO string for the end time' },
          description: { type: 'string', description: 'Optional description' }
        },
        required: ['title', 'start', 'end']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_events',
      description: 'List all calendar events',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'delete_event',
      description: 'Delete a calendar event by ID',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The ID of the event to delete' }
        },
        required: ['id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'set_timezone',
      description: 'Set the target timezone for the calendar',
      parameters: {
        type: 'object',
        properties: {
          timezone: { 
            type: 'string', 
            description: 'The timezone identifier (e.g., "UTC", "America/New_York", "Europe/London", "Asia/Tokyo")' 
          }
        },
        required: ['timezone']
      }
    }
  }
];
