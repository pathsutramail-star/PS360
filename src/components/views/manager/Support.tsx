import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle, Clock, Plus, Star, X, MoreHorizontal, Play } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
type Priority = 'High' | 'Medium' | 'Low';

interface Ticket {
  id: string;
  guest: string;
  room: string;
  subject: string;
  status: TicketStatus;
  priority: Priority;
  time: string;
}

const initialTickets: Ticket[] = [
  { id: 'TKT-001', guest: 'Michael Johnson', room: '205', subject: 'Wi-Fi connection issues', status: 'Open', priority: 'High', time: '10:15 AM' },
  { id: 'TKT-002', guest: 'Sarah Jenkins', room: '102', subject: 'Extra pillows requested', status: 'Resolved', priority: 'Low', time: '09:30 AM' },
  { id: 'TKT-003', guest: 'David Lee', room: '304', subject: 'Late checkout inquiry', status: 'In Progress', priority: 'Medium', time: '08:45 AM' },
  { id: 'TKT-004', guest: 'Ava Smith', room: '218', subject: 'Room cleaning request', status: 'Open', priority: 'Medium', time: '11:00 AM' },
];

export function Support() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [activeTab, setActiveTab] = useState<'tickets' | 'feedback'>('tickets');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    guest: '', room: '', subject: '', priority: 'Medium', status: 'Open'
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (id: string, newStatus: TicketStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    notify(`Ticket ${id} marked as ${newStatus}`, 'success');
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicket.guest && newTicket.subject) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newTkt: Ticket = {
        id: `TKT-00${tickets.length + 1}`,
        guest: newTicket.guest,
        room: newTicket.room || 'N/A',
        subject: newTicket.subject,
        priority: newTicket.priority as Priority,
        status: newTicket.status as TicketStatus,
        time: timeStr
      };
      setTickets([newTkt, ...tickets]);
      notify('Ticket created', 'success');
      setIsAddModalOpen(false);
      setNewTicket({ guest: '', room: '', subject: '', priority: 'Medium', status: 'Open' });
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle size={12} /> Open</span>;
      case 'In Progress': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> In Progress</span>;
      case 'Resolved': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle size={12} /> Resolved</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Customer Support</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Handle guest complaints, feedback, and requests.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Open Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.status === 'Open').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Resolved Today</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.status === 'Resolved').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star size={24} className="fill-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Avg Satisfaction</p>
            <p className="text-2xl font-bold text-gray-900">4.8/5</p>
          </div>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-white">
          <div className="flex px-4 pt-4 gap-6">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'tickets' ? 'border-[#689249] text-[#689249]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Active Tickets
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'feedback' ? 'border-[#689249] text-[#689249]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Guest Feedback
            </button>
          </div>
        </div>

        {activeTab === 'tickets' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Guest & Room</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{ticket.id}</div>
                      <div className="text-xs text-gray-500">{ticket.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{ticket.guest}</div>
                      <div className="text-xs text-gray-500">Room {ticket.room}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{ticket.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ticket.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                        ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <div className="relative inline-block text-left" ref={activeDropdown === ticket.id ? dropdownRef : null}>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === ticket.id ? null : ticket.id)}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        
                        {activeDropdown === ticket.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                            {ticket.status !== 'Resolved' && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(ticket.id, 'Resolved');
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle size={16} className="text-emerald-500" />
                                Mark Resolved
                              </button>
                            )}
                            {ticket.status === 'Open' && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(ticket.id, 'In Progress');
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Play size={16} className="text-blue-500" />
                                Start Working
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Guest & Room</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  { date: 'Oct 15, 2023', guest: 'Emily Clark', room: '105', rating: 5, comments: 'Absolutely wonderful stay! The bed was so comfortable and staff were lovely.' },
                  { date: 'Oct 14, 2023', guest: 'Robert Fox', room: '302', rating: 4, comments: 'Good experience overall. Breakfast could have more options.' },
                  { date: 'Oct 12, 2023', guest: 'Amanda Todd', room: '210', rating: 2, comments: 'The AC in our room was very noisy, hard to sleep.' },
                ].map((fb, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {fb.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{fb.guest}</div>
                      <div className="text-xs text-gray-500">Room {fb.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      "{fb.comments}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Ticket Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">New Support Ticket</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTicket} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Name</label>
                  <input 
                    type="text" 
                    value={newTicket.guest}
                    onChange={(e) => setNewTicket({...newTicket, guest: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Room Number (Optional)</label>
                  <input 
                    type="text" 
                    value={newTicket.room}
                    onChange={(e) => setNewTicket({...newTicket, room: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. 205"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject/Issue</label>
                  <input 
                    type="text" 
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. AC not working"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                  <select 
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as Priority})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
