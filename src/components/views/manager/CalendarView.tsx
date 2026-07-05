import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { notify } from '../../../utils';

export function CalendarView() {
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate().toString());
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'booking' });

  // Mock global events
  const [events, setEvents] = useState<Record<string, Array<{title: string, time: string, type: string}>>>({
    '9': [
      { title: 'VIP Arrival: John Doe', time: '14:00 - 15:00', type: 'booking' },
      { title: 'Staff Meeting', time: '16:00 - 17:00', type: 'internal' }
    ],
    '15': [
      { title: 'Maintenance: Pool', time: '08:00 - 12:00', type: 'maintenance' }
    ]
  });

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.time) {
      const dayEvents = events[selectedDate] || [];
      setEvents({
        ...events,
        [selectedDate]: [...dayEvents, { ...newEvent }]
      });
      notify('Event added successfully', 'success');
      setIsAddEventModalOpen(false);
      setNewEvent({ title: '', time: '', type: 'booking' });
    }
  };

  const getEventStyle = (type: string) => {
    switch(type) {
      case 'booking': return { bg: 'bg-emerald-50', border: 'bg-emerald-500' };
      case 'internal': return { bg: 'bg-blue-50', border: 'bg-blue-500' };
      case 'maintenance': return { bg: 'bg-amber-50', border: 'bg-amber-500' };
      default: return { bg: 'bg-gray-50', border: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Calendar</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">View all events, bookings, and shifts.</p>
        </div>
        <button 
          onClick={() => setIsAddEventModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">{MONTHS[calendarMonth]} {calendarYear}</h2>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-sm font-bold text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="p-4 rounded-xl text-gray-300 font-medium text-center bg-gray-50/50">
                {new Date(calendarYear, calendarMonth, 0).getDate() - new Date(calendarYear, calendarMonth, 1).getDay() + i + 1}
              </div>
            ))}
            
            {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, i) => {
              const day = (i + 1).toString();
              const hasEvents = events[day];
              const isSelected = selectedDate === day;
              
              return (
                <div 
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[80px] flex flex-col items-center justify-center
                    ${isSelected ? 'border-[#689249] bg-[#689249]/5' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <span className={`text-lg font-bold ${isSelected ? 'text-[#689249]' : 'text-gray-700'}`}>{day}</span>
                  
                  {hasEvents && (
                    <div className="flex gap-1 mt-2">
                      {hasEvents.map((_, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#689249]"></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="rounded-2xl shadow-sm border-gray-100 p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Events for {MONTHS[calendarMonth]} {selectedDate}</h3>
          
          <div className="space-y-4 flex-1">
            {events[selectedDate] ? (
              events[selectedDate].map((event, i) => {
                const style = getEventStyle(event.type);
                return (
                  <div key={i} className={`flex overflow-hidden rounded-xl ${style.bg}`}>
                    <div className={`w-1.5 ${style.border}`}></div>
                    <div className="p-4 flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-sm font-semibold text-gray-500">{event.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-300 font-bold text-xl">{selectedDate}</span>
                </div>
                <p className="text-gray-500 font-medium">No events scheduled.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {isAddEventModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Add Event for {selectedDate} {MONTHS[calendarMonth]}</h2>
              <button 
                onClick={() => setIsAddEventModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
                  <input 
                    type="text" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. VIP Arrival"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time Range</label>
                  <input 
                    type="text" 
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. 14:00 - 15:00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  >
                    <option value="booking">Booking</option>
                    <option value="internal">Internal Meeting</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
