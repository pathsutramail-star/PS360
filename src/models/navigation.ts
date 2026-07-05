/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Single source of truth for what each role sees in the Sidebar, and which
 * views a role is allowed to open. Keeping this as data (instead of
 * hard-coded JSX per role) is what lets the Sidebar/Topbar stay one
 * component instead of forking into Admin/Manager copies.
 */

import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Video,
  Globe,
  CalendarDays,
  Users,
  Contact,
  Package,
  CircleDollarSign,
  Megaphone,
  FileBarChart,
  FileText,
  CreditCard,
  Settings as SettingsIcon,
  Brush,
  UtensilsCrossed,
  Wrench,
  HelpCircle,
  Calendar,
  Bell,
  Sparkles,
  UserCircle,
} from 'lucide-react';
import { Role, View } from './types';

export interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
}

/** Default landing view once a role signs in. */
export const DEFAULT_VIEW: Record<Role, View> = {
  admin: 'dashboard',
  manager: 'dashboard',
};

/** Sidebar links + their order, per role. */
export const NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Property Management', icon: Building2 },
    { id: 'rooms', label: 'Room Management', icon: BedDouble },
    { id: 'tours', label: '360° Tour Management', icon: Video },
    { id: 'bookings', label: 'Bookings & Reservations', icon: CalendarDays },
    { id: 'billing', label: 'Billing', icon: FileText },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'staff', label: 'Staff Management', icon: Contact },
    { id: 'inventory', label: 'Inventory Management', icon: Package },
    { id: 'revenue', label: 'Revenue & Finance', icon: CircleDollarSign },
    { id: 'marketing', label: 'Marketing & Promotions', icon: Megaphone },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Booking Management', icon: CalendarDays },
    { id: 'guests', label: 'Guest Management', icon: Users },
    { id: 'rooms', label: 'Room Management', icon: BedDouble },
    { id: 'tours', label: '360° Tour Management', icon: Globe },
    { id: 'housekeeping', label: 'Housekeeping', icon: Brush },
    { id: 'restaurant', label: 'Restaurant & Café', icon: UtensilsCrossed },
    { id: 'staff', label: 'Staff Management', icon: Contact },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'inventory', label: 'Inventory Monitoring', icon: Package },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'support', label: 'Customer Support', icon: HelpCircle },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ],
};

/** Every view a role is permitted to render. Used as a safety-net guard in
 *  the panel controllers, in addition to the Sidebar only linking to views
 *  that belong to the current role. */
export const VIEWS_BY_ROLE: Record<Role, View[]> = {
  admin: NAV_ITEMS.admin.map((item) => item.id).concat('ai-copilot'),
  manager: NAV_ITEMS.manager.map((item) => item.id),
};
