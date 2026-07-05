import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, AlertTriangle, PackageSearch, Download, Plus, PlusCircle, Edit, Trash2, X, MoreHorizontal, Eye } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface InventoryItem {
  id: string;
  item: string;
  category: string;
  stock: number;
  reorder: number;
  supplier: string;
  status: InventoryStatus;
}

const initialInventory: InventoryItem[] = [
  { id: 'INV-101', item: 'Fresh Towels (White)', category: 'Housekeeping', stock: 150, reorder: 50, supplier: 'Linens Direct', status: 'In Stock' },
  { id: 'INV-102', item: 'Premium Coffee Beans', category: 'Restaurant', stock: 12, reorder: 20, supplier: 'Himalayan Roasters', status: 'Low Stock' },
  { id: 'INV-103', item: 'Shampoo (Mini)', category: 'Amenities', stock: 0, reorder: 100, supplier: 'Hotel Supplies Inc.', status: 'Out of Stock' },
  { id: 'INV-104', item: 'Bottled Water (500ml)', category: 'Restaurant', stock: 240, reorder: 100, supplier: 'Aqua Pure', status: 'In Stock' },
];

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    item: '', category: 'Housekeeping', stock: 0, reorder: 0, supplier: ''
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

  const getStatus = (stock: number, reorder: number): InventoryStatus => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= reorder) return 'Low Stock';
    return 'In Stock';
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.item && newItem.supplier) {
      const newInvItem: InventoryItem = {
        id: `INV-${100 + inventory.length + 1}`,
        item: newItem.item,
        category: newItem.category || 'Housekeeping',
        stock: Number(newItem.stock) || 0,
        reorder: Number(newItem.reorder) || 0,
        supplier: newItem.supplier,
        status: getStatus(Number(newItem.stock) || 0, Number(newItem.reorder) || 0)
      };
      setInventory([...inventory, newInvItem]);
      notify('Item added to inventory', 'success');
      setIsAddModalOpen(false);
      setNewItem({ item: '', category: 'Housekeeping', stock: 0, reorder: 0, supplier: '' });
    }
  };

  const handleEditItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      setInventory(inventory.map(item => item.id === selectedItem.id ? { ...selectedItem, status: getStatus(selectedItem.stock, selectedItem.reorder) } : item));
      notify('Item updated', 'success');
      setIsEditModalOpen(false);
    }
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && restockAmount > 0) {
      handleRestock(selectedItem.id, restockAmount);
      setIsRestockModalOpen(false);
      setRestockAmount(0);
    }
  };

  const handleRestock = (id: string, amount: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newStock = item.stock + amount;
        return { ...item, stock: newStock, status: getStatus(newStock, item.reorder) };
      }
      return item;
    }));
    notify(`Restocked ${amount} units for ${id}`, 'success');
  };

  const filteredInventory = inventory.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Track supplies, manage vendors, and monitor stock levels.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => notify('Downloading report...', 'success')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm shadow-sm transition-all"
          >
            <Download size={16} />
            Export Report
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Total Items', value: inventory.length, icon: PackageSearch, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Low Stock Alerts', value: inventory.filter(i => i.status === 'Low Stock').length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Out of Stock', value: inventory.filter(i => i.status === 'Out of Stock').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-5 flex items-center gap-4 shadow-sm border-gray-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-gray-900 text-lg">Inventory Items</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all"
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Item Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Stock Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Supplier</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{item.item}</div>
                    <div className="text-xs text-gray-500">{item.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{item.stock} units</div>
                    <div className="text-xs text-gray-500 font-medium">Reorder at {item.reorder}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600">{item.supplier}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wider
                      ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative inline-block text-left" ref={activeDropdown === item.id ? dropdownRef : null}>
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {activeDropdown === item.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                          <button 
                            onClick={() => {
                              setSelectedItem(item);
                              setIsRestockModalOpen(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <PlusCircle size={16} className="text-blue-500" />
                            Restock Item
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditModalOpen(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit size={16} className="text-gray-400" />
                            Edit Item
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No items found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Add Inventory Item</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                  <input 
                    type="text" 
                    value={newItem.item}
                    onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Fresh Towels (White)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  >
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Restaurant">Restaurant & Cafe</option>
                    <option value="Amenities">Amenities</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Reorder Level</label>
                    <input 
                      type="number" 
                      min="0"
                      value={newItem.reorder}
                      onChange={(e) => setNewItem({...newItem, reorder: parseInt(e.target.value) || 0})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier</label>
                  <input 
                    type="text" 
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Linens Direct"
                    required
                  />
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRestockModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Restock Item</h2>
              <button 
                onClick={() => setIsRestockModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRestockSubmit} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Restock Amount for "{selectedItem.item}"</label>
                  <input 
                    type="number" 
                    min="1"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <PlusCircle size={16} /> Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Edit Inventory Item</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditItemSubmit} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                  <input 
                    type="text" 
                    value={selectedItem.item}
                    onChange={(e) => setSelectedItem({...selectedItem, item: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier</label>
                  <input 
                    type="text" 
                    value={selectedItem.supplier}
                    onChange={(e) => setSelectedItem({...selectedItem, supplier: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Current Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      value={selectedItem.stock}
                      onChange={(e) => setSelectedItem({...selectedItem, stock: parseInt(e.target.value) || 0})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Reorder Level</label>
                    <input 
                      type="number" 
                      min="0"
                      value={selectedItem.reorder}
                      onChange={(e) => setSelectedItem({...selectedItem, reorder: parseInt(e.target.value) || 0})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                      required
                    />
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
