import React from 'react';
import { Menu, ChevronLeft, ChevronRight, Search, HelpCircle, Settings, Grid, LogIn, LogOut } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';

const Header = () => {
  const { currentDate, setCurrentDate, view, setView, isAuthenticated, signIn, signOut } = useCalendar() as any;

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 shrink-0 bg-white">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
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
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
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
