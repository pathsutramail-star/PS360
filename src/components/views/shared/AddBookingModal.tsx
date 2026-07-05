import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { notify } from '../../../utils';

export interface BookingFormData {
  guestName: string;
  email: string;
  phone: string;
  property: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  amount: string;
  idDocument: File | null;
  isVerified: boolean;
}

interface AddBookingModalProps {
  onClose: () => void;
  onAdd?: (booking: BookingFormData) => void;
}

export function AddBookingModal({ onClose, onAdd }: AddBookingModalProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    property: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    amount: '',
    idDocument: null as File | null,
    isVerified: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || !formData.property || !formData.checkIn || !formData.checkOut) {
      notify('Please fill in all required fields', 'error');
      return;
    }
    if (!formData.idDocument) {
      notify('Please upload an ID document', 'error');
      return;
    }
    if (!formData.isVerified) {
      notify('Please verify the guest information', 'error');
      return;
    }

    onAdd?.(formData);
    notify('Booking added successfully!', 'success');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, idDocument: e.target.files[0] });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">Add New Booking</h3>
            <p className="text-sm text-gray-500 mt-1">Enter the booking details manually.</p>
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
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Guest Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Guest Name *</label>
                <input 
                  type="text" 
                  value={formData.guestName}
                  onChange={e => setFormData({...formData, guestName: e.target.value})}
                  placeholder="e.g. John Doe" 
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+977" 
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Stay Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Property *</label>
                <select 
                  value={formData.property}
                  onChange={e => setFormData({...formData, property: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]"
                >
                  <option value="">Select a property</option>
                  <option value="Grand Horizon Resort">Grand Horizon Resort</option>
                  <option value="City Central Hotel">City Central Hotel</option>
                  <option value="Oceanview Villa">Oceanview Villa</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Type</label>
                <select 
                  value={formData.roomType}
                  onChange={e => setFormData({...formData, roomType: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]"
                >
                  <option value="">Select room type</option>
                  <option value="Deluxe Double">Deluxe Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Standard Single">Standard Single</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-in Date *</label>
                <input 
                  type="date" 
                  value={formData.checkIn}
                  onChange={e => setFormData({...formData, checkIn: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-out Date *</label>
                <input 
                  type="date" 
                  value={formData.checkOut}
                  onChange={e => setFormData({...formData, checkOut: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Guests</label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.guests}
                  onChange={e => setFormData({...formData, guests: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Amount (NPR)</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="e.g. 15000"
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Identity Verification</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Official ID Document (Nagarikta / Passport / etc.) *</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  {formData.idDocument ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formData.idDocument.name}</span>
                      <span className="text-xs text-gray-500">Click to change file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                        <Upload size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Click to upload document</span>
                      <span className="text-xs text-gray-500">PNG, JPG or PDF (max. 5MB)</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2 flex items-start gap-3 mt-2">
                <div className="flex items-center h-5">
                  <input
                    id="verification"
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                    className="w-4 h-4 text-[#689249] bg-white border-gray-300 rounded focus:ring-[#689249] focus:ring-2"
                  />
                </div>
                <label htmlFor="verification" className="text-sm text-gray-600 leading-snug">
                  I confirm that I have verified the guest's official identification document and the details provided above are accurate. *
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium text-sm hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-[#689249] text-white font-medium text-sm hover:bg-[#557A3A] rounded-lg shadow-sm transition-colors"
            >
              Add Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
