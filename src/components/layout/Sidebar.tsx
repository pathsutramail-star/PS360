/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import { Role, View } from '../../models/types';
import { NAV_ITEMS } from '../../models/navigation';

interface SidebarProps {
  role: Role;
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ role, currentView, setCurrentView, isOpen, setIsOpen }: SidebarProps) {
  const navItems = NAV_ITEMS[role];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col shadow-2xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#689249] flex items-center justify-center text-white font-bold text-xl font-display shadow-sm shadow-[#689249]/20">
              P
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-gray-900">PS360</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#689249]/10 text-[#689249]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={18} className={cn(
                  "transition-colors relative z-10",
                  isActive ? "text-[#689249]" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
