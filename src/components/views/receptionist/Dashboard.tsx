import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRightLeft,
  BadgeCheck,
  BedDouble,
  CalendarDays,
  ClipboardList,
  DoorOpen,
  PhoneCall,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { notify } from '../../../utils';
import { View } from '../../../models/types';

interface ArrivalItem {
  id: string;
  guestName: string;
  roomName: string;
  eta: string;
  status: 'Confirmed' | 'Pending';
}

interface DepartureItem {
  id: string;
  guestName: string;
  roomName: string;
  balance: string;
  status: 'Pending' | 'Settled';
}

interface RequestItem {
  id: string;
  guestName: string;
  roomName: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface DashboardProps {
  setCurrentView?: (view: View) => void;
}

const sage = {
  primary: '#689249',
  deep: '#3f5f35',
  medium: '#8FAE77',
  soft: '#B8C9A6',
  pale: '#EDF4E7',
  cream: '#F8FBF5',
  amber: '#C69C5D',
  clay: '#C67A70',
};

const occupancyTrend = [
  { time: '6 AM', occupancy: 62 },
  { time: '9 AM', occupancy: 68 },
  { time: '12 PM', occupancy: 71 },
  { time: '3 PM', occupancy: 78 },
  { time: '6 PM', occupancy: 84 },
  { time: '9 PM', occupancy: 81 },
];

const revenueTrend = [
  { day: 'Mon', revenue: 128000 },
  { day: 'Tue', revenue: 142000 },
  { day: 'Wed', revenue: 118000 },
  { day: 'Thu', revenue: 156000 },
  { day: 'Fri', revenue: 188000 },
  { day: 'Sat', revenue: 214000 },
  { day: 'Sun', revenue: 176000 },
];

const roomReadiness = [
  { name: 'Ready', value: 18, color: sage.primary },
  { name: 'Occupied', value: 23, color: sage.medium },
  { name: 'Dirty', value: 5, color: sage.amber },
  { name: 'Blocked', value: 2, color: sage.clay },
];

const priorityLoad = [
  { priority: 'Low', count: 4, fill: sage.soft },
  { priority: 'Medium', count: 7, fill: sage.amber },
  { priority: 'High', count: 3, fill: sage.clay },
];

const formatNpr = (value: number) => `NPR ${(value / 1000).toFixed(0)}k`;

export function Dashboard({ setCurrentView }: DashboardProps) {
  const [arrivals, setArrivals] = useState<ArrivalItem[]>([
    { id: 'ARR-1', guestName: 'Asha Gupta', roomName: 'Deluxe 204', eta: '14:30', status: 'Confirmed' },
    { id: 'ARR-2', guestName: 'Daniel Kim', roomName: 'Suite 401', eta: '18:00', status: 'Pending' },
    { id: 'ARR-3', guestName: 'Mina Shah', roomName: 'Executive 305', eta: '19:15', status: 'Confirmed' },
  ]);

  const [departures, setDepartures] = useState<DepartureItem[]>([
    { id: 'DEP-1', guestName: 'Liam Carter', roomName: 'Superior 110', balance: 'NPR 1,400', status: 'Pending' },
    { id: 'DEP-2', guestName: 'Nina Park', roomName: 'Family 302', balance: 'Settled', status: 'Settled' },
  ]);

  const [requests] = useState<RequestItem[]>([
    { id: 'REQ-1', guestName: 'Mina Shah', roomName: 'Deluxe 204', category: 'Housekeeping', priority: 'Medium' },
    { id: 'REQ-2', guestName: 'Chris Brown', roomName: 'Suite 401', category: 'Maintenance', priority: 'High' },
    { id: 'REQ-3', guestName: 'Sara Chen', roomName: 'Superior 110', category: 'Room Service', priority: 'Low' },
  ]);

  const highPriorityCount = useMemo(
    () => requests.filter((request) => request.priority === 'High').length,
    [requests],
  );

  const handleCheckIn = (id: string) => {
    setArrivals((current) => current.filter((item) => item.id !== id));
    notify('Check-in completed for the selected guest', 'success');
  };

  const handleCheckOut = (id: string) => {
    setDepartures((current) => current.filter((item) => item.id !== id));
    notify('Check-out completed for the selected guest', 'success');
  };

  const handleQuickAction = (view: View) => {
    setCurrentView?.(view);
    notify('Opened the selected front-desk workspace', 'success');
  };

  const handleDeskCall = (label: string) => {
    notify(`${label} contact opened`, 'info');
  };

  const kpis = [
    { title: 'Occupancy', value: '84%', detail: '+6% today', icon: TrendingUp },
    { title: 'Arrivals', value: arrivals.length.toString(), detail: '2 VIP watchlist', icon: DoorOpen },
    { title: 'In-house', value: '23', detail: '48 total guests', icon: Users },
    { title: 'High alerts', value: highPriorityCount.toString(), detail: 'Needs attention', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="rounded-2xl border border-[#dfe8d7] bg-[#f8fbf5] p-5 shadow-sm md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-[360px] flex-col justify-between rounded-2xl border border-[#55773b] bg-gradient-to-br from-[#689249] to-[#55773b] p-6 shadow-md text-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#edf4e7]">Front Desk Command Center</p>
                <h1 className="mt-3 text-3xl font-bold font-display tracking-tight text-white md:text-4xl">
                  Receptionist Overview
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#edf4e7]/90">
                  Live arrivals, room readiness, payments, and guest service activity in one calm sage workspace.
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#edf4e7]">Shift</p>
                <p className="mt-1 text-lg font-bold">Afternoon Desk</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 transition-colors hover:bg-white/15">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white/80">{stat.title}</p>
                      <Icon size={18} className="text-[#edf4e7]" />
                    </div>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold text-white/70">{stat.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="min-h-[360px]">
            <CardHeader className="flex flex-col gap-3 border-[#eef3ea] md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#689249]">Today</p>
                <CardTitle className="mt-1">Room Readiness</CardTitle>
              </div>
              <button onClick={() => handleQuickAction('room-status')} className="rounded-lg border border-[#d7e4ce] bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-[#f1f7e8]">
                View Board
              </button>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roomReadiness} innerRadius={58} outerRadius={84} paddingAngle={3} dataKey="value">
                      {roomReadiness.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {roomReadiness.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 rounded-lg bg-[#f8fbf5] px-3 py-2 text-sm font-semibold text-gray-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}: {item.value}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Departures today', value: departures.length.toString(), icon: ArrowRightLeft },
          { title: 'Payments due', value: 'NPR 7.3k', icon: WalletCards },
          { title: 'Rooms ready / dirty', value: '18 / 5', icon: BedDouble },
          { title: 'Service tickets', value: requests.length.toString(), icon: ClipboardList },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f7e8] text-[#689249]">
                  <Icon size={20} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Occupancy Flow</CardTitle>
              <p className="mt-1 text-sm text-gray-500">Hourly occupancy across the active shift.</p>
            </div>
            <span className="rounded-full bg-[#f1f7e8] px-3 py-1 text-xs font-bold text-[#689249]">Live</span>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyTrend} margin={{ left: -20, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={sage.primary} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={sage.primary} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8eee3" vertical={false} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                  <Area type="monotone" dataKey="occupancy" stroke={sage.primary} strokeWidth={3} fill="url(#occupancyFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Front Desk Revenue</CardTitle>
            <p className="mt-1 text-sm text-gray-500">Payments captured through reception.</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrend} margin={{ left: -16, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8eee3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tickFormatter={formatNpr} tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatNpr(Number(value)), 'Revenue']} />
                  <Bar dataKey="revenue" fill={sage.medium} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Arriving Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {arrivals.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#edf2e8] bg-[#f8fbf5] px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.guestName}</p>
                  <p className="text-sm text-gray-500">{item.roomName} - ETA {item.eta}</p>
                </div>
                <button
                  onClick={() => handleCheckIn(item.id)}
                  className="rounded-lg bg-[#689249] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#567a3b]"
                >
                  Check In
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departing Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departures.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#edf2e8] bg-[#f8fbf5] px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.guestName}</p>
                  <p className="text-sm text-gray-500">{item.roomName} - {item.balance}</p>
                  {item.status === 'Pending' && (
                    <span className="mt-1 inline-flex rounded-full bg-[#fff7e8] px-2.5 py-1 text-xs font-semibold text-[#946b24]">
                      Outstanding balance
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleCheckOut(item.id)}
                  className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-[#d7e4ce] transition hover:bg-[#f1f7e8]"
                >
                  Check Out
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-xl border border-[#edf2e8] bg-[#f8fbf5] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{request.guestName}</p>
                    <p className="text-sm text-gray-500">{request.roomName}</p>
                  </div>
                  <span className="rounded-full bg-[#f1f7e8] px-2.5 py-1 text-xs font-semibold text-[#689249]">
                    {request.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{request.category}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Request Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityLoad} layout="vertical" margin={{ left: 4, right: 12 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="priority" type="category" tickLine={false} axisLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {priorityLoad.map((entry) => (
                      <Cell key={entry.priority} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Front Desk Action Center</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Shift Control</p>
              {[
                { label: 'Cash drawer', value: 'NPR 18,500' },
                { label: 'Key cards', value: '42 ready' },
                { label: 'Pending deposits', value: '2 guests' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[#edf2e8] bg-[#f8fbf5] px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Quick Actions</p>
              {[
                { label: 'Walk-in Booking', icon: PlusCircle, view: 'reservations' as View },
                { label: 'Guest Request', icon: ClipboardList, view: 'guest-requests' as View },
                { label: 'Room Status', icon: CalendarDays, view: 'room-status' as View },
                { label: 'Check-In Desk', icon: BadgeCheck, view: 'check-in-out' as View },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.view)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#d7e4ce] bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-[#f1f7e8]"
                  >
                    <span>{action.label}</span>
                    <Icon size={16} className="text-[#689249]" />
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Contacts</p>
              {[
                { label: 'Housekeeping Lead', icon: Sparkles },
                { label: 'Maintenance', icon: Wrench },
                { label: 'Security Desk', icon: ShieldAlert },
              ].map((contact) => {
                const Icon = contact.icon;
                return (
                  <button
                    key={contact.label}
                    onClick={() => handleDeskCall(contact.label)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#d7e4ce] bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-[#f1f7e8]"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} className="text-[#689249]" />
                      {contact.label}
                    </span>
                    <PhoneCall size={16} className="text-gray-400" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
