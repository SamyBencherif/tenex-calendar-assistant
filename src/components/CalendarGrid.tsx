import React from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval, startOfDay, endOfDay, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';

const CalendarGrid = () => {
  const { currentDate, events, view } = useCalendar();

  const startDate = startOfWeek(currentDate);
  const weekDays = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 6),
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventStart = parseISO(event.start);
      return isSameDay(eventStart, day);
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header with day names */}
      <div className="flex border-b">
        <div className="w-16 border-r shrink-0" />
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, i) => (
            <div key={i} className="py-2 border-r last:border-r-0 flex flex-col items-center">
              <span className="text-[11px] font-medium text-gray-500 uppercase">
                {format(day, 'EEE')}
              </span>
              <span className={`
                text-2xl mt-1 w-10 h-10 flex items-center justify-center rounded-full
                ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : 'text-gray-700'}
              `}>
                {format(day, 'd')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex relative">
          {/* Time labels */}
          <div className="w-16 shrink-0 flex flex-col">
            {hours.map(hour => (
              <div key={hour} className="h-12 border-r text-[10px] text-gray-500 pr-2 text-right -mt-2">
                {hour === 0 ? '' : format(new Date().setHours(hour, 0), 'h a')}
              </div>
            ))}
          </div>

          {/* Grid lines and events */}
          <div className="flex-1 grid grid-cols-7 relative">
            {weekDays.map((day, dayIdx) => (
              <div key={dayIdx} className="relative border-r last:border-r-0">
                {hours.map(hour => (
                  <div key={hour} className="h-12 border-b border-gray-100" />
                ))}
                
                {/* Events for this day */}
                {getEventsForDay(day).map((event, eventIdx) => {
                  const start = parseISO(event.start);
                  const end = parseISO(event.end);
                  const top = (start.getHours() * 48) + (start.getMinutes() / 60 * 48);
                  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  const height = duration * 48;

                  return (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 rounded p-1 text-[10px] text-white overflow-hidden shadow-sm ${event.color || 'bg-blue-500'}`}
                      style={{ top: `${top}px`, height: `${height}px`, minHeight: '20px' }}
                    >
                      <div className="font-bold truncate">{event.title}</div>
                      <div className="truncate">
                        {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
