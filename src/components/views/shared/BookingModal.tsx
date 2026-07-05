import React, { useState } from 'react';
import { X, Calendar, User, Building2, CreditCard } from 'lucide-react';
import { notify } from '../../../utils';

export interface Booking {
  id: string;
  guest: string;
  property: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: string;
}

interface BookingModalProps {
  booking?: Booking | null;
  propertyOptions: string[];
  onClose: () => void;
  onSave: (booking: Booking) => void;
}

export function BookingModal({ booking, propertyOptions, onClose, onSave }: BookingModalProps) {
  const isEditing = !!booking;
  
  const [formData, setFormData] = useState<Booking>({
    id: booking?.id || '',
    guest: booking?.guest || '',
    property: booking?.property || (propertyOptions.length > 0 ? propertyOptions[0] : ''),
    room: booking?.room || '',
    checkIn: booking?.checkIn || '',
    checkOut: booking?.checkOut || '',
    status: booking?.status || 'Confirmed',
    amount: booking?.amount || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guest || !formData.property || !formData.room || !formData.checkIn || !formData.checkOut || !formData.amount) {
      notify('Please fill all required fields', 'error');
      return;
    }
    
    // Add prefix to price if missing
    let finalAmount = formData.amount;
    if (!finalAmount.toLowerCase().startsWith('rs') && !finalAmount.toLowerCase().startsWith('npr')) {
      finalAmount = `Rs. ${finalAmount.replace(/[^0-9.]/g, '')}`;
    }

    onSave({
      ...formData,
      id: isEditing ? formData.id : `BK-${Math.floor(Math.random() * 10000) + 1000}`,
      amount: finalAmount
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">{isEditing ? 'Edit Booking' : 'Add New Booking'}</h3>
            <p className="text-sm text-gray-500 mt-1">{isEditing ? `Update details for ${booking?.id}` : 'Create a new reservation manually'}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><User size={14} className="text-[#689249]" /> Guest Name *</label>
              <input 
                type="text" 
                value={formData.guest}
                onChange={e => setFormData({...formData, guest: e.target.value})}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Building2 size={14} className="text-[#689249]" /> Property *</label>
                <select 
                  value={formData.property}
                  onChange={e => setFormData({...formData, property: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  {propertyOptions.map(prop => (
                    <option key={prop} value={prop}>{prop}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Room Type/Name *</label>
                <input 
                  type="text" 
                  value={formData.room}
                  onChange={e => setFormData({...formData, room: e.target.value})}
                  placeholder="e.g. Deluxe Suite"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Calendar size={14} className="text-[#689249]" /> Check-In *</label>
                <input 
                  type="text" 
                  value={formData.checkIn}
                  onChange={e => setFormData({...formData, checkIn: e.target.value})}
                  placeholder="e.g. Oct 24, 2023"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Calendar size={14} className="text-[#689249]" /> Check-Out *</label>
                <input 
                  type="text" 
                  value={formData.checkOut}
                  onChange={e => setFormData({...formData, checkOut: e.target.value})}
                  placeholder="e.g. Oct 28, 2023"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status *</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-in">Checked-in</option>
                  <option value="Checked-out">Checked-out</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><CreditCard size={14} className="text-[#689249]" /> Amount *</label>
                <input 
                  type="text" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="e.g. Rs. 45000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                />
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="booking-form"
            className="flex-1 px-4 py-2.5 bg-[#689249] text-white rounded-xl font-semibold hover:bg-[#5a7d3f] transition-colors text-sm shadow-sm shadow-[#689249]/20"
          >
            {isEditing ? 'Save Changes' : 'Add Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
