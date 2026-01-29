import React, { useState } from 'react';
import { X, Clock, Users, MapPin, AlignLeft, Globe, Menu } from 'lucide-react';
import { format, addHours, startOfHour, parse } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';

const CreateEventModal = ({ onClose }: { onClose: () => void }) => {
  const { addEvent } = useCalendar();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(startOfHour(addHours(new Date(), 1)), 'HH:mm'));
  const [endTime, setEndTime] = useState(format(startOfHour(addHours(new Date(), 2)), 'HH:mm'));
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    // Ensure we use the date and time correctly
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    await addEvent({
      title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      location,
      description,
      color: 'bg-blue-500'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] text-gray-200 rounded-2xl shadow-2xl w-[448px] overflow-hidden border border-gray-800">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <button type="button" className="p-2 hover:bg-gray-800 rounded-lg">
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-5">
          <div className="relative group">
            <input
              autoFocus
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-normal bg-transparent border-b border-gray-700 focus:border-blue-400 outline-none w-full pb-1 transition-colors placeholder-gray-500"
            />
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {/* Time and Date */}
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  {isEditingDate ? (
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      onBlur={() => setIsEditingDate(false)}
                      autoFocus
                      className="bg-gray-800 text-gray-200 px-2 py-1 rounded outline-none border border-gray-700 focus:border-blue-400"
                    />
                  ) : (
                    <span 
                      onClick={() => setIsEditingDate(true)}
                      className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      {format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM d')}
                    </span>
                  )}

                  {isEditingTime ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded outline-none border border-gray-700 focus:border-blue-400 w-20"
                      />
                      <span>–</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        onBlur={() => setIsEditingTime(false)}
                        className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded outline-none border border-gray-700 focus:border-blue-400 w-20"
                      />
                    </div>
                  ) : (
                    <span 
                      onClick={() => setIsEditingTime(true)}
                      className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      {startTime} – {endTime}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 ml-2">
                  <span>Time zone</span>
                  <span>•</span>
                  <span>Does not repeat</span>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-4">
              <Users className="w-5 h-5 text-gray-400" />
              <input
                placeholder="Add guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bg-transparent text-sm outline-none w-full py-1 hover:bg-gray-800/50 px-2 rounded transition-colors placeholder-gray-500"
              />
            </div>

            {/* Google Meet */}
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
              </div>
              <button type="button" className="text-sm text-gray-300 hover:bg-gray-800/50 px-2 py-1 rounded transition-colors w-full text-left">
                Add Google Meet video conferencing
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-sm outline-none w-full py-1 hover:bg-gray-800/50 px-2 rounded transition-colors placeholder-gray-500"
              />
            </div>

            {/* Description */}
            <div className="flex items-center gap-4">
              <AlignLeft className="w-5 h-5 text-gray-400" />
              <input
                placeholder="Add description or a Google Drive attachment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent text-sm outline-none w-full py-1 hover:bg-gray-800/50 px-2 rounded transition-colors placeholder-gray-500"
              />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Samy Bencherif</span>
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500">
                  Busy • Default visibility • Notify when event starts
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              More options
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 text-sm font-medium text-black bg-[#8ab4f8] hover:bg-[#aecbfa] rounded-full shadow-sm transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEventModal;
