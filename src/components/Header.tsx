import React from 'react';
import { Menu, ChevronLeft, ChevronRight, Search, HelpCircle, Settings, Grid } from 'lucide-react';
import { format, addMonths, subMonths, startOfToday } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';

const Header = () => {
  const { currentDate, setCurrentDate, view, setView } = useCalendar();

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
              onClick={() => setCurrentDate(prev => subMonths(prev, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setCurrentDate(prev => addMonths(prev, 1))}
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
