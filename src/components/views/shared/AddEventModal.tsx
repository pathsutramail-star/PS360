import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, AlignLeft } from 'lucide-react';
import { notify } from '../../../utils';

interface AddEventModalProps {
  onClose: () => void;
  selectedDate?: string;
  selectedMonth?: string;
  onAdd?: (event: { title: string; time: string; color: string; bg: string; location?: string; description?: string }) => void;
}

export function AddEventModal({ onClose, selectedDate, selectedMonth, onAdd }: AddEventModalProps) {
  const timeOptions = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
  ];

  const locationOptions = [
    'Main Hall', 'Grand Ballroom', 'Rooftop Terrace', 'Conference Room', 'Restaurant', 'Cafe', 'Poolside', 'Spa Lounge'
  ];

  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate && selectedMonth ? `${selectedMonth} ${selectedDate}, 2024` : '',
    time: timeOptions[0],
    location: locationOptions[0],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) {
      notify('Please fill in all required fields', 'error');
      return;
    }

    onAdd?.({
      title: formData.title,
      time: formData.time,
      color: 'bg-[#689249]',
      bg: 'bg-[#689249]/10',
      location: formData.location || undefined,
      description: formData.description || undefined,
    });

    notify('Event added successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">Add New Event</h3>
            <p className="text-sm text-gray-500 mt-1">Schedule a new event for the property.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                placeholder="e.g. Business Conference"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> Date *</label>
                <input 
                  type="text" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                  placeholder="e.g. June 15, 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Clock size={14} className="text-gray-400" /> Time *</label>
                <select
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  {timeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> Location</label>
              <select
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              >
                {locationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><AlignLeft size={14} className="text-gray-400" /> Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm resize-none h-24"
                placeholder="Optional details about the event..."
              ></textarea>
            </div>
          </div>
          
          <div className="pt-2 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#689249] text-white rounded-xl font-semibold hover:bg-[#5a7d3f] transition-colors text-sm shadow-sm shadow-[#689249]/20"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
