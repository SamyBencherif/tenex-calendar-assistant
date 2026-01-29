import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Loader2, Key } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCalendar } from '../context/CalendarContext';
import { createOpenAIClient, calendarTools } from '../lib/openai';
import { format } from 'date-fns';

const ChatAssistant = () => {
  const { addEvent, deleteEvent, events, updateEvent, isAuthenticated } = useCalendar() as any;
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your calendar assistant. I can help you schedule, delete, or list your events.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processAIResponse = async (userInput) => {
    const client = createOpenAIClient();
    const systemPrompt = `You are a helpful calendar assistant. Today is ${format(new Date(), 'eeee, MMMM do, yyyy')}. 
    When creating events, use ISO strings for dates. If the user doesn't specify a year, assume it's 2026.
    Current events: ${JSON.stringify(events)}`;

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.filter(m => m.role !== 'system'),
          { role: 'user', content: userInput }
        ],
        tools: calendarTools,
        tool_choice: 'auto',
      });

      const message = response.choices[0].message;

      if (message.tool_calls) {
        const toolMessages = [...messages, { role: 'user', content: userInput }, message];
        
        for (const toolCall of message.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments);
          let result = '';

          if (toolCall.function.name === 'create_event') {
            const newEvent = await addEvent(args);
            if (newEvent) {
              result = `Created event: ${newEvent.title} at ${format(new Date(newEvent.start), 'PPp')}`;
            } else {
              result = `Failed to create event. Please make sure you are signed in with Google.`;
            }
          } else if (toolCall.function.name === 'list_events') {
            result = isAuthenticated 
              ? `You have ${events.length} events: ${events.map(e => e.title).join(', ')}`
              : `I can't list your events because you're not signed in with Google. Please sign in using the button in the header.`;
          } else if (toolCall.function.name === 'delete_event') {
            await deleteEvent(args.id);
            result = `Deleted event with ID: ${args.id}`;
          }

          toolMessages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: toolCall.function.name,
            content: result,
          });
        }

        const finalResponse = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: systemPrompt }, ...toolMessages],
        });

        return finalResponse.choices[0].message;
      }

      return message;
    } catch (error) {
      console.error('AI Error:', error);
      return { role: 'assistant', content: 'Sorry, I encountered an error processing your request. Please check your API key.' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await processAIResponse(input);
    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  return (
    <aside className="w-80 border-l bg-white flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-gray-700">AI Assistant</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.filter(m => m.role !== 'system' && m.content).map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm prose prose-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              <ReactMarkdown 
                components={{
                  p: ({node, ...props}) => <p className="m-0" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                  em: ({node, ...props}) => <em className="italic" {...props} />,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to schedule something..."
            className="w-full pl-4 pr-10 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 disabled:text-gray-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ChatAssistant;
