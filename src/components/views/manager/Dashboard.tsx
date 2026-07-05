import React, { useState } from 'react';
import { 
  Building2, 
  CalendarCheck, 
  TrendingUp, 
  Users, 
  Star, 
  Key,
  ArrowUpRight,
  Plus,
  FileBarChart,
  ChevronDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { notify } from '../../../utils';
import { View } from '../../../models/types';
import { AddBookingModal } from '../shared/AddBookingModal';
import { AddEventModal } from '../shared/AddEventModal';
import { ReviewsModal } from '../shared/ReviewsModal';

const ALL_PROPERTIES = [
  {
    id: 1,
    name: 'Grand Horizon Resort',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
    rating: '4.8',
    reviews: 50,
    stats: [
      { title: 'Total Bookings', value: '1,248', icon: CalendarCheck, trend: '+12.5%' },
      { title: 'Total Revenue', value: 'रू 8,45,000', icon: TrendingUp, trend: '+8.2%' },
      { title: 'Occupancy Rate', value: '78%', icon: Key, trend: '+5.1%' },
      { title: 'Customer Rating', value: '4.8/5', icon: Star, trend: '+0.2' },
    ],
    analytics: {
      Week: [
        { name: 'Sun', total: 80, online: 60, cancelled: 10 },
        { name: 'Mon', total: 130, online: 90, cancelled: 20 },
        { name: 'Tue', total: 110, online: 80, cancelled: 15 },
        { name: 'Wed', total: 234, online: 150, cancelled: 30 },
        { name: 'Thu', total: 180, online: 130, cancelled: 25 },
        { name: 'Fri', total: 220, online: 160, cancelled: 20 },
        { name: 'Sat', total: 170, online: 120, cancelled: 15 },
      ],
      Month: [
        { name: 'W1', total: 580, online: 460, cancelled: 110 },
        { name: 'W2', total: 630, online: 490, cancelled: 120 },
        { name: 'W3', total: 510, online: 380, cancelled: 115 },
        { name: 'W4', total: 734, online: 550, cancelled: 130 },
      ],
      Year: [
        { name: 'Q1', total: 2500, online: 1800, cancelled: 300 },
        { name: 'Q2', total: 3200, online: 2400, cancelled: 400 },
        { name: 'Q3', total: 4100, online: 3100, cancelled: 500 },
        { name: 'Q4', total: 3800, online: 2800, cancelled: 450 },
      ]
    },
    guests: [
      { name: 'Ava Smith', status: 'Premium', room: '218', checkIn: '06/09/24', checkOut: '07/01/24' },
      { name: 'Michael Johnson', status: '', room: '205', checkIn: '06/09/24', checkOut: '06/16/24' },
      { name: 'Joseph Clark', status: 'Premium', room: '405', checkIn: '06/09/24', checkOut: '07/02/24' },
      { name: 'Justin Davis', status: '', room: '328', checkIn: '06/09/24', checkOut: '06/12/24' },
      { name: 'Alexander Harrin...', status: 'Premium', room: '328', checkIn: '06/08/24', checkOut: '06/16/24' },
    ],
    revenue: {
      Week: [
        { label: 'Restaurant', current: 10500, max: 26250 },
        { label: 'Bar', current: 5250, max: 26250 },
        { label: 'Conference halls', current: 3937, max: 26250 },
        { label: 'Spa center', current: 5250, max: 26250 },
        { label: 'Transfer', current: 1313, max: 26250 },
      ],
      Month: [
        { label: 'Restaurant', current: 42000, max: 100000 },
        { label: 'Bar', current: 21000, max: 100000 },
        { label: 'Conference halls', current: 15000, max: 100000 },
        { label: 'Spa center', current: 18000, max: 100000 },
        { label: 'Transfer', current: 5000, max: 100000 },
      ],
      Year: [
        { label: 'Restaurant', current: 450000, max: 1000000 },
        { label: 'Bar', current: 280000, max: 1000000 },
        { label: 'Conference halls', current: 190000, max: 1000000 },
        { label: 'Spa center', current: 220000, max: 1000000 },
        { label: 'Transfer', current: 65000, max: 1000000 },
      ]
    },
    events: {
      '9': [
        { title: 'Sparkling cocktail reception', time: '04:00 PM', color: 'bg-[#689249]', bg: 'bg-[#689249]/10' },
        { title: 'Charity auction', time: '06:30 PM', color: 'bg-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
        { title: 'Glamorous gala', time: '10:00 PM', color: 'bg-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
      ],
      '11': [
        { title: 'Live Music Night', time: '07:00 PM', color: 'bg-[#689249]', bg: 'bg-[#689249]/10' },
      ]
    },
    floors: ['Floor 1', 'Floor 2'],
    roomsData: {
      'Floor 1': [
        { no: '101', name: 'Deluxe', status: 'vacant' },
        { no: '102', name: 'Deluxe', status: 'vacant' },
        { no: '103', name: 'Suite', status: 'occupied' },
        { no: '104', name: 'Suite', status: 'not_ready' },
        { no: '105', name: 'Standard', status: 'occupied' },
        { no: '106', name: 'Standard', status: 'vacant' },
        { no: '107', name: 'Standard', status: 'unavailable' },
        { no: '108', name: 'Standard', status: 'vacant' },
        { no: '109', name: 'Standard', status: 'occupied' },
      ],
      'Floor 2': [
        { no: '201', name: 'Penthouse', status: 'occupied' },
        { no: '202', name: 'Suite', status: 'vacant' },
        { no: '203', name: 'Suite', status: 'vacant' },
        { no: '204', name: 'Suite', status: 'not_ready' },
        { no: '205', name: 'Deluxe', status: 'occupied' },
      ]
    }
  },
  {
    id: 2,
    name: 'City Central Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    rating: '4.5',
    reviews: 120,
    stats: [
      { title: 'Total Bookings', value: '856', icon: CalendarCheck, trend: '+5.5%' },
      { title: 'Total Revenue', value: 'रू 4,20,000', icon: TrendingUp, trend: '+2.1%' },
      { title: 'Occupancy Rate', value: '85%', icon: Key, trend: '+1.5%' },
      { title: 'Customer Rating', value: '4.5/5', icon: Star, trend: '+0.1' },
    ],
    analytics: {
      Week: [
        { name: 'Sun', total: 60, online: 40, cancelled: 5 },
        { name: 'Mon', total: 90, online: 60, cancelled: 10 },
        { name: 'Tue', total: 100, online: 70, cancelled: 5 },
        { name: 'Wed', total: 150, online: 100, cancelled: 20 },
        { name: 'Thu', total: 130, online: 90, cancelled: 15 },
        { name: 'Fri', total: 180, online: 130, cancelled: 10 },
        { name: 'Sat', total: 160, online: 110, cancelled: 5 },
      ],
      Month: [
        { name: 'W1', total: 400, online: 300, cancelled: 50 },
        { name: 'W2', total: 450, online: 350, cancelled: 60 },
        { name: 'W3', total: 420, online: 320, cancelled: 45 },
        { name: 'W4', total: 500, online: 380, cancelled: 55 },
      ],
      Year: [
        { name: 'Q1', total: 1800, online: 1400, cancelled: 200 },
        { name: 'Q2', total: 2100, online: 1600, cancelled: 250 },
        { name: 'Q3', total: 2400, online: 1900, cancelled: 300 },
        { name: 'Q4', total: 2600, online: 2100, cancelled: 320 },
      ]
    },
    guests: [
      { name: 'Sarah Jenkins', status: 'Premium', room: '102', checkIn: '06/09/24', checkOut: '06/15/24' },
      { name: 'David Lee', status: '', room: '304', checkIn: '06/10/24', checkOut: '06/12/24' },
    ],
    revenue: {
      Week: [
        { label: 'Restaurant', current: 8500, max: 20000 },
        { label: 'Bar', current: 3250, max: 20000 },
        { label: 'Conference halls', current: 6937, max: 20000 },
      ],
      Month: [
        { label: 'Restaurant', current: 32000, max: 80000 },
        { label: 'Bar', current: 15000, max: 80000 },
        { label: 'Conference halls', current: 25000, max: 80000 },
      ],
      Year: [
        { label: 'Restaurant', current: 350000, max: 800000 },
        { label: 'Bar', current: 180000, max: 800000 },
        { label: 'Conference halls', current: 280000, max: 800000 },
      ]
    },
    events: {
      '9': [
        { title: 'Business Conference', time: '09:00 AM', color: 'bg-[#689249]', bg: 'bg-[#689249]/10' },
      ]
    },
    floors: ['Main Floor'],
    roomsData: {
      'Main Floor': [
        { no: '101', name: 'Standard', status: 'occupied' },
        { no: '102', name: 'Standard', status: 'occupied' },
        { no: '103', name: 'Standard', status: 'vacant' },
        { no: '104', name: 'Standard', status: 'vacant' },
      ]
    }
  }
];

interface DashboardProps {
  setCurrentView?: (view: View) => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  
  const [propertyIndex, setPropertyIndex] = useState(0);
  const currentProperty = ALL_PROPERTIES[propertyIndex];

  const [analyticsPeriod, setAnalyticsPeriod] = useState<'Week' | 'Month' | 'Year'>('Week');
  const [isAnalyticsPeriodOpen, setIsAnalyticsPeriodOpen] = useState(false);
  const [isAnalyticsTypeOpen, setIsAnalyticsTypeOpen] = useState(false);
  
  const [selectedFloor, setSelectedFloor] = useState(currentProperty.floors[0]);
  const [isFloorDropdownOpen, setIsFloorDropdownOpen] = useState(false);
  
  const [revenuePeriod, setRevenuePeriod] = useState<'Week' | 'Month' | 'Year'>('Week');
  const [isRevenuePeriodOpen, setIsRevenuePeriodOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState('9');

  const selectedEvents = currentProperty.events[selectedDate as keyof typeof currentProperty.events] ?? [];
  
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [calendarMonth, setCalendarMonth] = useState(5); // June
  const [calendarYear, setCalendarYear] = useState(2024);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };
  
  const handleNextProperty = () => {
    const nextIndex = (propertyIndex + 1) % ALL_PROPERTIES.length;
    setPropertyIndex(nextIndex);
    setSelectedFloor(ALL_PROPERTIES[nextIndex].floors[0]);
    setSelectedDate('9'); // reset date just in case
  };
  
  const handlePrevProperty = () => {
    const prevIndex = (propertyIndex - 1 + ALL_PROPERTIES.length) % ALL_PROPERTIES.length;
    setPropertyIndex(prevIndex);
    setSelectedFloor(ALL_PROPERTIES[prevIndex].floors[0]);
    setSelectedDate('9');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vacant': return 'bg-[#689249]'; 
      case 'occupied': return 'bg-[#4a6b33]'; 
      case 'not_ready': return 'bg-[#b0c79e]'; 
      case 'unavailable': return 'bg-gray-400'; 
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      {/* Hero Banner */}
      <div className="relative w-full h-[350px] sm:h-[450px] -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 overflow-hidden border-b-4 border-[#689249] w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)]">
        <img 
          src={currentProperty.image}
          alt={currentProperty.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight font-display mb-6 drop-shadow-lg">
            Experience Unrivaled <br />
            <span className="text-[#b0c79e]">Luxury & Comfort</span>
          </h1>
          <p className="text-base sm:text-lg text-white/95 font-medium mb-10 max-w-2xl drop-shadow-md leading-relaxed">
            A warm welcome to Grand Horizon Resort. Indulge in premium hospitality, exquisite dining, and unforgettable moments.
          </p>
          
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-white font-bold text-lg drop-shadow-md">June 9, 2024</span>
            <button 
              onClick={() => setIsAddBookingModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#689249] text-white rounded-xl shadow-lg hover:bg-[#557A3A] hover:scale-105 font-bold transition-all"
            >
              <Plus size={20} />
              New booking
            </button>
            <button 
              onClick={() => setCurrentView?.('tours')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black/30 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-lg hover:bg-black/40 hover:scale-105 font-bold transition-all"
            >
              <Globe size={20} className="text-[#8fb472]" />
              360° Hotel Tour
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentProperty.stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="group hover:-translate-y-0.5 transition-transform duration-200 shadow-sm border-gray-100 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#689249]/10 text-[#689249]`}>
                    <Icon size={20} />
                  </div>
                  <span className="flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[#689249]/10 text-[#689249] border border-[#689249]/20">
                    <ArrowUpRight size={12} className="mr-0.5" />
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold font-display text-gray-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Row 1 */}
        {/* Analytics Chart */}
        <Card className="lg:col-span-6 rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between py-5 relative">
            <CardTitle className="text-xl font-bold">Analytics</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setIsAnalyticsTypeOpen(!isAnalyticsTypeOpen)}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
                >
                  Booking <ChevronDown size={14} />
                </button>
                {isAnalyticsTypeOpen && (
                  <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsAnalyticsTypeOpen(false)}>Booking</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsAnalyticsTypeOpen(false)}>Revenue</button>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsAnalyticsPeriodOpen(!isAnalyticsPeriodOpen)}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
                >
                  {analyticsPeriod} <ChevronDown size={14} />
                </button>
                {isAnalyticsPeriodOpen && (
                  <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setAnalyticsPeriod('Week'); setIsAnalyticsPeriodOpen(false); }}>Week</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setAnalyticsPeriod('Month'); setIsAnalyticsPeriodOpen(false); }}>Month</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setAnalyticsPeriod('Year'); setIsAnalyticsPeriodOpen(false); }}>Year</button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentProperty.analytics[analyticsPeriod]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#334155', color: 'white', fontWeight: 'bold' }}
                    itemStyle={{ color: 'white' }}
                    formatter={(value) => [`${value ?? 0} bookings`, '']}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#689249" strokeWidth={3} fillOpacity={0.1} fill="#689249" />
                  <Area type="monotone" dataKey="online" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} fill="none" />
                  <Area type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} fillOpacity={0} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#689249]"></div>
                Total bookings
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                Online bookings
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div>
                Cancelled bookings
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accommodation */}
        <Card className="lg:col-span-3 rounded-2xl shadow-sm border-gray-100 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
            <CardTitle className="text-lg font-bold">Accommodation</CardTitle>
            <div className="relative">
              <button 
                onClick={() => setIsFloorDropdownOpen(!isFloorDropdownOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50"
              >
                {selectedFloor} <ChevronDown size={14} />
              </button>
              {isFloorDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                  {currentProperty.floors.map(floor => (
                    <button 
                      key={floor}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" 
                      onClick={() => { setSelectedFloor(floor); setIsFloorDropdownOpen(false); }}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {currentProperty.roomsData[selectedFloor as keyof typeof currentProperty.roomsData]?.map((room) => (
                <div 
                  key={room.no} 
                  className={`aspect-square rounded-lg ${getStatusColor(room.status)} p-1 flex flex-col items-center justify-center text-white shadow-sm transition-transform hover:scale-105 cursor-pointer`}
                  title={`${room.no} - ${room.name}`}
                >
                  <span className="font-bold text-sm leading-none">{room.no}</span>
                  <span className="text-[9px] font-medium truncate w-full text-center mt-0.5 opacity-90">{room.name}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-medium text-gray-500 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#689249]"></div>
                Vacant
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#b0c79e]"></div>
                Not ready
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4a6b33]"></div>
                Occupied
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                Unavailable
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating & Image */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex-1 rounded-[24px] overflow-hidden shadow-[0_18px_45px_rgba(17,24,39,0.14)] border border-white/70 relative bg-white group min-h-[220px]">
            <img 
              src={currentProperty.image}
              alt={currentProperty.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_40%)]"></div>

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-white">
              <div className="rounded-full border border-white/30 bg-white/15 px-3 py-1 backdrop-blur-md">
                <span className="text-[11px] font-semibold tracking-wide">Featured property</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevProperty}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNextProperty}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/80">Luxury stay</p>
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{currentProperty.name}</h3>
                </div>
                <div className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md text-sm font-semibold">
                  {currentProperty.rating} ★
                </div>
              </div>
            </div>
          </div>
          <Card className="rounded-2xl shadow-sm border-gray-100 flex flex-col justify-center items-center text-center p-4">
            <div className="text-4xl lg:text-5xl font-bold text-[#689249] tracking-tight">{currentProperty.rating}</div>
            <div className="text-[10px] lg:text-xs text-gray-500 mt-2 font-medium">Based on {currentProperty.reviews} reviews</div>
            <button 
              onClick={() => setIsReviewsModalOpen(true)}
              className="text-xs lg:text-sm font-semibold text-[#689249] mt-4 hover:underline"
            >
              Discover
            </button>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="lg:col-span-12 rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="py-4">
            <CardTitle>Manager Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-4">
            {[
              { label: 'Restaurant & Café', icon: Star, view: 'restaurant' },
              { label: 'Inventory', icon: FileBarChart, view: 'inventory' },
              { label: 'Billing & Invoices', icon: TrendingUp, view: 'billing' },
              { label: 'Staff Management', icon: Users, view: 'staff' },
              { label: 'Housekeeping', icon: Sparkles, view: 'housekeeping' },
              { label: 'Maintenance', icon: Key, view: 'maintenance' },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => setCurrentView?.(action.view as View)}
                  className="w-full flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#689249]/30 hover:bg-[#689249]/5 transition-all text-center group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm group-hover:border-[#689249]/20 group-hover:text-[#689249]`}>
                    <Icon size={20} className="text-gray-500 group-hover:text-[#689249] transition-colors" />
                  </div>
                  <span className="font-semibold text-sm text-gray-700 group-hover:text-gray-900 leading-tight">{action.label}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Row 3 */}
        {/* Guests Table */}
        <Card className="lg:col-span-6 rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
            <CardTitle className="text-xl font-bold">Guests</CardTitle>
            <button 
              onClick={() => setCurrentView?.('bookings')}
              className="text-sm font-semibold text-[#689249] hover:underline"
            >
              Show all
            </button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 font-sans">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 font-sans text-center">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 font-sans">Room</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 font-sans">Check-in</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-400 font-sans">Check-out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentProperty.guests.map((guest, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-bold text-gray-900">{guest.name}</td>
                    <td className="px-6 py-3.5 text-center">
                      {guest.status && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#689249]/10 text-[#689249] uppercase tracking-wider">
                          {guest.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-700">{guest.room}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-700">{guest.checkIn}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-700">{guest.checkOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Extra Revenue */}
        <Card className="lg:col-span-3 rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
            <CardTitle className="text-xl font-bold">Extra revenue</CardTitle>
            <div className="relative">
              <button 
                onClick={() => setIsRevenuePeriodOpen(!isRevenuePeriodOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50"
              >
                {revenuePeriod} <ChevronDown size={14} />
              </button>
              {isRevenuePeriodOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setRevenuePeriod('Week'); setIsRevenuePeriodOpen(false); }}>Week</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setRevenuePeriod('Month'); setIsRevenuePeriodOpen(false); }}>Month</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setRevenuePeriod('Year'); setIsRevenuePeriodOpen(false); }}>Year</button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            {currentProperty.revenue[revenuePeriod].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2 text-sm">
                  <span className="font-semibold text-gray-900">{item.label}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
                  <div 
                    className="bg-[#689249] h-1.5 rounded-full" 
                    style={{ width: `${(item.current / item.max) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500">
                  <span className="text-gray-900">${(item.current / 1000).toFixed(3).replace('.', ',')}</span>
                  <span>${(item.max / 1000).toFixed(3).replace('.', ',')}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Events / Calendar */}
        <Card className="lg:col-span-3 rounded-2xl shadow-sm border-gray-100 flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between py-5 pb-2">
            <CardTitle className="text-xl font-bold mt-1">Events</CardTitle>
            <div className="flex flex-col items-end lg:items-stretch gap-2 w-auto lg:w-[150px]">
              <div className="flex items-center justify-between text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 w-full">
                <ChevronLeft size={16} className="text-gray-400 cursor-pointer hover:text-gray-900 shrink-0" onClick={handlePrevMonth} />
                <span className="text-center text-xs lg:text-sm flex-1 whitespace-nowrap">{MONTHS[calendarMonth]} {calendarYear}</span>
                <ChevronRight size={16} className="text-gray-400 cursor-pointer hover:text-gray-900 shrink-0" onClick={handleNextMonth} />
              </div>
              <button 
                onClick={() => setIsAddEventModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#689249] text-white rounded-lg hover:bg-[#5a7d3f] transition-colors text-sm font-semibold shadow-sm w-full"
              >
                <Plus size={14} />
                <span>Add Event</span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="mb-6">
              <div className="grid grid-cols-7 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-[11px] font-bold text-gray-400">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center gap-y-2 text-sm font-semibold">
                {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="text-gray-300">
                    {new Date(calendarYear, calendarMonth, 0).getDate() - new Date(calendarYear, calendarMonth, 1).getDay() + i + 1}
                  </div>
                ))}
                {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, i) => {
                  const day = (i + 1).toString();
                  // We'll simulate events only for the current month/year for simplicity, 
                  // or just allow the mock events to show up if the day matches.
                  // Real app would filter by month/year too.
                  const hasEvents = calendarMonth === 5 && calendarYear === 2024 ? currentProperty.events[day as keyof typeof currentProperty.events] : null;
                  const isSelected = selectedDate === day && calendarMonth === 5 && calendarYear === 2024;
                  
                  return (
                    <div 
                      key={day}
                      onClick={() => {
                        setSelectedDate(day);
                        // In a real app we'd also store selectedMonth/Year to show correct events
                      }}
                      className={`relative ${isSelected ? 'text-white bg-[#689249]' : hasEvents ? 'text-[#689249] bg-[#689249]/10' : 'text-gray-900 hover:bg-gray-50'} rounded-full w-7 h-7 flex items-center justify-center mx-auto cursor-pointer transition-colors`}
                    >
                      {day}
                      {hasEvents && (
                        <div className="absolute -bottom-1 flex gap-0.5">
                          {hasEvents.map((_, idx) => (
                            <div key={idx} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#689249]'}`}></div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {Array.from({ length: 42 - new Date(calendarYear, calendarMonth, 1).getDay() - new Date(calendarYear, calendarMonth + 1, 0).getDate() }).slice(0, 7 - ((new Date(calendarYear, calendarMonth, 1).getDay() + new Date(calendarYear, calendarMonth + 1, 0).getDate()) % 7)).map((_, i) => (
                  <div key={`empty-end-${i}`} className="text-gray-300">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, i) => (
                  <div key={i} className={`flex overflow-hidden rounded-xl ${event.bg}`}>
                    <div className={`w-1 ${event.color}`}></div>
                    <div className="p-3 pl-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-0.5">{event.title}</h4>
                      <p className="text-xs font-semibold text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-gray-500 font-medium">
                  No events for this date
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
      
      {isAddBookingModalOpen && (
        <AddBookingModal onClose={() => setIsAddBookingModalOpen(false)} />
      )}
      {isAddEventModalOpen && (
        <AddEventModal 
          onClose={() => setIsAddEventModalOpen(false)} 
          selectedDate={selectedDate}
          selectedMonth={MONTHS[calendarMonth]}
        />
      )}
      {isReviewsModalOpen && (
        <ReviewsModal 
          onClose={() => setIsReviewsModalOpen(false)}
          propertyName={currentProperty.name}
          rating={currentProperty.rating}
        />
      )}
    </div>
  );
}

