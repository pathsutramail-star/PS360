import React, { useEffect, useRef, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, UserCheck, Shield, Clock, Star, Eye, Bell, CheckCircle2, X } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

const initialStaff = [
  { id: 'E-001', name: 'Alice Cooper', role: 'General Manager', department: 'Management', status: 'Active', shift: 'Morning', points: 920 },
  { id: 'E-002', name: 'Robert Fox', role: 'Front Desk Lead', department: 'Reception', status: 'Active', shift: 'Morning', points: 780 },
  { id: 'E-003', name: 'Jenny Wilson', role: 'Housekeeping', department: 'Maintenance', status: 'On Leave', shift: 'Morning', points: 610 },
  { id: 'E-004', name: 'Wade Warren', role: 'Chef de Cuisine', department: 'Kitchen', status: 'Active', shift: 'Evening', points: 860 },
  { id: 'E-005', name: 'Guy Hawkins', role: 'Security Officer', department: 'Security', status: 'Active', shift: 'Night', points: 530 },
];

const topPerformer = initialStaff.reduce((best, current) => current.points > best.points ? current : best, initialStaff[0]);

export function Staff() {
  const [staff, setStaff] = useState(initialStaff);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof initialStaff[number] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const manager = staff.find((emp) => emp.role.toLowerCase().includes('manager'));

  const totalPoints = staff.reduce((sum, emp) => sum + emp.points, 0);

  const handleSetManager = (id: string) => {
    setStaff(staff.map((emp) =>
      emp.id === id ? { ...emp, role: 'Property Manager' } : emp
    ));
    notify('Manager role assigned', 'success');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 text-sm">Manage employee directory, roles, and attendance.</p>
          <p className="text-gray-500 text-sm mt-1">Track loyalty points and year-end hotel credit awards for the highest scoring staff member.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {manager && (
        <div className="rounded-2xl border border-[#689249]/20 bg-[#689249]/10 px-4 py-3 text-sm text-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <Shield size={16} className="text-[#689249]" /> Current manager: {manager.name}
          </div>
          <p className="mt-1 text-sm text-gray-600">{manager.role} • {manager.department}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Employees', value: '42', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Active on Shift', value: '18', icon: Clock, color: 'text-[#689249]', bg: 'bg-[#689249]/10' },
          { title: 'Total Loyalty Points', value: totalPoints.toLocaleString(), icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Year-End Leader', value: topPerformer.name, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
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
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Loyalty Points</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative inline-block" ref={activeMenuId === emp.id ? dropdownRef : null}>
                      <button onClick={() => setActiveMenuId(activeMenuId === emp.id ? null : emp.id)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                      {activeMenuId === emp.id && (
                        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-xl z-10">
                          <button onClick={() => { setActiveMenuId(null); notify(`Viewing profile for ${emp.name}`, 'info'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                            <Eye size={14} className="text-[#689249]" /> View profile
                          </button>
                          <button onClick={() => { setActiveMenuId(null); notify(`Reminder sent to ${emp.name}`, 'success'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                            <Bell size={14} className="text-amber-500" /> Send reminder
                          </button>
                          <button onClick={() => { setActiveMenuId(null); notify(`${emp.name} marked as manager`, 'success'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                            <CheckCircle2 size={14} className="text-blue-500" /> Set manager
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

      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#689249]">Employee Profile</p>
                <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Role</span><span className="font-semibold text-gray-900">{selectedEmployee.role}</span></div>
              <div className="flex justify-between"><span>Department</span><span className="font-semibold text-gray-900">{selectedEmployee.department}</span></div>
              <div className="flex justify-between"><span>Shift</span><span className="font-semibold text-gray-900">{selectedEmployee.shift}</span></div>
              <div className="flex justify-between"><span>Loyalty Points</span><span className="font-semibold text-gray-900">{selectedEmployee.points}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="font-semibold text-gray-900">{selectedEmployee.status}</span></div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedEmployee(null)} className="rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white hover:bg-[#557A3A]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
