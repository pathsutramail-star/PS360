import React, { useMemo, useState } from 'react';
import { BedDouble, Filter, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { RoomModal, Room } from '../shared/RoomModal';
import { notify } from '../../../utils';

interface RoomCardItem extends Room {
  floor: string;
}

const initialRooms: RoomCardItem[] = [
  { id: 'RM-101', property: 'Grand Horizon Resort', name: 'Deluxe 204', type: 'Deluxe', capacity: 2, price: 'Rs. 4500', status: 'Vacant Clean', amenities: ['WiFi', 'AC'], floor: 'Floor 2' },
  { id: 'RM-102', property: 'Grand Horizon Resort', name: 'Superior 110', type: 'Superior', capacity: 2, price: 'Rs. 5200', status: 'Vacant Dirty', amenities: ['WiFi', 'Balcony'], floor: 'Floor 1' },
  { id: 'RM-201', property: 'Grand Horizon Resort', name: 'Suite 401', type: 'Suite', capacity: 3, price: 'Rs. 9000', status: 'Occupied', amenities: ['WiFi', 'Jacuzzi'], floor: 'Floor 4' },
  { id: 'RM-301', property: 'City Central Hotel', name: 'Family 302', type: 'Family', capacity: 4, price: 'Rs. 7000', status: 'Out of Service', amenities: ['Kitchen'], floor: 'Floor 3' },
  { id: 'RM-401', property: 'City Central Hotel', name: 'Standard 205', type: 'Standard', capacity: 2, price: 'Rs. 3800', status: 'Cleaning', amenities: ['WiFi'], floor: 'Floor 2' },
  { id: 'RM-501', property: 'Grand Horizon Resort', name: 'Junior Suite 508', type: 'Suite', capacity: 3, price: 'Rs. 8500', status: 'Reserved', amenities: ['WiFi', 'Balcony'], floor: 'Floor 5' },
];

const statusStyles: Record<string, string> = {
  'Vacant Clean': 'bg-[#f1f7e8] text-[#567a3b]',
  'Vacant Dirty': 'bg-amber-50 text-amber-700',
  Occupied: 'bg-slate-100 text-slate-700',
  Reserved: 'bg-[#edf4e7] text-[#689249]',
  Cleaning: 'bg-blue-50 text-blue-700',
  Inspection: 'bg-violet-50 text-violet-700',
  Maintenance: 'bg-orange-50 text-orange-700',
  'Out of Service': 'bg-rose-50 text-rose-700',
};

const roomStatuses = ['Vacant Clean', 'Vacant Dirty', 'Occupied', 'Reserved', 'Cleaning', 'Inspection', 'Maintenance', 'Out of Service'];

export function RoomStatus() {
  const [rooms, setRooms] = useState<RoomCardItem[]>(initialRooms);
  const [selectedProperty, setSelectedProperty] = useState('All Properties');
  const [selectedFloor, setSelectedFloor] = useState('All Floors');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedRoom, setSelectedRoom] = useState<RoomCardItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesProperty = selectedProperty === 'All Properties' || room.property === selectedProperty;
      const matchesFloor = selectedFloor === 'All Floors' || room.floor === selectedFloor;
      const matchesStatus = selectedStatus === 'All Statuses' || room.status === selectedStatus;
      return matchesProperty && matchesFloor && matchesStatus;
    });
  }, [rooms, selectedFloor, selectedProperty, selectedStatus]);

  const handleRequestHousekeeping = (room: RoomCardItem) => {
    setRooms((current) => current.map((item) => (item.id === room.id ? { ...item, status: 'Cleaning' } : item)));
    notify(`Housekeeping requested for ${room.name}`, 'success');
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleSaveRoom = (room: Room) => {
    setRooms((current) => current.map((item) => (item.id === room.id ? { ...item, ...room } : item)));
    notify('Room status updated', 'success');
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleQuickStatus = (room: RoomCardItem, status: string) => {
    setRooms((current) => current.map((item) => (item.id === room.id ? { ...item, status } : item)));
    notify(`${room.name} marked ${status}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Room Status</h1>
        <p className="text-sm text-gray-500 font-medium">Monitor room readiness and escalate housekeeping quickly from the front desk.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            <Filter size={16} />
            <select value={selectedProperty} onChange={(event) => setSelectedProperty(event.target.value)} className="bg-transparent focus:outline-none">
              <option value="All Properties">All Properties</option>
              <option value="Grand Horizon Resort">Grand Horizon Resort</option>
              <option value="City Central Hotel">City Central Hotel</option>
            </select>
          </div>
          <select value={selectedFloor} onChange={(event) => setSelectedFloor(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
            <option value="All Floors">All Floors</option>
            <option value="Floor 1">Floor 1</option>
            <option value="Floor 2">Floor 2</option>
            <option value="Floor 3">Floor 3</option>
            <option value="Floor 4">Floor 4</option>
            <option value="Floor 5">Floor 5</option>
          </select>
          <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
            <option value="All Statuses">All Statuses</option>
            {roomStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRooms.map((room) => (
          <div key={room.id} className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#689249]/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{room.name}</p>
                <p className="text-sm text-gray-500">{room.property}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#689249]/10 text-[#689249]">
                <BedDouble size={18} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>{room.floor}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[room.status]}`}>{room.status}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <select
                value={room.status}
                onChange={(event) => handleQuickStatus(room, event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none"
              >
                {roomStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button onClick={() => { setSelectedRoom(room); setIsModalOpen(true); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedRoom && (
        <div>
          <RoomModal
            room={selectedRoom}
            propertyOptions={['Grand Horizon Resort', 'City Central Hotel']}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedRoom(null);
            }}
            onSave={handleSaveRoom}
          />
          <div className="fixed bottom-6 right-6 z-[120]">
            <button onClick={() => handleRequestHousekeeping(selectedRoom)} className="flex items-center gap-2 rounded-lg bg-[#689249] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#567a3b]">
              <Sparkles size={16} />
              Request Housekeeping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
