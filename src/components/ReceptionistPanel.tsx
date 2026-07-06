import React from 'react';
import { Sidebar } from './layout/Sidebar';
import { Topbar } from './layout/Topbar';
import { AuthUser, View } from '../models/types';
import { useNavigation } from '../controllers/useNavigation';
import { useToast } from '../controllers/useToast';

import { Dashboard } from './views/receptionist/Dashboard';
import { CheckInOut } from './views/receptionist/CheckInOut';
import { Reservations } from './views/receptionist/Reservations';
import { RoomStatus } from './views/receptionist/RoomStatus';
import { GuestDirectory } from './views/receptionist/GuestDirectory';
import { GuestRequests } from './views/receptionist/GuestRequests';
import { Billing } from './views/receptionist/Billing';
import { ShiftHandover } from './views/receptionist/ShiftHandover';
import { Profile } from './views/receptionist/Profile';

import { CalendarView } from './views/manager/CalendarView';
import { Notifications } from './views/manager/Notifications';

import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

interface ReceptionistPanelProps {
  user: AuthUser;
  onLogout: () => void;
}

export function ReceptionistPanel({ user, onLogout }: ReceptionistPanelProps) {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useNavigation('receptionist');
  const toast = useToast();

  const renderView = () => {
    switch (currentView) {
      case 'front-desk':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'check-in-out':
        return <CheckInOut />;
      case 'reservations':
        return <Reservations />;
      case 'room-status':
        return <RoomStatus />;
      case 'guest-directory':
        return <GuestDirectory />;
      case 'guest-requests':
        return <GuestRequests />;
      case 'billing':
        return <Billing />;
      case 'calendar':
        return <CalendarView />;
      case 'shift-handover':
        return <ShiftHandover />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <UnknownView view={currentView} onBack={() => setCurrentView('front-desk')} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-[#689249]/20 selection:text-[#689249]">
      <Sidebar role="receptionist" currentView={currentView} setCurrentView={setCurrentView} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar user={user} setSidebarOpen={setSidebarOpen} setCurrentView={setCurrentView} onLogout={onLogout} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative">
          <div className="max-w-[1600px] mx-auto">{renderView()}</div>

          {toast && (
            <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 flex items-center gap-3">
                {toast.type === 'success' ? (
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} className="text-green-600" />
                  </div>
                ) : toast.type === 'error' ? (
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={16} className="text-red-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Info size={16} className="text-blue-600" />
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900 pr-4">{toast.message}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function UnknownView({ view, onBack }: { view: View; onBack: () => void }) {
  const label = (view as string).replace('-', ' ');
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 text-[#689249]">
        <span className="font-display font-bold text-3xl">{label.charAt(0).toUpperCase()}</span>
      </div>
      <h2 className="text-2xl font-semibold font-display text-gray-900 capitalize mb-2 tracking-tight">{label}</h2>
      <p className="text-gray-500 max-w-md font-medium text-sm leading-relaxed">
        This module is currently being crafted. Please check back later for updates to the {label} workspace.
      </p>
      <button onClick={onBack} className="mt-6 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-all shadow-sm">
        Return to Dashboard
      </button>
    </div>
  );
}
