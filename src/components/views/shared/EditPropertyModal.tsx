import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Star } from 'lucide-react';
import { Property } from '../../../models/types';
import { notify } from '../../../utils';

interface EditPropertyModalProps {
  property: Property;
  onClose: () => void;
  onSave: (updatedProperty: Property) => void;
}

export function EditPropertyModal({ property, onClose, onSave }: EditPropertyModalProps) {
  const [formData, setFormData] = useState<Property>({ ...property });

  useEffect(() => {
    setFormData({ ...property });
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.location) {
      notify('Please fill all required fields', 'error');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">Edit Property Details</h3>
            <p className="text-sm text-gray-500 mt-1">Update information for {property.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form id="edit-property-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Building2 size={14} className="text-gray-400" /> Property Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Building2 size={14} className="text-gray-400" /> Property Type *</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Villa">Villa</option>
                  <option value="Café">Café</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status *</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> Location *</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Star size={14} className="text-gray-400" /> Rating (0-5)</label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Facilities (comma separated)</label>
              <input 
                type="text" 
                value={formData.facilities?.join(', ') || ''}
                onChange={e => setFormData({...formData, facilities: e.target.value.split(',').map(f => f.trim()).filter(f => f)})}
                placeholder="WiFi, Pool, Spa..."
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
            form="edit-property-form"
            className="flex-1 px-4 py-2.5 bg-[#689249] text-white rounded-xl font-semibold hover:bg-[#5a7d3f] transition-colors text-sm shadow-sm shadow-[#689249]/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
