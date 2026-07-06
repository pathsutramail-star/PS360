import React, { useMemo, useState } from 'react';
import { Plus, Search, Star, UserRound, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { notify } from '../../../utils';

interface GuestRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  vip: boolean;
  notes: string;
  stayHistory: string[];
}

const initialGuests: GuestRecord[] = [
  { id: 'G-100', name: 'Asha Gupta', email: 'asha@example.com', phone: '+977-9812345678', idType: 'Passport', idNumber: 'P-001', vip: true, notes: 'Prefers quiet room on higher floor.', stayHistory: ['2 stays in 2025', '1 stay in 2024'] },
  { id: 'G-101', name: 'Daniel Kim', email: 'daniel@example.com', phone: '+977-9801234567', idType: 'National ID', idNumber: 'N-204', vip: false, notes: 'Late check-out requested.', stayHistory: ['1 stay in 2025'] },
];

export function GuestDirectory() {
  const [guests, setGuests] = useState<GuestRecord[]>(initialGuests);
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestRecord | null>(initialGuests[0]);
  const [notesDraft, setNotesDraft] = useState(selectedGuest?.notes ?? '');
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [guestDraft, setGuestDraft] = useState({
    name: '',
    email: '',
    phone: '',
    idType: 'National ID',
    idNumber: '',
    vip: false,
    notes: '',
  });

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => `${guest.name} ${guest.phone}`.toLowerCase().includes(search.toLowerCase()));
  }, [guests, search]);

  const handleSelectGuest = (guest: GuestRecord) => {
    setSelectedGuest(guest);
    setNotesDraft(guest.notes);
  };

  const handleSaveNotes = () => {
    if (!selectedGuest) return;
    setGuests((current) => current.map((guest) => (guest.id === selectedGuest.id ? { ...guest, notes: notesDraft } : guest)));
    notify('Guest notes updated', 'success');
  };

  const handleAddGuest = () => {
    if (!guestDraft.name.trim() || !guestDraft.phone.trim()) {
      notify('Please add at least the guest name and phone number', 'error');
      return;
    }
    const draftGuest: GuestRecord = {
      id: `G-${Date.now()}`,
      name: guestDraft.name,
      email: guestDraft.email || 'Not provided',
      phone: guestDraft.phone,
      idType: guestDraft.idType,
      idNumber: guestDraft.idNumber || 'TBD',
      vip: guestDraft.vip,
      notes: guestDraft.notes || 'New walk-in guest added from front desk.',
      stayHistory: ['1 new visit'],
    };
    setGuests((current) => [draftGuest, ...current]);
    setSelectedGuest(draftGuest);
    setNotesDraft(draftGuest.notes);
    setGuestDraft({ name: '', email: '', phone: '', idType: 'National ID', idNumber: '', vip: false, notes: '' });
    setIsAddGuestOpen(false);
    notify('Guest added to directory', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Guest Directory</h1>
          <p className="text-sm text-gray-500 font-medium">Keep guest details, VIP notes, and stay history close at hand.</p>
        </div>
        <button onClick={() => setIsAddGuestOpen(true)} className="flex items-center justify-center gap-2 rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
          <Plus size={16} />
          Add Guest
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Guests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest name or phone" className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#689249] focus:outline-none" />
            </div>

            <div className="space-y-3">
              {filteredGuests.map((guest) => (
                <button key={guest.id} onClick={() => handleSelectGuest(guest)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${selectedGuest?.id === guest.id ? 'border-[#689249]/40 bg-[#f1f7e8]' : 'border-gray-200 bg-white hover:border-[#689249]/40'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#689249]/10 text-[#689249]">
                      <UserRound size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{guest.name}</p>
                      <p className="text-sm text-gray-500">{guest.phone}</p>
                    </div>
                  </div>
                  {guest.vip && <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><Star size={12} />VIP</span>}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedGuest ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <p className="font-semibold text-gray-900">{selectedGuest.name}</p>
                  <p className="text-sm text-gray-500">{selectedGuest.email}</p>
                  <p className="text-sm text-gray-500">{selectedGuest.phone}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">ID</p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">{selectedGuest.idType}</p>
                    <p className="text-sm text-gray-500">{selectedGuest.idNumber}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Stay history</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {selectedGuest.stayHistory.map((event) => <li key={event}>• {event}</li>)}
                    </ul>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700">
                  Notes
                  <textarea value={notesDraft} onChange={(event) => setNotesDraft(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" />
                </label>

                <button onClick={handleSaveNotes} className="w-full rounded-lg bg-[#689249] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
                  Save Notes
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-sm text-gray-500">Select a guest to view details.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {isAddGuestOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/55 backdrop-blur-sm" onClick={() => setIsAddGuestOpen(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add Walk-in Guest</h2>
                <p className="text-sm text-gray-500">Create a quick guest record for arrivals without a reservation.</p>
              </div>
              <button onClick={() => setIsAddGuestOpen(false)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input value={guestDraft.name} onChange={(event) => setGuestDraft((current) => ({ ...current, name: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="Guest name" />
                <input value={guestDraft.phone} onChange={(event) => setGuestDraft((current) => ({ ...current, phone: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="Phone number" />
                <input value={guestDraft.email} onChange={(event) => setGuestDraft((current) => ({ ...current, email: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="Email address" />
                <select value={guestDraft.idType} onChange={(event) => setGuestDraft((current) => ({ ...current, idType: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
                  <option>National ID</option>
                  <option>Passport</option>
                  <option>Driving License</option>
                </select>
                <input value={guestDraft.idNumber} onChange={(event) => setGuestDraft((current) => ({ ...current, idNumber: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="ID number" />
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={guestDraft.vip} onChange={() => setGuestDraft((current) => ({ ...current, vip: !current.vip }))} className="h-4 w-4 rounded border-gray-300 text-[#689249] focus:ring-[#689249]" />
                  Mark as VIP
                </label>
              </div>
              <textarea value={guestDraft.notes} onChange={(event) => setGuestDraft((current) => ({ ...current, notes: event.target.value }))} rows={3} className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="Guest notes" />
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 p-6">
              <button onClick={() => setIsAddGuestOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddGuest} className="rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">Add Guest</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
