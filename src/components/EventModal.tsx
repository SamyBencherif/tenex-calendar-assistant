import React, { useState } from 'react';
import { X, Clock, AlignLeft, Calendar, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';

const EventModal = ({ event, onClose }) => {
  const { deleteEvent, updateEvent } = useCalendar();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event.title);

  const start = parseISO(event.start);
  const end = parseISO(event.end);

  const handleDelete = async () => {
    await deleteEvent(event.id);
    onClose();
  };

  const handleUpdate = async () => {
    await updateEvent(event.id, { title });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[448px] overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleDelete} className="p-2 hover:bg-gray-200 rounded-full text-gray-600">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-4 h-4 rounded mt-1.5 ${event.color || 'bg-blue-500'}`} />
            <div className="flex-1">
              {isEditing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdate}
                  autoFocus
                  className="text-2xl font-normal border-b border-blue-600 outline-none w-full"
                />
              ) : (
                <h2 
                  onClick={() => setIsEditing(true)}
                  className="text-2xl font-normal text-gray-800 cursor-pointer hover:bg-gray-50 px-1 -ml-1 rounded"
                >
                  {event.title}
                </h2>
              )}
              <div className="text-sm text-gray-600 mt-1">
                {format(start, 'EEEE, MMMM d')} ⋅ {format(start, 'h:mm a')} – {format(end, 'h:mm a')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">30 minutes before</span>
          </div>

          {event.description && (
            <div className="flex items-start gap-4 text-gray-600">
              <AlignLeft className="w-5 h-5 mt-0.5" />
              <div className="text-sm whitespace-pre-wrap">{event.description}</div>
            </div>
          )}

          <div className="flex items-center gap-4 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Samy B</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
