import React, { useState } from 'react';
import { Search, Filter, Download, MoreVertical, Plus, Calendar, User, MapPin, AlertTriangle, Printer, Receipt, X } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';
import { BookingModal, Booking } from '../shared/BookingModal';
import { AddBookingModal, type BookingFormData } from '../shared/AddBookingModal';

const initialBookings: Booking[] = [
  { id: 'BK-7829', guest: 'Sarah Jenkins', property: 'Grand Horizon Resort', room: 'Deluxe Suite', checkIn: 'Oct 24, 2023', checkOut: 'Oct 28, 2023', status: 'Confirmed', amount: 'Rs. 45000' },
  { id: 'BK-7828', guest: 'Michael Chen', property: 'City Central Hotel', room: 'Standard Queen', checkIn: 'Oct 24, 2023', checkOut: 'Oct 26, 2023', status: 'Checked-in', amount: 'Rs. 28000' },
  { id: 'BK-7827', guest: 'Emma Watson', property: 'Oceanview Villa', room: 'Ocean Front Villa', checkIn: 'Oct 23, 2023', checkOut: 'Oct 30, 2023', status: 'Pending', amount: 'Rs. 85000' },
  { id: 'BK-7826', guest: 'James Wilson', property: 'Grand Horizon Resort', room: 'Premium King', checkIn: 'Oct 23, 2023', checkOut: 'Oct 25, 2023', status: 'Confirmed', amount: 'Rs. 32000' },
  { id: 'BK-7825', guest: 'Olivia Davis', property: 'City Central Hotel', room: 'Executive Suite', checkIn: 'Oct 22, 2023', checkOut: 'Oct 24, 2023', status: 'Checked-out', amount: 'Rs. 55000' },
  { id: 'BK-7824', guest: 'William Taylor', property: 'Himalayan Café', room: 'Table 4 (Event)', checkIn: 'Oct 24, 2023', checkOut: 'Oct 24, 2023', status: 'Cancelled', amount: 'Rs. 12000' },
];

