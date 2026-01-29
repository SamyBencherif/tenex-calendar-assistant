import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';
import CreateEventModal from './CreateEventModal';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { currentDate, setCurrentDate } = useCalendar() as any;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.aside 
      initial={{ width: 0, opacity: 0, x: -20 }}
      animate={{ width: 256, opacity: 1, x: 0 }}
      exit={{ width: 0, opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border-r p-4 hidden md:flex flex-col gap-8 bg-white shrink-0 overflow-hidden whitespace-nowrap"
    >
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
                ${isSameDay(day, currentDate) && !isSameDay(day, new Date()) ? 'bg-blue-100 text-blue-700' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </motion.aside>
  );
};

export default Sidebar;
