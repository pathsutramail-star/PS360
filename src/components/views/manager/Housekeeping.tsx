import React, { useState, useRef, useEffect } from 'react';
import { Brush, CheckCircle, Clock, AlertCircle, Users, Calendar, X, Plus, Filter, Search, MoreHorizontal, Play, Edit } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';
type Status = 'Cleaned' | 'Cleaning' | 'Delayed' | 'Pending';

interface Task {
  id: string;
  room: string;
  staff: string;
  priority: Priority;
  status: Status;
}

const initialTasks: Task[] = [
  { id: '1', room: '101 - Deluxe', staff: 'Maria Garcia', priority: 'High', status: 'Cleaning' },
  { id: '2', room: '102 - Deluxe', staff: 'John Smith', priority: 'Medium', status: 'Pending' },
  { id: '3', room: '205 - Suite', staff: 'Sarah Johnson', priority: 'Urgent', status: 'Delayed' },
  { id: '4', room: '304 - Standard', staff: 'Maria Garcia', priority: 'Low', status: 'Cleaned' },
];

export function Housekeeping() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
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
  
  // Assign Form State
  const [newRoom, setNewRoom] = useState('');
  const [newStaff, setNewStaff] = useState('Maria Garcia');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom) {
      notify('Please enter a room number', 'error');
      return;
    }
    
    const newTask: Task = {
      id: Date.now().toString(),
      room: newRoom,
      staff: newStaff,
      priority: newPriority,
      status: 'Pending',
    };
    
    setTasks([...tasks, newTask]);
    setIsAssignModalOpen(false);
    setNewRoom('');
    notify('Room assigned successfully', 'success');
  };

  const handleApprove = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Cleaned' } : t));
    notify('Cleaning approved', 'success');
  };

  const handleStatusChange = (taskId: string, newStatus: Status) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    notify(`Task marked as ${newStatus}`, 'success');
  };

  const handlePriorityChange = (taskId: string, newPriority: Priority) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, priority: newPriority } : t));
    notify(`Priority changed to ${newPriority}`, 'success');
  };

  const pendingApproval = tasks.filter(t => t.status !== 'Cleaned');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Housekeeping Management</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage cleaning tasks and housekeeping staff.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsAssignModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm shadow-sm transition-all"
          >
            Assign Rooms
          </button>
          <button 
            onClick={() => setIsApproveModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
          >
            Approve Cleaning
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Brush size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Rooms to Clean</p>
            <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Pending').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Under Cleaning</p>
            <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Cleaning').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Cleaned Rooms</p>
            <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Cleaned').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Delayed</p>
            <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Delayed').length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-gray-900">Cleaning Schedule</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search room..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249]"
                />
              </div>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                <Filter size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Assigned Staff</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{task.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.staff}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                        task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        task.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                        task.status === 'Cleaned' ? 'bg-green-50 text-green-700 border-green-200' :
                        task.status === 'Cleaning' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        task.status === 'Delayed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <div className="relative inline-block text-left" ref={activeDropdown === task.id ? dropdownRef : null}>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === task.id ? null : task.id)}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        
                        {activeDropdown === task.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                            {task.status !== 'Cleaned' && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(task.id, 'Cleaned');
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle size={16} className="text-emerald-500" />
                                Mark Cleaned
                              </button>
                            )}
                            {task.status === 'Pending' && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(task.id, 'Cleaning');
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Play size={16} className="text-blue-500" />
                                Start Cleaning
                              </button>
                            )}
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button 
                              onClick={() => {
                                handlePriorityChange(task.id, task.priority === 'Urgent' ? 'Medium' : 'Urgent');
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <AlertCircle size={16} className="text-amber-500" />
                              Toggle Urgent Priority
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

        <Card className="border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Housekeeper List</h3>
            <Users size={18} className="text-gray-400" />
          </div>
          <div className="p-5 flex-1 bg-white space-y-4">
            {[
              { name: 'Maria Garcia', shift: 'Morning', progress: 75, completed: 3, total: 4 },
              { name: 'John Smith', shift: 'Morning', progress: 40, completed: 2, total: 5 },
              { name: 'Sarah Johnson', shift: 'Afternoon', progress: 0, completed: 0, total: 3 },
            ].map((staff, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{staff.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Calendar size={12} /> {staff.shift} Shift</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[#689249]">{staff.progress}%</span>
                    <span className="text-[10px] text-gray-400 font-medium">{staff.completed}/{staff.total} Tasks</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-[#689249] h-1.5 rounded-full" style={{ width: `${staff.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Assign Room Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Assign Room</h2>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAssign} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Room Number / Name</label>
                  <input 
                    type="text" 
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. 105 - Standard"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Staff</label>
                  <select 
                    value={newStaff}
                    onChange={(e) => setNewStaff(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  >
                    <option value="Maria Garcia">Maria Garcia</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority Level</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm"
                >
                  Assign Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Cleaning Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Approve Cleaning</h2>
              <button 
                onClick={() => setIsApproveModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {pendingApproval.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle size={48} className="mx-auto text-green-200 mb-4" />
                    <p className="font-semibold">All rooms are approved!</p>
                  </div>
                ) : (
                  pendingApproval.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                      <div>
                        <h4 className="font-bold text-gray-900">{task.room}</h4>
                        <p className="text-sm text-gray-500">Cleaned by {task.staff}</p>
                      </div>
                      <button
                        onClick={() => handleApprove(task.id)}
                        className="px-4 py-2 bg-white border border-gray-200 text-[#689249] hover:bg-green-50 hover:border-green-200 rounded-lg font-bold text-sm transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
