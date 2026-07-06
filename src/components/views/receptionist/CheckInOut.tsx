import React, { useState } from 'react';
import { BadgeCheck, CreditCard, FileText, Search, UserRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { notify } from '../../../utils';

interface ReservationItem {
  id: string;
  guestName: string;
  roomName: string;
  propertyName: string;
  arrival: string;
  departure: string;
  status: 'Confirmed' | 'Checked-in' | 'Checked-out';
  depositCollected: boolean;
  balance: string;
}

export function CheckInOut() {
  const [activeTab, setActiveTab] = useState<'check-in' | 'check-out'>('check-in');
  const [reservations, setReservations] = useState<ReservationItem[]>([
    { id: 'CHK-01', guestName: 'Mina Shah', roomName: 'Deluxe 204', propertyName: 'Grand Horizon Resort', arrival: 'Today', departure: 'Jul 10', status: 'Confirmed', depositCollected: true, balance: 'NPR 4,500' },
    { id: 'CHK-02', guestName: 'Daniel Kim', roomName: 'Suite 401', propertyName: 'Grand Horizon Resort', arrival: 'Today', departure: 'Jul 11', status: 'Confirmed', depositCollected: false, balance: 'NPR 6,000' },
  ]);
  const [selectedReservation, setSelectedReservation] = useState<ReservationItem | null>(null);
  const [search, setSearch] = useState('');
  const [idType, setIdType] = useState('Passport');
  const [idNumber, setIdNumber] = useState('');
  const [note, setNote] = useState('');
  const [assignedRoom, setAssignedRoom] = useState('Deluxe 204');
  const [depositCollected, setDepositCollected] = useState(true);

  const filteredReservations = reservations.filter((item) =>
    item.status === 'Confirmed' && `${item.guestName} ${item.roomName}`.toLowerCase().includes(search.toLowerCase())
  );

  const checkedOutGuests = reservations.filter((item) => item.status === 'Checked-in');

  const handleCheckInComplete = () => {
    if (!selectedReservation) return;
    setReservations((current) =>
      current.map((item) => (item.id === selectedReservation.id ? { ...item, status: 'Checked-in', depositCollected, balance: 'Settled' } : item))
    );
    setSelectedReservation(null);
    notify('Check-in completed successfully', 'success');
  };

  const handleCheckout = (item: ReservationItem) => {
    setReservations((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: 'Checked-out' } : entry)));
    notify('Check-out finalized for the guest', 'success');
  };

  const handleReceipt = (item: ReservationItem, delivery: 'printed' | 'emailed') => {
    notify(`Receipt ${delivery} for ${item.guestName}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Check-In / Check-Out</h1>
        <p className="text-sm text-gray-500 font-medium">Handle arrivals and departures without breaking the front-desk flow.</p>
      </div>

      <div className="flex gap-2 rounded-xl border border-gray-200 bg-white p-1">
        {[
          { key: 'check-in', label: 'Check-In' },
          { key: 'check-out', label: 'Check-Out' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'check-in' | 'check-out')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-[#689249] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'check-in' ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <CardTitle>Today's Confirmed Reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search guest or room"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#689249] focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                {filteredReservations.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedReservation(item);
                      setAssignedRoom(item.roomName);
                      setDepositCollected(item.depositCollected);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-[#689249]/40 hover:bg-[#f1f7e8]"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{item.guestName}</p>
                      <p className="text-sm text-gray-500">{item.roomName} · {item.propertyName}</p>
                    </div>
                    <span className="rounded-full bg-[#689249]/10 px-3 py-1 text-xs font-semibold text-[#689249]">{item.status}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{selectedReservation ? 'Confirm Guest Arrival' : 'Select a reservation'}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedReservation ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#689249]/10 text-[#689249]">
                        <UserRound size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedReservation.guestName}</p>
                        <p className="text-sm text-gray-500">Arriving {selectedReservation.arrival} · {selectedReservation.propertyName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">
                      Confirmed room
                      <input
                        value={assignedRoom}
                        onChange={(event) => setAssignedRoom(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      ID type
                      <select
                        value={idType}
                        onChange={(event) => setIdType(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none"
                      >
                        <option>Passport</option>
                        <option>National ID</option>
                        <option>Driving License</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-gray-700">
                    ID number
                    <input
                      value={idNumber}
                      onChange={(event) => setIdNumber(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none"
                      placeholder="Enter ID number"
                    />
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-3 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={depositCollected} onChange={() => setDepositCollected((value) => !value)} className="h-4 w-4 rounded border-gray-300 text-[#689249] focus:ring-[#689249]" />
                    Deposit collected
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none"
                      placeholder="Add any arrival notes"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard size={16} className="text-[#689249]" />
                      Balance {selectedReservation.balance}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={16} className="text-[#689249]" />
                      ID {idType}
                    </div>
                  </div>

                  <button onClick={handleCheckInComplete} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#689249] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
                    <BadgeCheck size={16} />
                    Complete Check-In
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-sm text-gray-500">
                  Select a confirmed reservation to begin the check-in process.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Guests Due Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkedOutGuests.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{item.guestName}</p>
                    <p className="text-sm text-gray-500">{item.roomName} · {item.propertyName}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleReceipt(item, 'printed')} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                      Print Receipt
                    </button>
                    <button onClick={() => handleReceipt(item, 'emailed')} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                      Email Receipt
                    </button>
                    <button onClick={() => handleCheckout(item)} className="rounded-lg bg-[#689249] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
                      Settle & Check Out
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
