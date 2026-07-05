/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ---------------------------------------------------------------------------
// Auth / role model
// ---------------------------------------------------------------------------

/** The two roles supported by the PS360 panel. The backend decides which
 *  role a logged-in user gets — the frontend only reacts to it. */
export type Role = 'admin' | 'manager';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitial?: string;
}

export interface Session {
  token: string;
  user: AuthUser;
}

// ---------------------------------------------------------------------------
// Navigation model
// ---------------------------------------------------------------------------

export type View =
  // ---- Shared views (used by both Admin & Manager) ----
  | 'dashboard'
  | 'rooms'
  | 'tours'
  | 'bookings'
  | 'staff'
  | 'inventory'
  | 'billing'
  | 'reports'
  | 'ai-copilot'
  // ---- Admin-only views ----
  | 'properties'
  | 'customers'
  | 'revenue'
  | 'marketing'
  | 'settings'
  // ---- Manager-only views ----
  | 'guests'
  | 'housekeeping'
  | 'restaurant'
  | 'maintenance'
  | 'support'
  | 'calendar'
  | 'notifications'
  | 'profile';

// ---------------------------------------------------------------------------
// Domain models
// ---------------------------------------------------------------------------

export interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  status: 'Active' | 'Inactive' | 'Maintenance';
  totalRooms: number;
  activeBookings: number;
  facilities?: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  propertyName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Checked-in' | 'Checked-out';
}
