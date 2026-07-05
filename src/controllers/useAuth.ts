/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Controller" for authentication: owns session state, exposes
 * login/register/logout, and restores a session on refresh. Views
 * (SignIn) and App never touch authService or localStorage directly.
 */

import { useCallback, useEffect, useState } from 'react';
import { Session, Role } from '../models/types';
import { authService } from '../services/authService';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const stored = authService.getStoredSession();
    if (stored) setSession(stored);
    setIsRestoring(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await authService.login(email, password);
    authService.persistSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: Role) => {
    const nextSession = await authService.register(name, email, password, role);
    authService.persistSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  return {
    session,
    user: session?.user ?? null,
    role: session?.user.role ?? null,
    isAuthenticated: !!session,
    isRestoring,
    login,
    register,
    logout,
  };
}
