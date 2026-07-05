import React, { useState, useRef, useEffect } from 'react';
import { CreditCard, Download, Search, Filter, Plus, FileText, CheckCircle, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

interface Invoice {
  id: string;
  guestName: string;
  room: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
}

const initialInvoices: Invoice[] = [
  { id: 'INV-2024-001', guestName: 'Eleanor Pena', room: '101', amount: 450.00, date: 'Jun 08, 2024', status: 'Paid' },
  { id: 'INV-2024-002', guestName: 'Wade Warren', room: '205', amount: 820.50, date: 'Jun 09, 2024', status: 'Pending' },
  { id: 'INV-2024-003', guestName: 'Brooklyn Simmons', room: '304', amount: 150.00, date: 'Jun 05, 2024', status: 'Overdue' },
  { id: 'INV-2024-004', guestName: 'Cameron Williamson', room: '102', amount: 1200.00, date: 'Jun 09, 2024', status: 'Paid' },
  { id: 'INV-2024-005', guestName: 'Leslie Alexander', room: '401', amount: 340.00, date: 'Jun 10, 2024', status: 'Pending' },
];

export function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.room.includes(searchTerm)
  );

  const handleDownload = (id: string) => {
    notify(`Downloading invoice ${id}...`, 'success');
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle size={12} /> Paid</span>;
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> Pending</span>;
      case 'Overdue':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle size={12} /> Overdue</span>;
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage guest payments, generate invoices, and track revenue.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm shadow-sm transition-all">
            <Download size={16} />
            Export Data
          </button>
          <button 
            onClick={() => notify('Create invoice feature coming soon', 'info')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
          >
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <CreditCard size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Collected Revenue (This Month)</p>
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Clock size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Pending Payments</p>
            <p className="text-2xl font-bold text-gray-900">${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
          </div>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-gray-900 text-lg">Recent Invoices</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search invoices..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249]"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Guest & Room</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{invoice.guestName}</div>
                      <div className="text-xs text-gray-500">Room {invoice.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <div className="relative inline-block text-left" ref={activeDropdown === invoice.id ? dropdownRef : null}>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === invoice.id ? null : invoice.id)}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        
                        {activeDropdown === invoice.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                            {invoice.status !== 'Paid' && (
                              <button 
                                onClick={() => {
                                  setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, status: 'Paid' } : i));
                                  notify(`Invoice ${invoice.id} marked as Paid`, 'success');
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle size={16} className="text-emerald-500" />
                                Mark Paid
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                handleDownload(invoice.id);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Download size={16} className="text-gray-400" />
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No invoices found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
