import React, { useState } from 'react';
import { AlertCircle, Banknote, CreditCard, PlusCircle, ReceiptText, Search, WalletCards } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { notify } from '../../../utils';

interface FolioItem {
  id: string;
  guestName: string;
  roomName: string;
  balance: string;
  lastCharge: string;
  paymentStatus: 'Pending' | 'Partially Paid' | 'Settled';
}

const initialFolio: FolioItem[] = [
  { id: 'FOL-1', guestName: 'Mina Shah', roomName: 'Deluxe 204', balance: 'NPR 4,500', lastCharge: 'Room rate', paymentStatus: 'Pending' },
  { id: 'FOL-2', guestName: 'Daniel Kim', roomName: 'Suite 401', balance: 'NPR 2,100', lastCharge: 'Restaurant', paymentStatus: 'Partially Paid' },
];

export function Billing() {
  const [folios, setFolios] = useState<FolioItem[]>(initialFolio);
  const [selectedMethod, setSelectedMethod] = useState('Cash');
  const [search, setSearch] = useState('');

  const filteredFolios = folios.filter((folio) => `${folio.guestName} ${folio.roomName}`.toLowerCase().includes(search.toLowerCase()));
  const pendingCount = folios.filter((folio) => folio.paymentStatus !== 'Settled').length;

  const statusStyles: Record<FolioItem['paymentStatus'], string> = {
    Pending: 'bg-amber-50 text-amber-700',
    'Partially Paid': 'bg-[#f1f7e8] text-[#689249]',
    Settled: 'bg-emerald-50 text-emerald-700',
  };

  const handleRecordPayment = (folio: FolioItem) => {
    setFolios((current) => current.map((item) => (item.id === folio.id ? { ...item, paymentStatus: 'Settled', balance: 'Settled' } : item)));
    notify(`${selectedMethod} payment recorded for ${folio.guestName}`, 'success');
  };

  const handleAddCharge = (folio: FolioItem) => {
    setFolios((current) => current.map((item) => (item.id === folio.id ? { ...item, balance: 'NPR 6,200', lastCharge: 'Mini bar + service charge', paymentStatus: 'Partially Paid' } : item)));
    notify('Charge added to folio', 'success');
  };

  const handleGenerateInvoice = (folio: FolioItem) => {
    notify(`Invoice generated for ${folio.guestName}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Billing & Payments</h1>
          <p className="text-sm text-gray-500 font-medium">Handle folios, quick payments, invoices, and front-desk charges.</p>
        </div>
        <div className="rounded-2xl border border-[#dfe8d7] bg-[#f8fbf5] px-4 py-3 text-sm font-semibold text-[#567a3b]">
          Active method: {selectedMethod}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Open folios', value: folios.length.toString(), icon: WalletCards },
          { label: 'Pending payments', value: pendingCount.toString(), icon: AlertCircle },
          { label: 'Cash drawer', value: 'NPR 18,500', icon: Banknote },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f7e8] text-[#689249]">
                  <Icon size={20} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>In-House Folios</CardTitle>
            <p className="mt-1 text-sm text-gray-500">Search, settle, add charges, or generate invoices.</p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search guest or room"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#689249] focus:outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredFolios.map((folio) => (
            <div key={folio.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{folio.guestName}</p>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{folio.id}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{folio.roomName} - Last charge: {folio.lastCharge}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[folio.paymentStatus]}`}>{folio.paymentStatus}</span>
                  <span className="text-sm font-bold text-gray-900">{folio.balance}</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr]">
                <select value={selectedMethod} onChange={(event) => setSelectedMethod(event.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleRecordPayment(folio)} disabled={folio.paymentStatus === 'Settled'} className="flex items-center gap-2 rounded-lg bg-[#689249] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b] disabled:cursor-not-allowed disabled:opacity-50">
                    <CreditCard size={16} />
                    Record Payment
                  </button>
                  <button onClick={() => handleAddCharge(folio)} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    <PlusCircle size={16} />
                    Add Charge
                  </button>
                  <button onClick={() => handleGenerateInvoice(folio)} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    <ReceiptText size={16} />
                    Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
