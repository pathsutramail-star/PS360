import React, { useState } from 'react';
import { SendHorizonal, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { notify } from '../../../utils';
import { ShiftNote } from '../../../models/types';

const initialNotes: ShiftNote[] = [
  { id: 'SN-1', author: 'Asha', shift: 'Morning', note: 'VIP arrival confirmed for Suite 401.', timestamp: '06:15', acknowledged: false },
  { id: 'SN-2', author: 'Ravi', shift: 'Afternoon', note: 'Housekeeping requested for Deluxe 204.', timestamp: '14:30', acknowledged: true },
];

export function ShiftHandover() {
  const [notes, setNotes] = useState<ShiftNote[]>(initialNotes);
  const [draft, setDraft] = useState('');
  const [shift, setShift] = useState<'Morning' | 'Afternoon' | 'Night'>('Afternoon');

  const handlePostNote = () => {
    if (!draft.trim()) return;
    setNotes((current) => [{ id: `SN-${Date.now()}`, author: 'You', shift, note: draft, timestamp: 'Just now', acknowledged: false }, ...current]);
    setDraft('');
    notify('Shift note posted', 'success');
  };

  const toggleAcknowledged = (noteId: string) => {
    setNotes((current) => current.map((note) => (note.id === noteId ? { ...note, acknowledged: !note.acknowledged } : note)));
    notify('Shift note acknowledged', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Shift Handover</h1>
        <p className="text-sm text-gray-500 font-medium">Leave notes for the next shift and keep critical follow-ups visible.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post a Shift Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <select value={shift} onChange={(event) => setShift(event.target.value as 'Morning' | 'Afternoon' | 'Night')} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} placeholder="Write a handoff note for the next team" className="min-h-[96px] flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none" />
          </div>
          <div className="flex justify-end">
            <button onClick={handlePostNote} className="flex items-center gap-2 rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
              <SendHorizonal size={16} />
              Post Note
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Handover Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className={`rounded-2xl border p-4 ${!note.acknowledged ? 'border-amber-200 bg-amber-50/60' : 'border-gray-200 bg-white'}`}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{note.author} · {note.shift}</p>
                  <p className="text-sm text-gray-500">{note.timestamp}</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={note.acknowledged} onChange={() => toggleAcknowledged(note.id)} className="h-4 w-4 rounded border-gray-300 text-[#689249] focus:ring-[#689249]" />
                  Acknowledged
                </label>
              </div>
              <p className="mt-3 text-sm text-gray-700">{note.note}</p>
              {!note.acknowledged && (
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <CheckCircle2 size={16} />
                  Needs attention from the next shift
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