const defaultProperties = ['Grand Horizon Resort', 'City Central Hotel', 'Oceanview Villa', 'Himalayan Café'];
const filterOptions = ['All', 'Confirmed', 'Checked-in', 'Checked-out', 'Pending', 'Cancelled'];

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const parseAmount = (amount: string) => Number(amount.replace(/[^0-9.]/g, '')) || 0;
  const formatAmount = (value: number) => `Rs. ${value.toLocaleString()}`;

  const printBill = (booking: Booking) => {
    if (typeof window === 'undefined') return;
    const baseAmount = parseAmount(booking.amount);
    const serviceCharge = 1500;
    const tax = 3250;
    const total = baseAmount + serviceCharge + tax;

    const html = `
      <html>
        <head>
          <title>Bill ${booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
            .heading { font-size: 24px; font-weight: 700; }
            .sub { color: #6b7280; margin-top: 4px; }
            .box { border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .table th, .table td { padding: 12px 10px; border-bottom: 1px solid #e5e7eb; }
            .table th { text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
            .total { font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="heading">Bill</div>
              <div class="sub">Booking ID: ${booking.id}</div>
              <div class="sub">Guest: ${booking.guest}</div>
            </div>
            <div>
              <div class="sub">${new Date().toLocaleDateString()}</div>
              <div class="sub">${booking.property}</div>
            </div>
          </div>
          <div class="box">
            <div style="margin-bottom: 16px; font-weight: 600;">Charge Breakdown</div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Room charge</td><td>${formatAmount(baseAmount)}</td></tr>
                <tr><td>Service charge</td><td>${formatAmount(serviceCharge)}</td></tr>
                <tr><td>Tax</td><td>${formatAmount(tax)}</td></tr>
                <tr class="total"><td>Total</td><td>${formatAmount(total)}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="sub">Thank you for choosing our hotel. Please retain this bill for your records.</div>
        </body>
      </html>
    `;

    const billWindow = window.open('', '_blank');
    if (billWindow) {
      billWindow.document.write(html);
      billWindow.document.close();
      billWindow.focus();
      billWindow.print();
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = activeFilter === 'All' || booking.status === activeFilter;
    const matchesSearch = booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddBooking = (bookingData: BookingFormData) => {
    const newBooking: Booking = {
      id: `BK-${Math.floor(Math.random() * 10000) + 1000}`,
      guest: bookingData.guestName,
      property: bookingData.property,
      room: bookingData.roomType || 'Standard Room',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      status: 'Confirmed',
      amount: bookingData.amount ? `Rs. ${bookingData.amount}` : 'Rs. 0',
    };

    setBookings(prevBookings => [newBooking, ...prevBookings]);
    setIsAddModalOpen(false);
  };

  const handleEditBooking = (booking: Booking) => {
    setBookings(prevBookings => prevBookings.map(b => b.id === booking.id ? booking : b));
    notify('Booking updated successfully', 'success');
    setIsEditModalOpen(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = () => {
    if (bookingToDelete) {
      setBookings(bookings.filter(b => b.id !== bookingToDelete.id));
      notify('Booking deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Bookings</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage all reservations and guest stays.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => notify('Exporting CSV...', 'info')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all shadow-sm"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => {
              setEditingBooking(null);
              setIsAddModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            New booking
          </button>
        </div>
      </div>

      <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between bg-gray-50/30">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#689249]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by guest, ID or property..." 
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>
            <button 
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-sm shadow-sm transition-all"
            >
              <Filter size={16} className="text-gray-500" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar scroll-smooth hide-scrollbar">
            {filterOptions.map((filter) => (
              <button 
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeFilter === filter 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Booking Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Property details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Billing</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {currentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#689249]/10 text-[#689249] flex items-center justify-center font-bold text-sm border border-[#689249]/20 shadow-sm">
                        {booking.guest.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 group-hover:text-[#689249] transition-colors">{booking.guest}</div>
                        <div className="text-xs font-medium text-gray-500 mt-0.5">{booking.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5"><MapPin size={12} className="text-gray-400"/> {booking.property}</span>
                      <span className="text-xs font-medium text-gray-500 mt-1 pl-4">{booking.room}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {booking.checkIn}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {booking.checkOut}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{booking.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                      booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 
                      booking.status === 'Checked-in' ? 'bg-blue-50 text-blue-700 border-blue-200/60' : 
                      booking.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                      booking.status === 'Checked-out' ? 'bg-gray-50 text-gray-700 border-gray-200/60' :
                      'bg-rose-50 text-rose-700 border-rose-200/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                        booking.status === 'Confirmed' ? 'bg-emerald-500' : 
                        booking.status === 'Checked-in' ? 'bg-blue-500' : 
                        booking.status === 'Pending' ? 'bg-amber-500' :
                        booking.status === 'Checked-out' ? 'bg-gray-500' :
                        'bg-rose-500'
                      }`}></span>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedBill(booking)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <Receipt size={14} />
                      View Bill
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === booking.id ? null : booking.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-200"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    
                    {activeMenu === booking.id && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in duration-200 text-left">
                        <button 
                          onClick={() => {
                            setEditingBooking(booking);
                            setIsEditModalOpen(true);
                            setActiveMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                          Edit Booking
                        </button>
                        <button 
                          onClick={() => {
                            setBookingToDelete(booking);
                            setIsDeleteModalOpen(true);
                            setActiveMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                        >
                          Delete Booking
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-12 bg-white">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={20} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No bookings found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
        
        {filteredBookings.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
            <div className="font-medium">Showing <span className="text-gray-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of <span className="text-gray-900 font-bold">{filteredBookings.length}</span> bookings</div>
            
            {totalPages > 1 && (
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors shadow-sm font-medium bg-gray-50"
                >
                  Prev
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3.5 py-1.5 rounded-lg shadow-sm font-medium transition-colors ${
                      currentPage === page 
                        ? 'bg-gray-900 text-white' 
                        : 'border border-gray-200 hover:bg-white hover:text-gray-900 bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white hover:text-gray-900 disabled:opacity-50 transition-colors shadow-sm font-medium bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {isAddModalOpen && (
        <AddBookingModal 
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddBooking}
        />
      )}

      {isEditModalOpen && editingBooking && (
        <BookingModal 
          booking={editingBooking}
          propertyOptions={defaultProperties}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingBooking(null);
          }}
          onSave={handleEditBooking}
        />
      )}

      {selectedBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedBill(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bill Preview</h3>
                <p className="text-sm text-gray-500 mt-1">Booking bill for {selectedBill.guest}</p>
              </div>
              <button 
                onClick={() => setSelectedBill(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Booking ID</h4>
                  <p className="text-sm text-gray-900 mt-1">{selectedBill.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Guest</h4>
                  <p className="text-sm text-gray-900 mt-1">{selectedBill.guest}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Property</h4>
                  <p className="text-sm text-gray-900 mt-1">{selectedBill.property}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Room</h4>
                  <p className="text-sm text-gray-900 mt-1">{selectedBill.room}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Check-In</h4>
                  <p className="text-sm text-gray-900 mt-1">{selectedBill.checkIn}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Check-Out</h4>
                  <p className="text-sm text-gray-900 mt-1">{selectedBill.checkOut}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Status</h4>
                  <p className="text-sm text-gray-900 mt-1">{selectedBill.status}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBill.amount}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Service Charge</span>
                  <span className="text-sm font-semibold text-gray-900">Rs. 1,500</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Tax</span>
                  <span className="text-sm font-semibold text-gray-900">Rs. 3,250</span>
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {parseInt(selectedBill.amount.replace(/[^0-9]/g, '')) + 1500 + 3250}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end bg-white">
              <button 
                onClick={() => setSelectedBill(null)}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Close
              </button>
              <button 
                onClick={() => selectedBill && printBill(selectedBill)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#689249] text-white rounded-xl font-semibold hover:bg-[#557A3A] transition-colors text-sm shadow-sm"
              >
                <Printer size={16} />
                Print Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && bookingToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Booking?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to cancel the booking for <span className="font-semibold text-gray-900">{bookingToDelete.guest}</span>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Go Back
              </button>
              <button 
                onClick={handleDeleteBooking}
                className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors text-sm shadow-sm"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
