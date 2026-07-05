import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../../ui/Card';
import { Search, Download, Receipt, CalendarDays, X } from 'lucide-react';

const bills = [
  { id: 'BL-1001', guest: 'Sarah Jenkins', property: 'Grand Horizon Resort', status: 'Paid', amount: 'Rs. 45,000', date: 'Jun 28, 2024' },
  { id: 'BL-1002', guest: 'Michael Chen', property: 'City Central Hotel', status: 'Pending', amount: 'Rs. 28,000', date: 'Jun 25, 2024' },
  { id: 'BL-1003', guest: 'Emma Watson', property: 'Oceanview Villa', status: 'Paid', amount: 'Rs. 85,000', date: 'Jun 20, 2024' },
  { id: 'BL-1004', guest: 'James Wilson', property: 'Grand Horizon Resort', status: 'Overdue', amount: 'Rs. 32,000', date: 'Jun 18, 2024' },
  { id: 'BL-1005', guest: 'Olivia Davis', property: 'City Central Hotel', status: 'Paid', amount: 'Rs. 55,000', date: 'Jun 15, 2024' },
];

export function Billing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedBill, setSelectedBill] = useState<(typeof bills)[number] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedBill(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBills = bills.filter((bill) => {
    const matchesFilter = activeFilter === 'All' || bill.status === activeFilter;
    const matchesSearch = bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusClasses = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Billing</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Review all bills, billing history, and printable statements.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all shadow-sm">
            <Download size={16} />
            Export All
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-medium text-sm transition-all shadow-sm">
            <Receipt size={16} />
            Print All
          </button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between bg-gray-50/30">
          <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bills..."
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              {['All', 'Paid', 'Pending', 'Overdue'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bill ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{bill.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bill.guest}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bill.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{bill.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClasses[bill.status]}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedBill(bill)}
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CalendarDays size={14} />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div ref={modalRef} className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#689249]">Billing Details</p>
                <h3 className="text-xl font-bold text-gray-900">{selectedBill.id}</h3>
              </div>
              <button onClick={() => setSelectedBill(null)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Guest</span><span className="font-semibold text-gray-900">{selectedBill.guest}</span></div>
              <div className="flex justify-between"><span>Property</span><span className="font-semibold text-gray-900">{selectedBill.property}</span></div>
              <div className="flex justify-between"><span>Amount</span><span className="font-semibold text-gray-900">{selectedBill.amount}</span></div>
              <div className="flex justify-between"><span>Date</span><span className="font-semibold text-gray-900">{selectedBill.date}</span></div>
              <div className="flex justify-between"><span>Status</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[selectedBill.status]}`}>{selectedBill.status}</span></div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedBill(null)} className="rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white hover:bg-[#557A3A]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
