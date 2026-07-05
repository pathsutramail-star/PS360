import React, { useState } from 'react';
import { X, Video, Link, Tag, Building2 } from 'lucide-react';
import { notify } from '../../../utils';

export interface Tour {
  id: string;
  name: string;
  type: string;
  property: string;
  views: string;
  status: string;
  date: string;
  imageUrl?: string;
  tourUrl?: string;
}

interface TourModalProps {
  tour?: Tour | null;
  propertyOptions: string[];
  onClose: () => void;
  onSave: (tour: Tour) => void;
}

export function TourModal({ tour, propertyOptions, onClose, onSave }: TourModalProps) {
  const isEditing = !!tour;
  
  const [formData, setFormData] = useState<Tour>({
    id: tour?.id || '',
    name: tour?.name || '',
    type: tour?.type || 'Room',
    property: tour?.property || propertyOptions[0] || '',
    views: tour?.views || '0',
    status: tour?.status || 'Draft',
    date: tour?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    imageUrl: tour?.imageUrl || '',
    tourUrl: tour?.tourUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.property || !formData.tourUrl) {
      notify('Please fill all required fields', 'error');
      return;
    }
    
    onSave({
      ...formData,
      id: isEditing ? formData.id : `T-${Math.floor(Math.random() * 1000) + 100}`,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">{isEditing ? 'Edit 360° Tour' : 'Upload New Tour'}</h3>
            <p className="text-sm text-gray-500 mt-1">{isEditing ? `Update details for ${tour?.name}` : 'Add a new virtual tour to a property'}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form id="tour-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Tag size={14} className="text-gray-400" /> Tour Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Presidential Suite 360"
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
                {propertyOptions.map(prop => (
                  <option key={prop} value={prop}>{prop}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tour Type *</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  <option value="Room">Room</option>
                  <option value="Lobby">Lobby</option>
                  <option value="Facility">Facility</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Exterior">Exterior</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status *</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Link size={14} className="text-gray-400" /> 360° Tour URL *</label>
              <input 
                type="text" 
                value={formData.tourUrl}
                onChange={e => setFormData({...formData, tourUrl: e.target.value})}
                placeholder="https://ps360.com/tour/xyz"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Paste the iframe or direct URL of the 360° virtual tour.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Video size={14} className="text-gray-400" /> Preview Image URL</label>
              <input 
                type="text" 
                value={formData.imageUrl || ''}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/preview.jpg"
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
            form="tour-form"
            className="flex-1 px-4 py-2.5 bg-[#689249] text-white rounded-xl font-semibold hover:bg-[#5a7d3f] transition-colors text-sm shadow-sm shadow-[#689249]/20"
          >
            {isEditing ? 'Save Changes' : 'Add Tour'}
          </button>
        </div>
      </div>
    </div>
  );
}
