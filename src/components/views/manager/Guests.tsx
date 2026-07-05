import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Download, MoreHorizontal, Mail, Phone, Star, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

const initialCustomers = [
  { id: 'C-1029', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 555-0123', bookings: 4, points: 1250, status: 'Active' },
  { id: 'C-1028', name: 'Michael Chen', email: 'm.chen@example.com', phone: '+1 555-0124', bookings: 12, points: 4500, status: 'VIP' },
  { id: 'C-1027', name: 'Emma Watson', email: 'emma.w@example.com', phone: '+1 555-0125', bookings: 1, points: 150, status: 'New' },
  { id: 'C-1026', name: 'James Wilson', email: 'j.wilson@example.com', phone: '+1 555-0126', bookings: 7, points: 2100, status: 'Active' },
  { id: 'C-1025', name: 'Olivia Davis', email: 'olivia.d@example.com', phone: '+1 555-0127', bookings: 2, points: 450, status: 'Active' },
];

export function Guests() {
  const [customers, setCustomers] = useState(initialCustomers);
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

  const handleDelete = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    notify('Customer deleted successfully', 'success');
    setActiveDropdown(null);
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Customer Management</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage customer profiles, booking history, and loyalty programs.</p>
        </div>
        <button 
          onClick={() => notify('Exporting Customer Data...', 'info')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all shadow-sm"
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#689249]" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all placeholder:text-gray-400"
              />
            </div>
            <button 
              onClick={() => notify('Filter options opened', 'info')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm shadow-sm transition-all"
            >
              <Filter size={16} className="text-gray-500" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loyalty Points</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{customer.bookings}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                      {customer.points.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border
                      ${customer.status === 'VIP' ? 'bg-purple-50 text-purple-700 border-purple-200/60' : 
                        customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 
                        'bg-blue-50 text-blue-700 border-blue-200/60'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <div className="relative inline-block text-left" ref={activeDropdown === customer.id ? dropdownRef : null}>
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === customer.id ? null : customer.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeDropdown === customer.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                          <button 
                            onClick={() => {
                              notify(`Viewing profile for ${customer.name}`, 'info');
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye size={16} className="text-gray-400" />
                            View Profile
                          </button>
                          <button 
                            onClick={() => {
                              notify(`Editing details for ${customer.name}`, 'info');
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit size={16} className="text-gray-400" />
                            Edit Details
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button 
                            onClick={() => handleDelete(customer.id)}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete Customer
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
      </Card>
    </div>
  );
}
