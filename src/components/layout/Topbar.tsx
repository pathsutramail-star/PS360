/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Menu, Bell, LogOut, X, AlertTriangle, MessageSquare, Info, CheckCircle2 } from 'lucide-react';
import { notify, cn } from '../../utils';
import { AuthUser, View } from '../../models/types';

const initialNotifications = [
  { id: 1, type: 'alert', title: 'Low Stock Alert', message: 'Premium Coffee Beans are running low.', time: '10m ago', read: false },
  { id: 2, type: 'message', title: 'Guest request', message: 'Room 205 asked for extra pillows.', time: '45m ago', read: false },
  { id: 3, type: 'info', title: 'System update', message: 'New dashboard features are available.', time: '1h ago', read: true },
];

interface TopbarProps {
  user: AuthUser;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

export function Topbar({ user, setSidebarOpen, setCurrentView, onLogout }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const topbarRef = useRef<HTMLDivElement>(null);
  const roleLabel = user.role === 'admin' ? 'Administrator' : 'Manager';
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topbarRef.current && !topbarRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifications = () => {
    setNotificationsOpen((open) => !open);
    setMenuOpen(false);
  };

  const markAsRead = (id: number) => {
    setNotifications((current) => current.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    notify('All notifications marked as read', 'success');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'message': return <MessageSquare size={16} className="text-blue-500" />;
      case 'info': return <Info size={16} className="text-slate-500" />;
      default: return <CheckCircle2 size={16} className="text-emerald-500" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center relative group">
          {/* Search bar removed to avoid duplicates on pages with their own search */}
        </div>
      </div>

<div className="flex items-center gap-2 sm:gap-4 relative" ref={topbarRef}>
          <div className="relative">
            <button
              onClick={handleNotifications}
              className={cn(
                'p-2 rounded-lg transition-colors',
                notificationsOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 border border-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-3xl border border-gray-100 bg-white shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-500">{unreadCount} unread</p>
                  </div>
                  <button onClick={() => setNotificationsOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className={`px-4 py-3 border-b border-gray-100 ${notification.read ? 'bg-white' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getIcon(notification.type)}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{notification.title}</p>
                            <p className="mt-1 text-xs text-gray-500 truncate">{notification.message}</p>
                            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-gray-400">
                              <span>{notification.time}</span>
                              {!notification.read && (
                                <button onClick={() => markAsRead(notification.id)} className="font-semibold text-[#689249] hover:text-[#557A3A]">
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">No new notifications</div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gray-50">
                  <button onClick={markAllAsRead} className="flex-1 rounded-2xl bg-[#689249] px-3 py-2 text-sm font-semibold text-white hover:bg-[#557A3A] transition-colors">
                    Mark all read
                  </button>
                  <button onClick={() => setNotifications([])} className="flex-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1 sm:mx-2"></div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
          >
            <div className={cn(
              "w-8 h-8 rounded-lg bg-[#689249] flex items-center justify-center text-white shadow-sm",
              user.role === 'manager' && "font-bold text-sm"
            )}>
              {user.avatarInitial ?? user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col items-start pr-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-[140px]">
                {user.name}
              </span>
              <span className={cn(
                "text-gray-500 mt-0.5",
                user.role === 'admin' ? "text-xs" : "text-[10px] uppercase font-bold tracking-wider"
              )}>
                {roleLabel}
              </span>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-lg z-40 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{roleLabel}</p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
