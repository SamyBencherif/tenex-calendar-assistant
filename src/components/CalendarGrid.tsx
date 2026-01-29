import React from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval, startOfDay, endOfDay, isSameDay, parseISO, startOfMonth, endOfMonth, endOfWeek, isSameMonth } from 'date-fns';
import { toZonedTime, format as formatTz } from 'date-fns-tz';
import { useCalendar } from '../context/CalendarContext';

const CalendarGrid = () => {
  const { currentDate, events, view, timezone } = useCalendar() as any;

  const startDate = view === 'day' ? startOfDay(currentDate) : startOfWeek(currentDate);
  const endDate = view === 'day' ? endOfDay(currentDate) : addDays(startDate, 6);
  
  const displayDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const monthDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day, allDay = false) => {
    return events.filter(event => {
      const eventStart = toZonedTime(parseISO(event.start), timezone);
      const isSameDayEvent = isSameDay(eventStart, day);
      return isSameDayEvent && (allDay ? event.isAllDay : !event.isAllDay);
    });
  };

  if (view === 'month') {
    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-[11px] font-medium text-gray-500 uppercase border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-y-auto">
          {monthDays.map((day, i) => (
            <div key={i} className={`min-h-[100px] border-r border-b p-1 flex flex-col gap-1 ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : ''}`}>
              <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ml-auto ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px]">
                {getEventsForDay(day, true).concat(getEventsForDay(day, false)).map(event => {
                  const eventStart = toZonedTime(parseISO(event.start), timezone);
                  return (
                    <div
                      key={event.id}
                      className={`rounded px-1.5 py-0.5 text-[10px] text-white truncate shadow-sm shrink-0 ${event.color || 'bg-blue-500'}`}
                    >
                      {event.isAllDay ? event.title : `${formatTz(eventStart, 'HH:mm', { timeZone: timezone })} ${event.title}`}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header with day names and all-day events */}
      <div className="flex border-b flex-col">
        <div className="flex">
          <div className="w-16 border-r shrink-0" />
          <div className={`flex-1 grid ${view === 'day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
            {displayDays.map((day, i) => (
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
        
        {/* All-day events section */}
        <div className="flex border-t">
          <div className="w-16 border-r shrink-0 flex items-end justify-end pb-1 pr-2">
            <span className="text-[10px] text-gray-500">all-day</span>
          </div>
          <div className={`flex-1 grid ${view === 'day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
            {displayDays.map((day, i) => (
              <div key={i} className="min-h-[24px] border-r last:border-r-0 p-1 flex flex-col gap-1">
                {getEventsForDay(day, true).map(event => (
                  <div
                    key={event.id}
                    className={`rounded px-2 py-0.5 text-[10px] text-white truncate shadow-sm ${event.color || 'bg-blue-500'}`}
                    style={{ height: '20px' }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex relative">
          {/* Time labels */}
          <div className="w-16 shrink-0 flex flex-col">
            {hours.map(hour => (
              <div key={hour} className="h-12 border-r text-[10px] text-gray-500 pr-2 text-right -mt-2">
                {hour === 0 ? '' : formatTz(toZonedTime(new Date().setHours(hour, 0, 0, 0), timezone), 'h a', { timeZone: timezone })}
              </div>
            ))}
          </div>

          {/* Grid lines and events */}
          <div className={`flex-1 grid ${view === 'day' ? 'grid-cols-1' : 'grid-cols-7'} relative`}>
            {displayDays.map((day, dayIdx) => (
              <div key={dayIdx} className="relative border-r last:border-r-0">
                {hours.map(hour => (
                  <div key={hour} className="h-12 border-b border-gray-100" />
                ))}
                
                {/* Events for this day */}
                {getEventsForDay(day).map((event, eventIdx) => {
                  const start = toZonedTime(parseISO(event.start), timezone);
                  const end = toZonedTime(parseISO(event.end), timezone);
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
                        {formatTz(start, 'h:mm a', { timeZone: timezone })} - {formatTz(end, 'h:mm a', { timeZone: timezone })}
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
