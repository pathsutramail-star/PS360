import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, UserCheck, Shield, Clock, Star, Edit, Trash2, Award, X } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

const initialStaff = [
  { id: 'E-001', name: 'Alice Cooper', role: 'General Manager', department: 'Management', status: 'Active', shift: 'Morning', points: 1250 },
  { id: 'E-002', name: 'Robert Fox', role: 'Front Desk Lead', department: 'Reception', status: 'Active', shift: 'Morning', points: 840 },
  { id: 'E-003', name: 'Jenny Wilson', role: 'Housekeeping', department: 'Maintenance', status: 'On Leave', shift: 'Morning', points: 620 },
  { id: 'E-004', name: 'Wade Warren', role: 'Chef de Cuisine', department: 'Kitchen', status: 'Active', shift: 'Evening', points: 1100 },
  { id: 'E-005', name: 'Guy Hawkins', role: 'Security Officer', department: 'Security', status: 'Active', shift: 'Night', points: 950 },
];

export function Staff() {
  const [staff, setStaff] = useState(initialStaff);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<typeof staff[0] | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', department: '', shift: 'Morning', status: 'Active' });
  const [editEmployee, setEditEmployee] = useState({ id: '', name: '', role: '', department: '', shift: 'Morning', status: 'Active', points: 0 });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaff && pointsToAdd) {
      const amount = parseInt(pointsToAdd);
      setStaff(staff.map(s => s.id === selectedStaff.id ? { ...s, points: s.points + amount } : s));
      notify(`Added ${amount} points to ${selectedStaff.name}`, 'success');
      setIsPointsModalOpen(false);
      setPointsToAdd('');
      setSelectedStaff(null);
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployee.name && newEmployee.role && newEmployee.department) {
      const newId = `E-00${staff.length + 1}`;
      setStaff([...staff, { ...newEmployee, id: newId, points: 0 }]);
      notify('Employee added successfully', 'success');
      setIsAddModalOpen(false);
      setNewEmployee({ name: '', role: '', department: '', shift: 'Morning', status: 'Active' });
    } else {
      notify('Please fill in all required fields', 'error');
    }
  };

  const handleEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEmployee.name && editEmployee.role && editEmployee.department) {
      setStaff(staff.map(s => s.id === editEmployee.id ? editEmployee : s));
      notify('Employee updated successfully', 'success');
      setIsEditModalOpen(false);
    } else {
      notify('Please fill in all required fields', 'error');
    }
  };

  const handleDelete = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
    notify('Employee removed successfully', 'success');
    setActiveDropdown(null);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 text-sm">Manage employee directory, roles, and attendance.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-medium text-sm transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {staff.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100 shadow-sm overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="p-6 flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
              <Star size={32} className="text-amber-500 fill-amber-500" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">Star Employee of the Month</h3>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{[...staff].sort((a, b) => b.points - a.points)[0].name}</h2>
                <span className="text-gray-500 font-medium text-sm">
                  ({[...staff].sort((a, b) => b.points - a.points)[0].role})
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">Leading with <span className="font-bold text-amber-600">{[...staff].sort((a, b) => b.points - a.points)[0].points}</span> reward points!</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Total Employees', value: '42', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Active on Shift', value: '18', icon: Clock, color: 'text-[#689249]', bg: 'bg-[#689249]/10' },
          { title: 'System Admins', value: '3', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <div className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search staff..." 
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#689249] focus:border-transparent transition-all"
              />
            </div>
            <button 
              onClick={() => notify('Filter options opened', 'info')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Employee Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Role & Dept</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Shift</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Reward Points</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {staff.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{emp.role}</div>
                    <div className="text-xs text-gray-500">{emp.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{emp.shift}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                      {emp.points.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border
                      ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <button 
                      onClick={(e) => toggleDropdown(e, emp.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {activeDropdown === emp.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button 
                          onClick={() => {
                            setSelectedStaff(emp);
                            setIsPointsModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Award size={16} className="text-amber-500" />
                          Add Reward Points
                        </button>
                        <button 
                          onClick={() => {
                            setEditEmployee(emp);
                            setIsEditModalOpen(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" />
                          Edit Details
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Remove Staff
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Points Modal */}
      {isPointsModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Add Reward Points</h2>
              <button 
                onClick={() => setIsPointsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPoints} className="p-6">
              <div className="mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                  {selectedStaff.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedStaff.name}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Current Points: <span className="font-bold text-amber-600 flex items-center gap-1"><Star size={12} className="fill-amber-500" /> {selectedStaff.points.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Points to Add</label>
                <input 
                  type="number" 
                  min="1"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  placeholder="e.g. 100"
                  required
                />
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPointsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm"
                >
                  Add Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Add New Employee</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                  <input 
                    type="text" 
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Concierge"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Guest Services"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shift</label>
                    <select
                      value={newEmployee.shift}
                      onChange={(e) => setNewEmployee({...newEmployee, shift: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={newEmployee.status}
                      onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                    </select>
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Edit Employee</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditEmployee} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editEmployee.name}
                    onChange={(e) => setEditEmployee({...editEmployee, name: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                  <input 
                    type="text" 
                    value={editEmployee.role}
                    onChange={(e) => setEditEmployee({...editEmployee, role: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Concierge"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={editEmployee.department}
                    onChange={(e) => setEditEmployee({...editEmployee, department: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Guest Services"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shift</label>
                    <select
                      value={editEmployee.shift}
                      onChange={(e) => setEditEmployee({...editEmployee, shift: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={editEmployee.status}
                      onChange={(e) => setEditEmployee({...editEmployee, status: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
