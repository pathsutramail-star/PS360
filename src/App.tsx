/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Root of the app. This is deliberately thin: it only decides between
 * "show the sign-in screen" and "show the workspace for this user's role".
 * All the real logic lives in controllers/ (useAuth) and the two panels.
 */

import React from 'react';
import { SignIn } from './components/views/auth/SignIn';
import { AdminPanel } from './components/AdminPanel';
import { ManagerPanel } from './components/ManagerPanel';
import { ReceptionistPanel } from './components/ReceptionistPanel';
import { useAuth } from './controllers/useAuth';

export default function App() {
  const { user, isAuthenticated, isRestoring, login, register, logout } = useAuth();

  // Avoid a flash of the sign-in screen while we check for a saved session.
  if (isRestoring) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-[#689249] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <SignIn onLogin={login} onRegister={register} />;
  }

  if (user.role === 'admin') {
    return <AdminPanel user={user} onLogout={logout} />;
  }

  if (user.role === 'receptionist') {
    return <ReceptionistPanel user={user} onLogout={logout} />;
  }

  return <ManagerPanel user={user} onLogout={logout} />;
}
