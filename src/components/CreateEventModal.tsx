import React, { useState } from 'react';
import { X, Clock, AlignLeft, Calendar, Trash2, Plus } from 'lucide-react';
import { format, addHours, startOfHour } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';

const CreateEventModal = ({ onClose }) => {
  const { addEvent } = useCalendar();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(startOfHour(addHours(new Date(), 1)), 'HH:mm'));
  const [endTime, setEndTime] = useState(format(startOfHour(addHours(new Date(), 2)), 'HH:mm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const start = new Date(`${date}T${startTime}:00`).toISOString();
    const end = new Date(`${date}T${endTime}:00`).toISOString();

    addEvent({
      title,
      start,
      end,
      color: 'bg-blue-500'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-[448px] overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <input
            autoFocus
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-normal border-b-2 border-transparent focus:border-blue-600 outline-none w-full pb-1 transition-colors"
          />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-gray-600">
              <Clock className="w-5 h-5" />
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="hover:bg-gray-100 p-1 rounded outline-none"
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="hover:bg-gray-100 p-1 rounded outline-none"
                />
                <span>–</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="hover:bg-gray-100 p-1 rounded outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm"
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
