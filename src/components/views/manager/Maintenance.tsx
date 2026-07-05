import React, { useState, useRef, useEffect } from 'react';
import { Wrench, CheckCircle, Clock, AlertTriangle, PenTool, Plus, X, MoreHorizontal, Play } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Pending' | 'Scheduled' | 'In Progress' | 'Completed';

interface Request {
  id: string;
  location: string;
  issue: string;
  priority: Priority;
  status: Status;
  tech: string;
}

const initialRequests: Request[] = [
  { id: 'REQ-1042', location: 'Room 305', issue: 'AC not cooling', priority: 'High', status: 'In Progress', tech: 'Mike T.' },
  { id: 'REQ-1043', location: 'Lobby Restroom', issue: 'Leaking faucet', priority: 'Medium', status: 'Pending', tech: 'Unassigned' },
  { id: 'REQ-1044', location: 'Kitchen', issue: 'Oven display broken', priority: 'High', status: 'Scheduled', tech: 'Sarah C.' },
  { id: 'REQ-1045', location: 'Room 112', issue: 'TV remote batteries', priority: 'Low', status: 'Completed', tech: 'David K.' },
];

export function Maintenance() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [newRequest, setNewRequest] = useState<Partial<Request>>({
    location: '', issue: '', priority: 'Medium', status: 'Pending', tech: 'Unassigned'
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

  const handleStatusChange = (id: string, newStatus: Status) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    notify(`Request ${id} status updated to ${newStatus}`, 'success');
  };

  const handleDelete = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    notify(`Request ${id} deleted`, 'success');
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequest.location && newRequest.issue) {
      const newReq: Request = {
        id: `REQ-${1046 + requests.length}`,
        location: newRequest.location,
        issue: newRequest.issue,
        priority: newRequest.priority as Priority,
        status: newRequest.status as Status,
        tech: newRequest.tech || 'Unassigned'
      };
      setRequests([...requests, newReq]);
      notify('Maintenance request created', 'success');
      setIsAddModalOpen(false);
      setNewRequest({ location: '', issue: '', priority: 'Medium', status: 'Pending', tech: 'Unassigned' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Maintenance</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage property repairs and maintenance tickets.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">High Priority</p>
            <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.priority === 'High' && r.status !== 'Completed').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'In Progress').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wrench size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Scheduled</p>
            <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'Scheduled').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'Completed').length}</p>
          </div>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Active Maintenance Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{req.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{req.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      req.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                      req.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                      req.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      req.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      req.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{req.tech}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <div className="relative inline-block text-left" ref={activeDropdown === req.id ? dropdownRef : null}>
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {activeDropdown === req.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                          {req.status !== 'Completed' && (
                            <button 
                              onClick={() => {
                                handleStatusChange(req.id, 'Completed');
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle size={16} className="text-emerald-500" />
                              Mark Complete
                            </button>
                          )}
                          {req.status === 'Pending' && (
                            <button 
                              onClick={() => {
                                handleStatusChange(req.id, 'In Progress');
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Play size={16} className="text-blue-500" />
                              Start Job
                            </button>
                          )}
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button 
                            onClick={() => {
                              notify(`Editing request ${req.id}`, 'info');
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <PenTool size={16} className="text-gray-400" />
                            Edit Request
                          </button>
                          <button 
                            onClick={() => handleDelete(req.id)}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <X size={16} />
                            Delete Request
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

      {/* Add Request Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">New Maintenance Request</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddRequest} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Room 305, Lobby"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Description</label>
                  <input 
                    type="text" 
                    value={newRequest.issue}
                    onChange={(e) => setNewRequest({...newRequest, issue: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. AC not cooling"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                    <select 
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({...newRequest, priority: e.target.value as Priority})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Tech</label>
                    <input 
                      type="text" 
                      value={newRequest.tech}
                      onChange={(e) => setNewRequest({...newRequest, tech: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                      placeholder="e.g. Mike T."
                    />
                  </div>
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
