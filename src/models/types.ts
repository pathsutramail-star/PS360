/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ---------------------------------------------------------------------------
// Auth / role model
// ---------------------------------------------------------------------------

/** The roles supported by the PS360 panel. The backend decides which
 *  role a logged-in user gets — the frontend only reacts to it. */
export type Role = 'admin' | 'manager' | 'receptionist';

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
  | 'profile'
  // ---- Receptionist-only views ----
  | 'front-desk'
  | 'check-in-out'
  | 'reservations'
  | 'room-status'
  | 'guest-directory'
  | 'guest-requests'
  | 'shift-handover';

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

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  vip: boolean;
  notes: string;
  stayHistory: string[];
}

export interface GuestRequest {
  id: string;
  guestName: string;
  roomName: string;
  category: 'Housekeeping' | 'Maintenance' | 'Room Service' | 'Front Desk' | 'Other';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface ShiftNote {
  id: string;
  author: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  note: string;
  timestamp: string;
  acknowledged: boolean;
}
