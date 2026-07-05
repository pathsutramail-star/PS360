import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, BedDouble, Users, Building2, AlertTriangle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';
import { RoomModal, Room } from './RoomModal';

const defaultProperties = [
  'All Properties',
  'Grand Horizon Resort',
  'City Central Hotel',
  'Oceanview Villa'
];

const initialRooms: Room[] = [
  { id: 'RM-101', property: 'Grand Horizon Resort', name: 'Deluxe Ocean View', type: 'Suite', capacity: 2, price: 'Rs. 25000', status: 'Available', amenities: ['Air Conditioning', 'WiFi', 'Balcony'] },
  { id: 'RM-102', property: 'Grand Horizon Resort', name: 'Standard Queen', type: 'Standard', capacity: 2, price: 'Rs. 12000', status: 'Occupied', amenities: ['Air Conditioning', 'WiFi', 'TV'] },
  { id: 'RM-103', property: 'City Central Hotel', name: 'Family Suite', type: 'Suite', capacity: 4, price: 'Rs. 35000', status: 'Available', amenities: ['Air Conditioning', 'WiFi', 'Balcony', 'Mini Bar'] },
  { id: 'RM-104', property: 'Oceanview Villa', name: 'Executive King', type: 'Executive', capacity: 2, price: 'Rs. 28000', status: 'Maintenance', amenities: ['Air Conditioning', 'WiFi', 'Room Service'] },
];

interface RoomsProps {
  initialSelectedProperty?: string;
}

export function Rooms({ initialSelectedProperty = 'All Properties' }: RoomsProps) {
  const [selectedProperty, setSelectedProperty] = useState(initialSelectedProperty);
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    setSelectedProperty(initialSelectedProperty);
  }, [initialSelectedProperty]);

  const propertyOptions = Array.from(new Set([...defaultProperties, initialSelectedProperty, ...rooms.map(r => r.property)]));

  const filteredRooms = rooms.filter(room => {
    const matchesProperty = selectedProperty === 'All Properties' || room.property === selectedProperty;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProperty && matchesSearch;
  });

  const handleSaveRoom = (room: Room) => {
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === room.id ? room : r));
      notify('Room updated successfully', 'success');
    } else {
      setRooms([...rooms, room]);
      notify('Room added successfully', 'success');
    }
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = () => {
    if (roomToDelete) {
      setRooms(rooms.filter(r => r.id !== roomToDelete.id));
      notify('Room deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Room Management</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage room inventory, pricing, and availability.</p>
        </div>
        <button 
          onClick={() => {
            setEditingRoom(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg shadow-sm hover:bg-[#557A3A] font-medium text-sm transition-all"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 group-focus-within:text-[#689249] transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms by name, type, or property..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all shadow-sm placeholder:text-gray-400 font-medium text-gray-900"
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Building2 size={16} className="text-gray-400" />
            </div>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all shadow-sm font-medium text-gray-900 appearance-none"
            >
              {propertyOptions.map(prop => (
                <option key={prop} value={prop}>{prop}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => notify('Filter options opened', 'info')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm shadow-sm transition-all whitespace-nowrap"
        >
          <Filter size={16} className="text-gray-500" />
          More Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room, index) => {
          const getRoomImage = (type: string, idx: number) => {
            const images = {
              'Standard': [
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
              ],
              'Suite': [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
              ],
              'Family': [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576675784201-0e142b423952?auto=format&fit=crop&w=800&q=80'
              ],
              'Executive': [
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1591088398332-8a56db294e5a?auto=format&fit=crop&w=800&q=80'
              ]
            };
            const typeImages = images[type as keyof typeof images] || images['Standard'];
            return typeImages[idx % typeImages.length];
          };

          return (
          <Card key={room.id} className="group hover:-translate-y-1 transition-all duration-300 relative border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col h-full bg-white rounded-2xl">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              <img 
                src={room.imageUrl || getRoomImage(room.type, index)} 
                alt={room.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <span className="text-white font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-white/20 shadow-sm">
                    {room.type}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold font-display text-white text-lg drop-shadow-md leading-tight mb-1">{room.name}</h3>
                  <div className="flex items-center text-xs font-medium text-white/90 drop-shadow-sm">
                    <Building2 size={12} className="mr-1.5 text-white/70" />
                    {room.property}
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-3 z-20">
                <button 
                  onClick={() => setActiveMenu(activeMenu === room.id ? null : room.id)}
                  className="p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-gray-900 shadow-sm transition-all duration-200"
                >
                  <MoreVertical size={16} />
                </button>
                {activeMenu === room.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in duration-200">
                    <button 
                      onClick={() => {
                        setEditingRoom(room);
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
                        setRoomToDelete(room);
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
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Guests</span>
                    <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-sm">
                      <Users size={14} className="text-[#689249]" />
                      <span>{room.capacity}</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Bed</span>
                    <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-sm">
                      <BedDouble size={14} className="text-[#689249]" />
                      <span>1</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Price</span>
                  <span className="text-lg font-bold text-[#689249]">{room.price}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                {room.amenities.map(amenity => (
                  <span key={amenity} className="inline-flex items-center px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-600 font-semibold">
                    {amenity}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                  room.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200/60' : 
                  room.status === 'Occupied' ? 'bg-blue-50 text-blue-700 border-blue-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                    room.status === 'Available' ? 'bg-green-500' : 
                    room.status === 'Occupied' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}></span>
                  {room.status}
                </span>
                <button 
                  onClick={() => {
                    setEditingRoom(room);
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-semibold text-[#689249] hover:text-[#557A3A] transition-colors hover:bg-[#689249]/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-[#689249]/20 flex items-center gap-1"
                >
                  Manage
                </button>
              </div>
            </div>
          </Card>
          );
        })}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <BedDouble size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No rooms found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}

      {isModalOpen && (
        <RoomModal 
          room={editingRoom}
          propertyOptions={propertyOptions}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRoom(null);
          }}
          onSave={handleSaveRoom}
        />
      )}

      {isDeleteModalOpen && roomToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Room?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{roomToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteRoom}
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

