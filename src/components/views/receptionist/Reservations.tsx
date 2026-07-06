import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Eye, PencilLine, CircleSlash2, MoreHorizontal, BadgeCheck, Mail, X, CalendarDays, CreditCard, Hotel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { AddBookingModal, BookingFormData } from '../shared/AddBookingModal';
import { BookingModal } from '../shared/BookingModal';
import { notify } from '../../../utils';

interface ReservationRow {
  id: string;
  guestName: string;
  roomName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Checked-in' | 'Checked-out' | 'Cancelled';
  balance: string;
}

const initialReservations: ReservationRow[] = [
  { id: 'RES-001', guestName: 'Mina Shah', roomName: 'Deluxe 204', propertyName: 'Grand Horizon Resort', checkIn: 'Jul 08', checkOut: 'Jul 10', status: 'Confirmed', balance: 'NPR 4,500' },
  { id: 'RES-002', guestName: 'Daniel Kim', roomName: 'Suite 401', propertyName: 'Grand Horizon Resort', checkIn: 'Jul 09', checkOut: 'Jul 11', status: 'Pending', balance: 'NPR 6,000' },
  { id: 'RES-003', guestName: 'Asha Gupta', roomName: 'Family 302', propertyName: 'City Central Hotel', checkIn: 'Jul 08', checkOut: 'Jul 09', status: 'Checked-in', balance: 'Settled' },
  { id: 'RES-004', guestName: 'Liam Carter', roomName: 'Superior 110', propertyName: 'Oceanview Villa', checkIn: 'Jul 07', checkOut: 'Jul 08', status: 'Checked-out', balance: 'NPR 1,400' },
];

const statusStyles: Record<ReservationRow['status'], string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  'Checked-in': 'bg-sky-50 text-sky-700',
  'Checked-out': 'bg-slate-100 text-slate-700',
  Cancelled: 'bg-rose-50 text-rose-700',
};

