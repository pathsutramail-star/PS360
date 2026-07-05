import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Bell, CheckCircle, AlertTriangle, MessageSquare, Info, Trash2, Check, Plus, X, Send } from 'lucide-react';
import { notify } from '../../../utils';

export function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'Low Stock Alert', message: 'Premium Coffee Beans are running low in inventory.', time: '10 mins ago', read: false },
    { id: 2, type: 'message', title: 'New Guest Request', message: 'Room 205 has requested extra pillows.', time: '1 hour ago', read: false },
    { id: 3, type: 'success', title: 'Booking Confirmed', message: 'New booking for Deluxe Suite (Oct 15 - Oct 18).', time: '2 hours ago', read: true },
    { id: 4, type: 'info', title: 'System Update', message: 'Scheduled maintenance for the booking system at 2 AM.', time: '1 day ago', read: true },
  ]);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'info', recipient: 'All Staff' });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    notify('All notifications marked as read', 'success');
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    notify('All notifications cleared', 'success');
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNotif.title && newNotif.message) {
      const newNotification = {
        id: Date.now(),
        type: newNotif.type,
        title: newNotif.title,
        message: `[To: ${newNotif.recipient}] ${newNotif.message}`,
        time: 'Just now',
        read: false,
      };
      setNotifications([newNotification, ...notifications]);
      notify(`Notification sent to ${newNotif.recipient}`, 'success');
      setIsSendModalOpen(false);
      setNewNotif({ title: '', message: '', type: 'info', recipient: 'All Staff' });
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'alert': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'message': return <MessageSquare className="text-blue-500" size={20} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      default: return <Info className="text-gray-500" size={20} />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'alert': return 'bg-amber-50';
      case 'message': return 'bg-blue-50';
      case 'success': return 'bg-emerald-50';
      default: return 'bg-gray-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            You have <span className="font-bold text-[#689249]">{unreadCount}</span> unread messages.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] font-semibold text-sm shadow-sm transition-all"
          >
            <Send size={16} />
            Send Notification
          </button>
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <Check size={16} />
            Mark all read
          </button>
          <button 
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-rose-600 rounded-lg hover:bg-rose-50 font-semibold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm border-gray-100 divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 sm:p-6 flex items-start gap-4 transition-colors ${notif.read ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h3 className={`text-sm font-bold truncate ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
                <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                  {notif.message}
                </p>
                <div className="mt-3 flex gap-3">
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs font-bold text-[#689249] hover:text-[#557A3A]"
                    >
                      Mark as read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="text-xs font-bold text-gray-400 hover:text-rose-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 bg-[#689249] rounded-full flex-shrink-0 mt-1.5"></div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">All Caught Up!</h3>
            <p className="text-gray-500 text-sm">You have no new notifications.</p>
          </div>
        )}
      </Card>

      {/* Send Notification Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Send Notification</h2>
              <button 
                onClick={() => setIsSendModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendNotification} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">To / Recipient</label>
                  <select 
                    value={newNotif.recipient}
                    onChange={(e) => setNewNotif({...newNotif, recipient: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  >
                    <option value="All Staff">All Staff</option>
                    <option value="Housekeeping">Housekeeping Team</option>
                    <option value="Maintenance">Maintenance Team</option>
                    <option value="Front Desk">Front Desk / Reception</option>
                    <option value="Restaurant">Restaurant & Cafe</option>
                    <option value="Customers">All Customers / Guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notification Type</label>
                  <select 
                    value={newNotif.type}
                    onChange={(e) => setNewNotif({...newNotif, type: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                  >
                    <option value="info">Information</option>
                    <option value="alert">Alert / Urgent</option>
                    <option value="message">Message</option>
                    <option value="success">Success / Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newNotif.title}
                    onChange={(e) => setNewNotif({...newNotif, title: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors"
                    placeholder="e.g. Mandatory Staff Meeting"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                  <textarea 
                    value={newNotif.message}
                    onChange={(e) => setNewNotif({...newNotif, message: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-colors h-24 resize-none"
                    placeholder="Type your message here..."
                    required
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm flex items-center gap-2"
                >
                  <Send size={16} />
                  Send Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
