import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, MapPin, Star, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Property } from '../../../models/types';
import { notify } from '../../../utils';
import { View } from '../../../models/types';
import { AddPropertyWizard } from '../shared/AddPropertyWizard';
import { EditPropertyModal } from '../shared/EditPropertyModal';

const defaultProperties: Property[] = [

  { id: '1', name: 'Grand Horizon Resort', type: 'Resort', location: 'Pokhara, Nepal', rating: 4.8, status: 'Active', totalRooms: 120, activeBookings: 85, facilities: ['Pool', 'Spa', 'Gym', 'Restaurant'] },
  { id: '2', name: 'City Central Hotel', type: 'Hotel', location: 'Kathmandu, Nepal', rating: 4.5, status: 'Active', totalRooms: 85, activeBookings: 60, facilities: ['WiFi', 'Conference Room', 'Restaurant'] },
  { id: '3', name: 'Oceanview Villa', type: 'Villa', location: 'Lakeside, Pokhara', rating: 4.9, status: 'Active', totalRooms: 12, activeBookings: 10, facilities: ['Private Pool', 'Kitchen', 'WiFi', 'Parking'] },
  { id: '4', name: 'Himalayan Café', type: 'Café', location: 'Thamel, Kathmandu', rating: 4.6, status: 'Maintenance', totalRooms: 0, activeBookings: 0, facilities: ['WiFi', 'Outdoor Seating', 'Live Music'] },
];

interface PropertiesProps {
  setCurrentView?: (view: View) => void;
  setSelectedPropertyForRooms?: (property: string) => void;
}

export function Properties({ setCurrentView, setSelectedPropertyForRooms }: PropertiesProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>(defaultProperties);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Filters state
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || prop.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || prop.type === typeFilter;
    const matchesLocation = locationFilter === 'All Locations' || prop.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Properties</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage your hotels, resorts, and restaurants.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg shadow-sm hover:bg-[#557A3A] font-medium text-sm transition-all"
        >
          <Plus size={16} />
          Add Property
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400 group-focus-within:text-[#689249] transition-colors" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties by name, location, or type..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all shadow-sm placeholder:text-gray-400 font-medium text-gray-900"
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm shadow-sm transition-all ${isFilterOpen ? 'border-[#689249] bg-[#689249]/5' : 'border-gray-200 bg-white'}`}
        >
          <Filter size={16} className={isFilterOpen ? 'text-[#689249]' : 'text-gray-500'} />
          Filter
        </button>
      </div>

      {isFilterOpen && (
        <Card className="p-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Property Type</label>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]"
              >
                <option>All Types</option>
                <option>Resort</option>
                <option>Hotel</option>
                <option>Villa</option>
                <option>Café</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</label>
              <select 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]"
              >
                <option>All Locations</option>
                <option>Pokhara</option>
                <option>Kathmandu</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => {
                setStatusFilter('All Statuses');
                setTypeFilter('All Types');
                setLocationFilter('All Locations');
                notify('Filters reset', 'info');
              }}
              className="text-sm font-medium text-gray-600 px-4 py-2 mr-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={() => {
                notify('Filters applied', 'success');
                setIsFilterOpen(false);
              }}
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property, index) => {
          // Generate a unique gradient based on index and property type
          const gradients = [
            'from-blue-900/80 to-blue-600/60',
            'from-emerald-900/80 to-teal-700/60',
            'from-orange-900/80 to-rose-700/60',
            'from-indigo-900/80 to-purple-700/60',
          ];
          const bgGradient = gradients[index % gradients.length];
          
          const getPropertyImage = (type: string, idx: number) => {
            const images = {
              'Hotel': [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1551882547-ff40eb0d1556?auto=format&fit=crop&w=800&q=80'
              ],
              'Resort': [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'
              ],
              'Villa': [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
              ],
              'Café': [
                'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=80'
              ]
            };
            const typeImages = images[type as keyof typeof images] || images['Hotel'];
            return typeImages[idx % typeImages.length];
          };
          
          return (
            <Card key={property.id} className="group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white relative border border-gray-100 shadow-sm hover:shadow-md overflow-hidden">
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img 
                  src={getPropertyImage(property.type, index)} 
                  alt={property.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-4">
                  <span className="text-white font-medium bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-md text-xs border border-white/20">
                    {property.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3 z-20">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === property.id ? null : property.id)}
                    className="p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-gray-700 hover:bg-white hover:text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeMenu === property.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in zoom-in duration-200">
                      <button 
                        onClick={() => {
                          setSelectedProperty(property);
                          setIsEditModalOpen(true);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Edit Details
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedProperty(property);
                          setIsDeleteModalOpen(true);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold font-display text-gray-900 truncate pr-2 group-hover:text-[#689249] transition-colors">{property.name}</h3>
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded text-xs font-semibold shadow-sm shrink-0">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    {property.rating}
                  </div>
                </div>
                
                <div className="flex items-center text-sm font-medium text-gray-500 mb-4">
                  <MapPin size={14} className="mr-1.5 text-gray-400 shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100 mt-auto">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Rooms</div>
                    <div className="font-semibold text-gray-900">{property.totalRooms > 0 ? property.totalRooms : '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Bookings</div>
                    <div className="font-semibold text-gray-900">{property.activeBookings > 0 ? property.activeBookings : '-'}</div>
                  </div>
                </div>

                {property.facilities && property.facilities.length > 0 && (
                  <div className="py-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1.5">
                      {property.facilities.slice(0, 3).map((facility, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] font-semibold border border-gray-100">
                          {facility}
                        </span>
                      ))}
                      {property.facilities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] font-semibold border border-gray-100">
                          +{property.facilities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${
                    property.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      property.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'
                    }`}></span>
                    {property.status}
                  </span>
                  
                  <button 
                    onClick={() => {
                      notify(`Opening rooms for ${property.name}`, 'info');
                      setSelectedPropertyForRooms?.(property.name);
                      setCurrentView?.('rooms');
                    }}
                    className="group/btn flex items-center gap-1.5 text-sm font-semibold text-[#689249] hover:text-[#557A3A] transition-colors hover:bg-[#689249]/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-[#689249]/20"
                  >
                    Manage
                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {isAddModalOpen && (
        <AddPropertyWizard 
          onClose={() => setIsAddModalOpen(false)} 
          onComplete={() => {
            setIsAddModalOpen(false);
          }} 
        />
      )}

      {isEditModalOpen && selectedProperty && (
        <EditPropertyModal
          property={selectedProperty}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProperty(null);
          }}
          onSave={(updated) => {
            setProperties(properties.map(p => p.id === updated.id ? updated : p));
            setIsEditModalOpen(false);
            setSelectedProperty(null);
            notify('Property updated successfully', 'success');
          }}
        />
      )}

      {isDeleteModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Property?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedProperty.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setProperties(properties.filter(p => p.id !== selectedProperty.id));
                  setIsDeleteModalOpen(false);
                  setSelectedProperty(null);
                  notify('Property deleted successfully', 'success');
                }}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors text-sm shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
