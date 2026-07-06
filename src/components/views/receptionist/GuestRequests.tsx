import React, { useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { notify } from '../../../utils';
import { GuestRequest } from '../../../models/types';

const initialRequests: GuestRequest[] = [
  { id: 'REQ-1', guestName: 'Mina Shah', roomName: 'Deluxe 204', category: 'Housekeeping', description: 'Need extra towels and water.', priority: 'Medium', status: 'Open', createdAt: '10 min ago' },
  { id: 'REQ-2', guestName: 'Chris Brown', roomName: 'Suite 401', category: 'Maintenance', description: 'AC is not cooling properly.', priority: 'High', status: 'In Progress', createdAt: '25 min ago' },
  { id: 'REQ-3', guestName: 'Sara Chen', roomName: 'Superior 110', category: 'Room Service', description: 'Breakfast order for 2.', priority: 'Low', status: 'Resolved', createdAt: '1 hr ago' },
];

const statusTabs: Array<GuestRequest['status']> = ['Open', 'In Progress', 'Resolved'];

export function GuestRequests() {
  const [requests, setRequests] = useState<GuestRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<GuestRequest['status']>('Open');
  const [search, setSearch] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [draft, setDraft] = useState({
    guestName: '',
    roomName: '',
    category: 'Front Desk' as GuestRequest['category'],
    priority: 'Medium' as GuestRequest['priority'],
    description: '',
  });

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => request.status === activeTab && `${request.guestName} ${request.roomName}`.toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, requests, search]);

  const updateStatus = (requestId: string, status: GuestRequest['status']) => {
    setRequests((current) => current.map((request) => (request.id === requestId ? { ...request, status } : request)));
    notify('Request status updated', 'success');
  };

  const handleCreateRequest = () => {
    if (!draft.guestName.trim() || !draft.roomName.trim() || !draft.description.trim()) {
      notify('Please add the guest, room, and request details', 'error');
      return;
    }
    const requestDraft: GuestRequest = {
      id: `REQ-${Date.now()}`,
      guestName: draft.guestName,
      roomName: draft.roomName,
      category: draft.category,
      description: draft.description,
      priority: draft.priority,
      status: 'Open',
      createdAt: 'just now',
    };
    setRequests((current) => [requestDraft, ...current]);
    setDraft({ guestName: '', roomName: '', category: 'Front Desk', priority: 'Medium', description: '' });
    setActiveTab('Open');
    setIsComposerOpen(false);
    notify('Guest request created', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Guest Requests</h1>
          <p className="text-sm text-gray-500 font-medium">Coordinate front-desk, maintenance, and housekeeping follow-ups.</p>
        </div>
        <button onClick={() => setIsComposerOpen(true)} className="flex items-center justify-center gap-2 rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
          <Plus size={16} />
          New Request
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Request Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              {statusTabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-[#689249] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full md:max-w-sm">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest or room" className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#689249] focus:outline-none" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{request.guestName}</p>
                    <p className="text-sm text-gray-500">{request.roomName}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${request.priority === 'High' ? 'bg-rose-50 text-rose-700' : request.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {request.priority}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600">{request.description}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span>{request.category}</span>
                  <span>{request.createdAt}</span>
                </div>
                <select value={request.status} onChange={(event) => updateStatus(request.id, event.target.value as GuestRequest['status'])} className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isComposerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/55 backdrop-blur-sm" onClick={() => setIsComposerOpen(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create a New Request</h2>
                <p className="text-sm text-gray-500">Log a front-desk follow-up for housekeeping, maintenance, or service.</p>
              </div>
              <button onClick={() => setIsComposerOpen(false)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Guest name
                  <input value={draft.guestName} onChange={(event) => setDraft((current) => ({ ...current, guestName: event.target.value }))} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="Guest name" />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Room
                  <input value={draft.roomName} onChange={(event) => setDraft((current) => ({ ...current, roomName: event.target.value }))} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="Room number" />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Category
                  <select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as GuestRequest['category'] }))} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
                    <option>Housekeeping</option>
                    <option>Maintenance</option>
                    <option>Room Service</option>
                    <option>Front Desk</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Priority
                  <select value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value as GuestRequest['priority'] }))} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Request details
                <textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" placeholder="What does the guest need?" />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 p-6">
              <button onClick={() => setIsComposerOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateRequest} className="rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">Create Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
