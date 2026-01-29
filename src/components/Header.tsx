import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, Search, HelpCircle, Settings, Grid, LogIn, LogOut, X } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { currentDate, setCurrentDate, view, setView, isAuthenticated, signIn, signOut, isSidebarOpen, setIsSidebarOpen, events } = useCalendar() as any;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 shrink-0 bg-white relative z-[110]">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_28_2x.png" className="w-8 h-8" alt="Calendar" />
          <span className="text-xl text-gray-600 font-normal">Calendar</span>
        </div>
        
        <div className="flex items-center gap-1 ml-8">
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-1.5 border rounded text-sm font-medium hover:bg-gray-50"
          >
            Today
          </button>
          <div className="flex items-center gap-0.5 ml-2">
            <button 
              onClick={() => {
                if (view === 'month') setCurrentDate(prev => subMonths(prev, 1));
                else if (view === 'week') setCurrentDate(prev => subWeeks(prev, 1));
                else setCurrentDate(prev => subDays(prev, 1));
              }}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => {
                if (view === 'month') setCurrentDate(prev => addMonths(prev, 1));
                else if (view === 'week') setCurrentDate(prev => addWeeks(prev, 1));
                else setCurrentDate(prev => addDays(prev, 1));
              }}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <h2 className="text-xl text-gray-600 ml-2">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 relative" ref={searchRef}>
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 rounded-lg flex items-center px-3 py-1.5"
              >
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  autoFocus
                  placeholder="Search events"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                  <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                </button>

                {searchQuery && (
                  <div className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-lg shadow-xl border max-h-[400px] overflow-y-auto z-[120]">
                    {filteredEvents.length > 0 ? (
                      <div className="py-2">
                        {filteredEvents.map(event => (
                          <button
                            key={event.id}
                            onClick={() => {
                              setCurrentDate(new Date(event.start));
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex flex-col gap-0.5 border-b last:border-b-0"
                          >
                            <span className="text-sm font-medium text-gray-900">{event.title}</span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(event.start), 'MMM d, yyyy • h:mm a')}
                            </span>
                            {event.location && (
                              <span className="text-[10px] text-gray-400 truncate">{event.location}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No events found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </AnimatePresence>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <select 
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="ml-4 border rounded px-3 py-1.5 text-sm font-medium outline-none hover:bg-gray-50 cursor-pointer"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <div className="flex items-center gap-2 ml-4">
          {isAuthenticated ? (
            <button 
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <button 
              onClick={signIn}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Grid className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            S
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
