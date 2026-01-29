import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';
import CreateEventModal from './CreateEventModal';

const Sidebar = () => {
  const { currentDate, setCurrentDate } = useCalendar();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <aside className="w-64 border-r p-4 hidden md:flex flex-col gap-8 bg-white shrink-0">
      <button 
        onClick={() => setShowCreateModal(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-full shadow-md border hover:shadow-lg transition-shadow w-fit"
      >
        <Plus className="w-6 h-6 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Create</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-gray-700">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </div>
        
        <div className="grid grid-cols-7 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <span key={i} className="text-[10px] font-medium text-gray-500 py-1">
              {day}
            </span>
          ))}
          {calendarDays.map((day, i) => (
            <button
              key={i}
              onClick={() => setCurrentDate(day)}
              className={`
                text-[11px] py-1.5 rounded-full hover:bg-gray-100 transition-colors
                ${!isSameMonth(day, monthStart) ? 'text-gray-400' : 'text-gray-700'}
                ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider px-2">
          My Calendars
        </h3>
        <div className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
          <input type="checkbox" checked readOnly className="w-4 h-4 rounded text-blue-600" />
          <span className="text-sm text-gray-700">Samy B</span>
        </div>
      </div>

      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </aside>
  );
};

export default Sidebar;
