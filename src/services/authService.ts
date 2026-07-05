/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * -----------------------------------------------------------------------
 * AUTH SERVICE — this is the ONLY file the backend developer needs to
 * rewire. Everything above it (SignIn view, useAuth controller, App) talks
 * to the three functions below and doesn't care how they're implemented.
 *
 * Right now they run against localStorage so the UI is fully demo-able
 * without a server. Swap the bodies for real `fetch('/api/...')` calls
 * once the auth API is ready — keep the same function names & return
 * shapes (Session / AuthUser) and nothing else in the app needs to change.
 * -----------------------------------------------------------------------
 */

import { AuthUser, Role, Session } from '../models/types';

const USERS_KEY = 'ps360-users';
const SESSION_KEY = 'ps360-session';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

function readUsers(): StoredUser[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[];
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toSession(user: StoredUser): Session {
  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarInitial: user.name.trim().charAt(0).toUpperCase() || 'U',
  };
  // A real backend would issue a signed token here. We fake one so the
  // rest of the app (which only cares that a token exists) behaves the
  // same either way.
  return { token: `demo-token-${user.id}`, user: authUser };
}

export const authService = {
  /**
   * TODO(backend): replace with `POST /api/auth/login { email, password }`
   * and return the JSON body as a `Session`. The role MUST come from the
   * server response, never be inferred client-side, in production.
   */
  async login(email: string, password: string): Promise<Session> {
    const users = readUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!match) {
      throw new Error('We could not find an account with those details. Please check your email and password.');
    }

    return toSession(match);
  },

  /**
   * TODO(backend): replace with `POST /api/auth/register { name, email, password, role }`.
   * Role selection during sign-up is here only because there is no backend
   * yet to assign roles centrally — once that exists, this screen can be
   * limited to admins inviting managers, if that's the desired flow.
   */
  async register(name: string, email: string, password: string, role: Role): Promise<Session> {
    const users = readUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (exists) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };

    writeUsers([...users, newUser]);
    return toSession(newUser);
  },

  /** TODO(backend): call `POST /api/auth/logout` if the server needs to
   *  invalidate the token; otherwise this can stay client-only. */
  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  },

  /** Restores a session on page load, e.g. after a refresh. */
  getStoredSession(): Session | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  },

  persistSession(session: Session): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
};