export function Reservations() {
  const [reservations, setReservations] = useState<ReservationRow[]>(initialReservations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ReservationRow['status']>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationRow | null>(null);
  const [reservationMode, setReservationMode] = useState<'view' | 'edit' | null>(null);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((item) => {
      const matchesSearch = `${item.guestName} ${item.roomName}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  const handleAddReservation = (data: BookingFormData) => {
    const nextReservation: ReservationRow = {
      id: `RES-${Math.floor(Math.random() * 900) + 100}`,
      guestName: data.guestName,
      roomName: data.roomType || 'Walk-in Room',
      propertyName: data.property,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: 'Confirmed',
      balance: data.amount || 'Pending',
    };
    setReservations((current) => [nextReservation, ...current]);
    notify('Reservation added successfully', 'success');
  };

  const handleCancelReservation = (reservation: ReservationRow) => {
    setReservations((current) => current.map((item) => (item.id === reservation.id ? { ...item, status: 'Cancelled' } : item)));
    notify('Reservation cancelled', 'success');
  };

  const handleMarkCheckedIn = (reservation: ReservationRow) => {
    setReservations((current) => current.map((item) => (item.id === reservation.id ? { ...item, status: 'Checked-in' } : item)));
    notify(`${reservation.guestName} marked as checked in`, 'success');
  };

  const handleSendConfirmation = (reservation: ReservationRow) => {
    notify(`Confirmation sent to ${reservation.guestName}`, 'success');
  };

  const handleSaveReservation = (reservation: ReservationRow) => {
    setReservations((current) => current.map((item) => (item.id === reservation.id ? reservation : item)));
    notify('Reservation updated', 'success');
    setReservationMode(null);
    setSelectedReservation(null);
  };

  const closeReservationModal = () => {
    setReservationMode(null);
    setSelectedReservation(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Reservations</h1>
          <p className="text-sm text-gray-500 font-medium">Track confirmed, pending, and checked-in stays for the front desk.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
          <Plus size={16} />
          New Reservation
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservation List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search guest or room"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#689249] focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'All' | ReservationRow['status'])}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none"
            >
              <option value="All">All statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked-in">Checked-in</option>
              <option value="Checked-out">Checked-out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Guest</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Room</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dates</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Balance</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-900">{reservation.guestName}</td>
                    <td className="px-4 py-3 text-gray-600">{reservation.roomName}</td>
                    <td className="px-4 py-3 text-gray-600">{reservation.checkIn} → {reservation.checkOut}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[reservation.status]}`}>{reservation.status}</span></td>
                    <td className="px-4 py-3 text-gray-600">{reservation.balance}</td>
                    <td className="px-4 py-3">
                      <div className="relative inline-flex" ref={activeActionMenu === reservation.id ? actionMenuRef : undefined}>
                        <button
                          aria-label={`Open actions for ${reservation.guestName}`}
                          onClick={() => setActiveActionMenu(activeActionMenu === reservation.id ? null : reservation.id)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {activeActionMenu === reservation.id && (
                          <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                            <button onClick={() => { setSelectedReservation(reservation); setReservationMode('view'); setActiveActionMenu(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                              <Eye size={14} />
                              View
                            </button>
                            <button onClick={() => { setSelectedReservation(reservation); setReservationMode('edit'); setActiveActionMenu(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                              <PencilLine size={14} />
                              Edit
                            </button>
                            <button onClick={() => { handleSendConfirmation(reservation); setActiveActionMenu(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                              <Mail size={14} />
                              Send confirmation
                            </button>
                            {reservation.status !== 'Checked-in' && reservation.status !== 'Cancelled' && (
                              <button onClick={() => { handleMarkCheckedIn(reservation); setActiveActionMenu(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <BadgeCheck size={14} />
                                Mark checked in
                              </button>
                            )}
                            <button onClick={() => { handleCancelReservation(reservation); setActiveActionMenu(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-700 hover:bg-rose-50">
                              <CircleSlash2 size={14} />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isAddModalOpen && <AddBookingModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddReservation} />}

      {reservationMode === 'view' && selectedReservation && (
        <ReservationViewModal reservation={selectedReservation} onClose={closeReservationModal} />
      )}

      {reservationMode === 'edit' && selectedReservation && (
        <BookingModal
          booking={{
            id: selectedReservation.id,
            guest: selectedReservation.guestName,
            property: selectedReservation.propertyName,
            room: selectedReservation.roomName,
            checkIn: selectedReservation.checkIn,
            checkOut: selectedReservation.checkOut,
            status: selectedReservation.status,
            amount: selectedReservation.balance,
          }}
          propertyOptions={['Grand Horizon Resort', 'City Central Hotel', 'Oceanview Villa']}
          onClose={closeReservationModal}
          onSave={(booking) => {
            const nextReservation: ReservationRow = {
              id: booking.id,
              guestName: booking.guest,
              roomName: booking.room,
              propertyName: booking.property,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              status: booking.status as ReservationRow['status'],
              balance: booking.amount,
            };
            handleSaveReservation(nextReservation);
          }}
        />
      )}
    </div>
  );
}

function ReservationViewModal({ reservation, onClose }: { reservation: ReservationRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#689249]">{reservation.id}</p>
            <h3 className="mt-1 text-xl font-bold font-display text-gray-900">Reservation Details</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-[#dfe8d7] bg-[#f8fbf5] p-4">
            <p className="text-sm font-medium text-gray-500">Guest</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{reservation.guestName}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailTile icon={Hotel} label="Property" value={reservation.propertyName} />
            <DetailTile icon={Hotel} label="Room" value={reservation.roomName} />
            <DetailTile icon={CalendarDays} label="Dates" value={`${reservation.checkIn} - ${reservation.checkOut}`} />
            <DetailTile icon={CreditCard} label="Balance" value={reservation.balance} />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
            <span className="text-sm font-semibold text-gray-600">Current status</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[reservation.status]}`}>{reservation.status}</span>
          </div>
        </div>
        <div className="border-t border-gray-100 p-6">
          <button onClick={onClose} className="w-full rounded-xl bg-[#689249] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailTile({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
        <Icon size={14} className="text-[#689249]" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
