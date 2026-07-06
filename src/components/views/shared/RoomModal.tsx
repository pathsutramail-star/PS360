import React, { useState } from 'react';
import { X, BedDouble, Users, Building2, Tag, DollarSign } from 'lucide-react';
import { notify } from '../../../utils';

export interface Room {
  id: string;
  property: string;
  name: string;
  type: string;
  capacity: number;
  price: string;
  status: string;
  amenities: string[];
  imageUrl?: string;
}

interface RoomModalProps {
  room?: Room | null;
  propertyOptions: string[];
  onClose: () => void;
  onSave: (room: Room) => void;
}

export function RoomModal({ room, propertyOptions, onClose, onSave }: RoomModalProps) {
  const isEditing = !!room;
  
  const [formData, setFormData] = useState<Room>({
    id: room?.id || '',
    property: room?.property || (propertyOptions.length > 0 ? (propertyOptions[0] === 'All Properties' && propertyOptions.length > 1 ? propertyOptions[1] : propertyOptions[0]) : ''),
    name: room?.name || '',
    type: room?.type || 'Standard',
    capacity: room?.capacity || 2,
    price: room?.price || '',
    status: room?.status || 'Vacant Clean',
    amenities: room?.amenities || [],
    imageUrl: room?.imageUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.property || !formData.price) {
      notify('Please fill all required fields', 'error');
      return;
    }
    
    // Add prefix to price if missing
    let finalPrice = formData.price;
    if (!finalPrice.toLowerCase().startsWith('rs') && !finalPrice.toLowerCase().startsWith('npr')) {
      finalPrice = `Rs. ${finalPrice.replace(/[^0-9.]/g, '')}`;
    }

    onSave({
      ...formData,
      id: isEditing ? formData.id : `RM-${Math.floor(Math.random() * 1000) + 200}`,
      price: finalPrice
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">{isEditing ? 'Edit Room' : 'Add New Room'}</h3>
            <p className="text-sm text-gray-500 mt-1">{isEditing ? `Update details for ${room?.name}` : 'Create a new room listing'}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form id="room-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Tag size={14} className="text-gray-400" /> Room Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Deluxe Ocean View"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Building2 size={14} className="text-gray-400" /> Property *</label>
              <select 
                value={formData.property}
                onChange={e => setFormData({...formData, property: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              >
                {propertyOptions.filter(p => p !== 'All Properties').map(prop => (
                  <option key={prop} value={prop}>{prop}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Room Type *</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  <option value="Standard">Standard</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                  <option value="Family">Family</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status *</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  <option value="Vacant Clean">Vacant Clean</option>
                  <option value="Vacant Dirty">Vacant Dirty</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Users size={14} className="text-gray-400" /> Capacity</label>
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 2})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">Price *</label>
                <input 
                  type="text" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. Rs. 15000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">Image URL</label>
              <input 
                type="text" 
                value={formData.imageUrl || ''}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><BedDouble size={14} className="text-gray-400" /> Amenities (comma separated)</label>
              <input 
                type="text" 
                value={formData.amenities.join(', ')}
                onChange={e => setFormData({...formData, amenities: e.target.value.split(',').map(a => a.trim()).filter(a => a)})}
                placeholder="Air Conditioning, WiFi, Balcony..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
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
            form="room-form"
            className="flex-1 px-4 py-2.5 bg-[#689249] text-white rounded-xl font-semibold hover:bg-[#5a7d3f] transition-colors text-sm shadow-sm shadow-[#689249]/20"
          >
            {isEditing ? 'Save Changes' : 'Add Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
