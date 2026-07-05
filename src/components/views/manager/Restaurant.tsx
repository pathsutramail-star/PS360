import React, { useState, useRef, useEffect } from 'react';
import { UtensilsCrossed, Clock, CheckCircle, AlertCircle, Plus, Search, Filter, Coffee, Users, DollarSign, MoreHorizontal, Play } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

type OrderStatus = 'Preparing' | 'Ready' | 'Delivered' | 'Pending';
type TableStatus = 'Occupied' | 'Available' | 'Reserved';

interface Order {
  id: string;
  table: string;
  items: string[];
  total: number;
  status: OrderStatus;
  time: string;
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderTotal?: number;
}

const initialOrders: Order[] = [
  { id: 'ORD-101', table: 'Table 4', items: ['2x Cappuccino', '1x Avocado Toast'], total: 24.50, status: 'Preparing', time: '10:42 AM' },
  { id: 'ORD-102', table: 'Table 7', items: ['1x Grilled Salmon', '1x House Salad', '2x Lemonade'], total: 48.00, status: 'Ready', time: '10:30 AM' },
  { id: 'ORD-103', table: 'Table 2', items: ['3x Americano', '3x Croissant'], total: 21.00, status: 'Delivered', time: '10:15 AM' },
];

const initialTables: Table[] = [
  { id: 'T1', number: 1, capacity: 2, status: 'Available' },
  { id: 'T2', number: 2, capacity: 4, status: 'Occupied', currentOrderTotal: 21.00 },
  { id: 'T3', number: 3, capacity: 4, status: 'Reserved' },
  { id: 'T4', number: 4, capacity: 2, status: 'Occupied', currentOrderTotal: 24.50 },
  { id: 'T5', number: 5, capacity: 6, status: 'Available' },
  { id: 'T6', number: 6, capacity: 2, status: 'Available' },
  { id: 'T7', number: 7, capacity: 4, status: 'Occupied', currentOrderTotal: 48.00 },
  { id: 'T8', number: 8, capacity: 8, status: 'Available' },
];

export function Restaurant() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [activeTab, setActiveTab] = useState<'orders' | 'tables'>('orders');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ table: '', items: '', total: 0 });
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

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    notify(`Order ${orderId} marked as ${newStatus}`, 'success');
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrder.table && newOrder.items) {
      const itemsList = newOrder.items.split(',').map(item => item.trim());
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const order: Order = {
        id: `ORD-${100 + orders.length + 1}`,
        table: newOrder.table,
        items: itemsList,
        total: Number(newOrder.total) || 0,
        status: 'Pending',
        time: timeStr
      };
      
      setOrders([order, ...orders]);
      notify('New order created successfully', 'success');
      setIsNewOrderModalOpen(false);
      setNewOrder({ table: '', items: '', total: 0 });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Preparing': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> Preparing</span>;
      case 'Ready': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><CheckCircle size={12} /> Ready</span>;
      case 'Delivered': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle size={12} /> Delivered</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200"><AlertCircle size={12} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Restaurant & Café</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Manage tables, live orders, and kitchen flow.</p>
        </div>
        <button 
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
        >
          <Plus size={16} />
          New Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Active Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status !== 'Delivered').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Today's Sales</p>
            <p className="text-2xl font-bold text-gray-900">$1,284</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Occupied Tables</p>
            <p className="text-2xl font-bold text-gray-900">{tables.filter(t => t.status === 'Occupied').length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Coffee size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Popular Item</p>
            <p className="text-sm font-bold text-gray-900 leading-tight mt-1">Cappuccino</p>
          </div>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-white">
          <div className="flex px-4 pt-4 gap-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'orders' ? 'border-[#689249] text-[#689249]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Live Kitchen Orders
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'tables' ? 'border-[#689249] text-[#689249]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Table Management
            </button>
          </div>
        </div>

        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Table</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{order.id}</div>
                      <div className="text-xs text-gray-500">{order.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{order.table}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <ul className="list-disc list-inside">
                        {order.items.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <div className="relative inline-block text-left" ref={activeDropdown === order.id ? dropdownRef : null}>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        
                        {activeDropdown === order.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                            {order.status === 'Preparing' && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(order.id, 'Ready');
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle size={16} className="text-blue-500" />
                                Mark Ready
                              </button>
                            )}
                            {order.status === 'Ready' && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(order.id, 'Delivered');
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle size={16} className="text-emerald-500" />
                                Deliver
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

        {activeTab === 'tables' && (
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables.map(table => (
                <div 
                  key={table.id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:-translate-y-1 ${
                    table.status === 'Available' ? 'bg-white border-gray-100 hover:border-emerald-200' :
                    table.status === 'Occupied' ? 'bg-amber-50 border-amber-200' :
                    'bg-gray-100 border-gray-300'
                  }`}
                  onClick={() => notify(`Table ${table.number} selected`, 'info')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xl font-bold font-display text-gray-900">T{table.number}</span>
                    <span className="text-xs font-semibold text-gray-500">{table.capacity} seats</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      table.status === 'Available' ? 'text-emerald-600' :
                      table.status === 'Occupied' ? 'text-amber-700' :
                      'text-gray-600'
                    }`}>
                      {table.status}
                    </span>
                    {table.currentOrderTotal && (
                      <span className="text-sm font-bold text-gray-900">${table.currentOrderTotal.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">New Order</h2>
              <button 
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <AlertCircle size={20} className="opacity-0" />
              </button>
            </div>
            
            <form onSubmit={handleAddOrder} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Table Number</label>
                  <input 
                    type="text" 
                    value={newOrder.table}
                    onChange={(e) => setNewOrder({...newOrder, table: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Table 5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Items (comma separated)</label>
                  <input 
                    type="text" 
                    value={newOrder.items}
                    onChange={(e) => setNewOrder({...newOrder, items: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. 2x Coffee, 1x Cake"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newOrder.total}
                    onChange={(e) => setNewOrder({...newOrder, total: parseFloat(e.target.value)})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
