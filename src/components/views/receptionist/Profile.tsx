import React, { useState } from 'react';
import { Bell, Clock3, Headphones, KeyRound, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { AuthUser } from '../../../models/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { notify } from '../../../utils';

interface ReceptionistProfileProps {
  user: AuthUser;
}

const roleLabel = 'Receptionist';

export function Profile({ user }: ReceptionistProfileProps) {
  const [deskPhone, setDeskPhone] = useState('+977-9801234567');
  const [shift, setShift] = useState('Afternoon');
  const [handoverRequired, setHandoverRequired] = useState(true);
  const [arrivalAlerts, setArrivalAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in duration-500">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#689249] text-2xl font-bold text-white shadow-sm">
              {user.avatarInitial ?? user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">{user.name}</h1>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-[#689249]">{roleLabel}</p>
              <p className="mt-2 text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Desk shift', value: shift, icon: Clock3 },
              { label: 'Open tasks', value: '7', icon: Headphones },
              { label: 'Access', value: 'Front desk', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    <Icon size={14} />
                    {item.label}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Front Desk Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Display name
                <input value={user.name} readOnly className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Role
                <input value={roleLabel} readOnly className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-[#689249]" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Email
                <div className="relative mt-2">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={user.email} readOnly className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-600" />
                </div>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Desk phone
                <div className="relative mt-2">
                  <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={deskPhone} onChange={(event) => setDeskPhone(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-[#689249] focus:outline-none" />
                </div>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Active shift
                <select value={shift} onChange={(event) => setShift(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Night</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Assigned desk
                <select className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#689249] focus:outline-none">
                  <option>Main Lobby</option>
                  <option>VIP Lounge</option>
                  <option>Night Audit Desk</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button onClick={() => notify('Receptionist profile saved', 'success')} className="rounded-lg bg-[#689249] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]">
                Save Profile
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desk Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Arrival and departure alerts', checked: arrivalAlerts, onChange: () => setArrivalAlerts((value) => !value), icon: Bell },
                { label: 'Payment and balance reminders', checked: paymentAlerts, onChange: () => setPaymentAlerts((value) => !value), icon: UserRound },
                { label: 'Require shift handover before sign out', checked: handoverRequired, onChange: () => setHandoverRequired((value) => !value), icon: Clock3 },
              ].map((setting) => {
                const Icon = setting.icon;
                return (
                  <label key={setting.label} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <span className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <Icon size={16} className="text-[#689249]" />
                      {setting.label}
                    </span>
                    <input type="checkbox" checked={setting.checked} onChange={setting.onChange} className="h-4 w-4 rounded border-gray-300 text-[#689249] focus:ring-[#689249]" />
                  </label>
                );
              })}
              <button onClick={() => notify('Desk preferences updated', 'success')} className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Save Preferences
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button onClick={() => notify('Password reset link sent to your email', 'success')} className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                <span className="flex items-center gap-3"><KeyRound size={16} className="text-[#689249]" /> Reset password</span>
              </button>
              <button onClick={() => notify('Two-factor setup opened', 'info')} className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                <span className="flex items-center gap-3"><ShieldCheck size={16} className="text-[#689249]" /> Configure two-factor authentication</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
