import React, { useState } from 'react';
import { Plus, Search, Filter, Video, MoreVertical, Eye, PlayCircle, Building2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { notify } from '../../../utils';
import { TourModal, Tour } from './TourModal';

const initialTours: Tour[] = [
  { id: 'T-01', name: 'Grand Resort Lobby', type: 'Lobby', property: 'Grand Horizon Resort', views: '1.2k', status: 'Published', date: 'Oct 15, 2023', imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', tourUrl: '#' },
  { id: 'T-02', name: 'Deluxe Ocean View Room', type: 'Room', property: 'Grand Horizon Resort', views: '850', status: 'Published', date: 'Oct 18, 2023', imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80', tourUrl: '#' },
  { id: 'T-03', name: 'Rooftop Infinity Pool', type: 'Facility', property: 'City Central Hotel', views: '420', status: 'Draft', date: 'Oct 22, 2023', imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', tourUrl: '#' },
  { id: 'T-04', name: 'Himalayan Café Overview', type: 'Restaurant', property: 'Himalayan Café', views: '2.1k', status: 'Published', date: 'Sep 30, 2023', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', tourUrl: '#' },
];

const defaultProperties = ['Grand Horizon Resort', 'City Central Hotel', 'Oceanview Villa', 'Himalayan Café'];

export function Tours() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredTours = tours.filter(tour => {
    return tour.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           tour.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tour.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSaveTour = (tour: Tour) => {
    if (editingTour) {
      setTours(tours.map(t => t.id === tour.id ? tour : t));
      notify('Tour updated successfully', 'success');
    } else {
      setTours([...tours, tour]);
      notify('Tour added successfully', 'success');
    }
    setIsModalOpen(false);
    setEditingTour(null);
  };

  const handleDeleteTour = () => {
    if (tourToDelete) {
      setTours(tours.filter(t => t.id !== tourToDelete.id));
      notify('Tour deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setTourToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">360° Tour Management</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Upload, edit, and manage immersive virtual tours for your properties.</p>
        </div>
        <button 
          onClick={() => {
            setEditingTour(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg shadow-sm hover:bg-[#557A3A] font-medium text-sm transition-all"
        >
          <Plus size={16} />
          Upload New Tour
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Total Tours', value: tours.length.toString(), desc: 'Across all properties', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Total Views', value: '124.5k', desc: '+15% this month', icon: Eye, color: 'text-[#689249]', bg: 'bg-[#689249]/10' },
          { title: 'Processing', value: '2', desc: 'Tours being rendered', icon: PlayCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-white rounded-t-xl">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tours..." 
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-sm transition-colors">
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((tour) => (
              <Card key={tour.id} className="group hover:-translate-y-1 transition-all duration-300 relative border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col h-full bg-white rounded-2xl">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {tour.imageUrl ? (
                    <img 
                      src={tour.imageUrl} 
                      alt={tour.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Video size={48} className="text-gray-300" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-[#689249] hover:scale-110 transition-transform">
                      <PlayCircle size={24} className="ml-1" />
                    </button>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className="text-white font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border border-white/20 shadow-sm">
                      {tour.type}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-20">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === tour.id ? null : tour.id)}
                      className="p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-gray-900 shadow-sm transition-all duration-200"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenu === tour.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in duration-200">
                        <button 
                          onClick={() => {
                            setEditingTour(tour);
                            setIsModalOpen(true);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                          Edit Details
                        </button>
                        <div className="h-px bg-gray-100 mx-2 my-1"></div>
                        <button 
                          onClick={() => {
                            setTourToDelete(tour);
                            setIsDeleteModalOpen(true);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4 flex-1">
                    <h3 className="font-bold font-display text-gray-900 truncate pr-2 group-hover:text-[#689249] transition-colors mb-1.5 text-lg">{tour.name}</h3>
                    <div className="flex items-center text-xs font-medium text-gray-500">
                      <Building2 size={12} className="mr-1.5 text-gray-400" />
                      <span className="truncate">{tour.property}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md">
                      <Eye size={12} className="text-gray-400" />
                      {tour.views} Views
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                      tour.status === 'Published' ? 'bg-green-50 text-green-700 border-green-200/60' : 
                      tour.status === 'Archived' ? 'bg-gray-50 text-gray-700 border-gray-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                        tour.status === 'Published' ? 'bg-green-500' : 
                        tour.status === 'Archived' ? 'bg-gray-500' : 'bg-amber-500'
                      }`}></span>
                      {tour.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 mt-2">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={20} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No tours found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </Card>

      {isModalOpen && (
        <TourModal 
          tour={editingTour}
          propertyOptions={defaultProperties}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTour(null);
          }}
          onSave={handleSaveTour}
        />
      )}

      {isDeleteModalOpen && tourToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Tour?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{tourToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTour}
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
