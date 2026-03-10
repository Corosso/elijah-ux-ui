import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  LayoutDashboardIcon,
  CalendarIcon,
  CarIcon,
  UsersIcon,
  UserIcon,
  BarChart3Icon,
  DollarSignIcon,
  StarIcon,
  TrendingUpIcon,
  ClipboardListIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  WrenchIcon,
  ClockIcon,
  CrownIcon,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
}

type SidebarItem = 'dashboard' | 'bookings' | 'fleet' | 'drivers' | 'customers' | 'analytics';

interface Booking {
  id: string;
  customer: string;
  route: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Cancelled';
  amount: string;
}

const sidebarItems: { key: SidebarItem; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { key: 'bookings', label: 'Bookings', icon: CalendarIcon },
  { key: 'fleet', label: 'Fleet', icon: CarIcon },
  { key: 'drivers', label: 'Drivers', icon: UsersIcon },
  { key: 'customers', label: 'Customers', icon: UserIcon },
  { key: 'analytics', label: 'Analytics', icon: BarChart3Icon },
];

const mockBookings: Booking[] = [
  { id: '#ELJ-001', customer: 'Maria Garcia', route: 'Bogota -> Medellin', date: '2026-03-09', status: 'Completed', amount: '$120' },
  { id: '#ELJ-002', customer: 'Carlos Ruiz', route: 'Medellin -> Rionegro', date: '2026-03-09', status: 'In Progress', amount: '$45' },
  { id: '#ELJ-003', customer: 'Ana Torres', route: 'Cartagena -> Barranquilla', date: '2026-03-08', status: 'Completed', amount: '$85' },
  { id: '#ELJ-004', customer: 'Diego Mendoza', route: 'Bogota -> Cali', date: '2026-03-08', status: 'Scheduled', amount: '$180' },
  { id: '#ELJ-005', customer: 'Sofia Herrera', route: 'Cali -> Bogota', date: '2026-03-07', status: 'Completed', amount: '$175' },
  { id: '#ELJ-006', customer: 'Juan Ramirez', route: 'Bogota -> Airport', date: '2026-03-07', status: 'Cancelled', amount: '$35' },
];

const statCards = [
  { label: 'Total Bookings', value: '1,247', icon: ClipboardListIcon, color: '#D4AF37' },
  { label: 'Revenue', value: '$45,230 USD', icon: DollarSignIcon, color: '#22C55E' },
  { label: 'Active Drivers', value: '18', icon: TrendingUpIcon, color: '#3B82F6' },
  { label: 'Average Rating', value: '4.9', icon: StarIcon, color: '#F59E0B' },
];

function getStatusStyle(status: Booking['status']): string {
  if (status === 'Completed') return 'bg-green-900/40 text-green-400 border border-green-700/50';
  if (status === 'In Progress') return 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/50';
  if (status === 'Scheduled') return 'bg-blue-900/40 text-blue-400 border border-blue-700/50';
  if (status === 'Cancelled') return 'bg-red-900/40 text-red-400 border border-red-700/50';
  return '';
}

function DashboardView() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl p-5"
              style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm" style={{ color: '#9A9590' }}>{card.label}</span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: card.color + '1A' }}
                >
                  <IconComp size={20} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#F5F0E8' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#F5F0E8' }}>Recent Bookings</h3>
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2520' }}>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>ID</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>Customer</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>Route</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>Date</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>Status</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map((booking) => {
                  return (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #2A2520' }} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono" style={{ color: '#D4AF37' }}>{booking.id}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#F5F0E8' }}>{booking.customer}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{booking.route}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{booking.date}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={"px-2.5 py-1 rounded-full text-xs font-medium " + getStatusStyle(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: '#F5F0E8' }}>{booking.amount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- BookingsView --- */

const fullBookings = [
  { id: '#ELJ-001', customer: 'Maria Garcia', phone: '+57 310 234 5678', route: 'Bogota -> Medellin', vehicle: 'Mercedes S-Class', driver: 'Andres Lopez', date: '2026-03-09', time: '08:30', status: 'Completed' as const, amount: '$120' },
  { id: '#ELJ-002', customer: 'Carlos Ruiz', phone: '+57 315 876 5432', route: 'Medellin -> Rionegro', vehicle: 'Cadillac XTS', driver: 'Felipe Moreno', date: '2026-03-09', time: '10:15', status: 'In Progress' as const, amount: '$45' },
  { id: '#ELJ-003', customer: 'Ana Torres', phone: '+57 320 111 2233', route: 'Cartagena -> Barranquilla', vehicle: 'Cadillac Escalade', driver: 'Ricardo Soto', date: '2026-03-08', time: '14:00', status: 'Completed' as const, amount: '$85' },
  { id: '#ELJ-004', customer: 'Diego Mendoza', phone: '+57 311 444 5566', route: 'Bogota -> Cali', vehicle: 'Mercedes S-Class', driver: 'Andres Lopez', date: '2026-03-10', time: '06:00', status: 'Scheduled' as const, amount: '$180' },
  { id: '#ELJ-005', customer: 'Sofia Herrera', phone: '+57 318 999 8877', route: 'Cali -> Bogota', vehicle: 'Tesla Model X', driver: 'Camilo Vargas', date: '2026-03-07', time: '09:45', status: 'Completed' as const, amount: '$175' },
  { id: '#ELJ-006', customer: 'Juan Ramirez', phone: '+57 300 222 3344', route: 'Bogota -> Airport', vehicle: 'Chevy Suburban', driver: 'Luis Perez', date: '2026-03-07', time: '05:30', status: 'Cancelled' as const, amount: '$35' },
  { id: '#ELJ-007', customer: 'Valentina Rojas', phone: '+57 312 555 6677', route: 'Medellin -> Airport', vehicle: 'Mercedes Sprinter', driver: 'Oscar Gutierrez', date: '2026-03-09', time: '11:00', status: 'In Progress' as const, amount: '$55' },
  { id: '#ELJ-008', customer: 'Santiago Castro', phone: '+57 316 888 9900', route: 'Cartagena City Tour', vehicle: 'Cadillac Escalade', driver: 'Ricardo Soto', date: '2026-03-09', time: '13:30', status: 'Scheduled' as const, amount: '$95' },
  { id: '#ELJ-009', customer: 'Laura Quintero', phone: '+57 319 333 4455', route: 'Bogota -> Tunja', vehicle: 'Chevy Suburban', driver: 'Luis Perez', date: '2026-03-08', time: '07:00', status: 'Completed' as const, amount: '$65' },
  { id: '#ELJ-010', customer: 'Alejandro Bernal', phone: '+57 321 666 7788', route: 'Cali -> Popayan', vehicle: 'Tesla Model X', driver: 'Camilo Vargas', date: '2026-03-08', time: '15:30', status: 'Completed' as const, amount: '$110' },
  { id: '#ELJ-011', customer: 'Camila Ospina', phone: '+57 314 111 0099', route: 'Bogota -> Villa de Leyva', vehicle: 'Mercedes S-Class', driver: 'Andres Lopez', date: '2026-03-10', time: '08:00', status: 'Scheduled' as const, amount: '$140' },
  { id: '#ELJ-012', customer: 'Mateo Cardenas', phone: '+57 317 222 3311', route: 'Medellin -> Guatape', vehicle: 'Cadillac XTS', driver: 'Felipe Moreno', date: '2026-03-06', time: '09:00', status: 'Cancelled' as const, amount: '$70' },
];

function BookingsView() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filtered = fullBookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch = searchText === '' || b.customer.toLowerCase().includes(searchText.toLowerCase()) || b.id.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold" style={{ color: '#F5F0E8' }}>Bookings Management</h3>

      {/* Filter Bar */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl"
        style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}
      >
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); }}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: '#141414', color: '#F5F0E8', border: '1px solid #2A2520' }}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <span className="text-sm" style={{ color: '#9A9590' }}>Mar 1 - Mar 9, 2026</span>
        <div className="flex items-center gap-2 ml-auto rounded-lg px-3 py-2" style={{ backgroundColor: '#141414', border: '1px solid #2A2520' }}>
          <SearchIcon size={14} style={{ color: '#9A9590' }} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); }}
            className="bg-transparent text-sm outline-none w-40"
            style={{ color: '#F5F0E8' }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2520' }}>
                {['ID', 'Customer', 'Phone', 'Route', 'Vehicle', 'Driver', 'Date', 'Time', 'Status', 'Amount'].map((h) => {
                  return <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #2A2520' }} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: '#D4AF37' }}>{b.id}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#F5F0E8' }}>{b.customer}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{b.phone}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{b.route}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#F5F0E8' }}>{b.vehicle}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{b.driver}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{b.date}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{b.time}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={"px-2.5 py-1 rounded-full text-xs font-medium " + getStatusStyle(b.status)}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#F5F0E8' }}>{b.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: '1px solid #2A2520' }}
        >
          <span className="text-sm" style={{ color: '#9A9590' }}>Showing 1-12 of 156 bookings</span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm" style={{ color: '#9A9590', border: '1px solid #2A2520' }}>
              <ChevronLeftIcon size={14} /> Prev
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm" style={{ color: '#F5F0E8', backgroundColor: '#D4AF371A', border: '1px solid #D4AF3733' }}>
              Next <ChevronRightIcon size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- FleetView --- */

const fleetStats = [
  { label: 'Total Vehicles', value: '23', icon: CarIcon, color: '#D4AF37' },
  { label: 'Available', value: '18', icon: MapPinIcon, color: '#22C55E' },
  { label: 'In Service', value: '4', icon: ClockIcon, color: '#3B82F6' },
  { label: 'Maintenance', value: '1', icon: WrenchIcon, color: '#EF4444' },
];

const fleetVehicles = [
  { name: 'Mercedes S-Class', category: 'Sedan Luxury', plate: 'ABC-123', status: 'Available', mileage: '12,450 km', image: '/flota/mercedes-s-class.png' },
  { name: 'Cadillac XTS', category: 'Sedan Premium', plate: 'DEF-456', status: 'In Service', mileage: '28,300 km', image: '/flota/cadillac-xts.png' },
  { name: 'Cadillac Escalade', category: 'SUV Luxury', plate: 'GHI-789', status: 'Available', mileage: '9,870 km', image: '/flota/cadillac-escalade.png' },
  { name: 'Chevy Suburban', category: 'SUV Premium', plate: 'JKL-012', status: 'Available', mileage: '34,500 km', image: '/flota/chevy-suv.png' },
  { name: 'Tesla Model X', category: 'SUV Electric', plate: 'MNO-345', status: 'In Service', mileage: '15,200 km', image: '/flota/tesla-model-x.png' },
  { name: 'Mercedes Sprinter', category: 'Van Luxury', plate: 'PQR-678', status: 'Maintenance', mileage: '52,100 km', image: '/flota/mercedes-sprinter.png' },
];

function getFleetStatusStyle(status: string) {
  if (status === 'Available') return { backgroundColor: '#22C55E1A', color: '#22C55E', border: '1px solid #22C55E33' };
  if (status === 'In Service') return { backgroundColor: '#3B82F61A', color: '#3B82F6', border: '1px solid #3B82F633' };
  if (status === 'Maintenance') return { backgroundColor: '#EF44441A', color: '#EF4444', border: '1px solid #EF444433' };
  return {};
}

function FleetView() {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold" style={{ color: '#F5F0E8' }}>Fleet Management</h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {fleetStats.map((card) => {
          const IconComp = card.icon;
          return (
            <div key={card.label} className="rounded-xl p-5" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm" style={{ color: '#9A9590' }}>{card.label}</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '1A' }}>
                  <IconComp size={20} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#F5F0E8' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fleetVehicles.map((v) => {
          return (
            <div key={v.plate} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
              <div className="h-40 overflow-hidden" style={{ backgroundColor: '#141414' }}>
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>{v.name}</h4>
                    <p className="text-xs" style={{ color: '#9A9590' }}>{v.category}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={getFleetStatusStyle(v.status)}>
                    {v.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: '#9A9590' }}>
                  <span>{'Plate: ' + v.plate}</span>
                  <span>{v.mileage}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- DriversView --- */

const driverStats = [
  { label: 'Total Drivers', value: '24', icon: UsersIcon, color: '#D4AF37' },
  { label: 'Active Today', value: '18', icon: TrendingUpIcon, color: '#22C55E' },
  { label: 'On Trip', value: '4', icon: CarIcon, color: '#3B82F6' },
  { label: 'Off Duty', value: '2', icon: ClockIcon, color: '#9A9590' },
];

const driversData = [
  { name: 'Andres Lopez', idNum: 'CC 1.023.456.789', phone: '+57 310 123 4567', rating: 4.9, trips: 5, status: 'Active', vehicle: 'Mercedes S-Class' },
  { name: 'Felipe Moreno', idNum: 'CC 1.045.678.901', phone: '+57 315 234 5678', rating: 4.8, trips: 3, status: 'On Trip', vehicle: 'Cadillac XTS' },
  { name: 'Ricardo Soto', idNum: 'CC 1.067.890.123', phone: '+57 320 345 6789', rating: 4.7, trips: 4, status: 'Active', vehicle: 'Cadillac Escalade' },
  { name: 'Camilo Vargas', idNum: 'CC 1.089.012.345', phone: '+57 318 456 7890', rating: 5.0, trips: 6, status: 'On Trip', vehicle: 'Tesla Model X' },
  { name: 'Luis Perez', idNum: 'CC 1.012.345.678', phone: '+57 300 567 8901', rating: 4.6, trips: 2, status: 'Active', vehicle: 'Chevy Suburban' },
  { name: 'Oscar Gutierrez', idNum: 'CC 1.034.567.890', phone: '+57 312 678 9012', rating: 4.8, trips: 4, status: 'On Trip', vehicle: 'Mercedes Sprinter' },
  { name: 'Jorge Castillo', idNum: 'CC 1.056.789.012', phone: '+57 316 789 0123', rating: 4.5, trips: 1, status: 'Off Duty', vehicle: 'Unassigned' },
  { name: 'Daniel Restrepo', idNum: 'CC 1.078.901.234', phone: '+57 319 890 1234', rating: 4.9, trips: 0, status: 'Off Duty', vehicle: 'Unassigned' },
];

function getDriverStatusStyle(status: string) {
  if (status === 'Active') return 'bg-green-900/40 text-green-400 border border-green-700/50';
  if (status === 'On Trip') return 'bg-blue-900/40 text-blue-400 border border-blue-700/50';
  if (status === 'Off Duty') return 'bg-gray-800/40 text-gray-400 border border-gray-700/50';
  return '';
}

function renderStars(rating: number) {
  const stars = [];
  for (var i = 0; i < 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        size={12}
        style={{ color: i < Math.round(rating) ? '#D4AF37' : '#2A2520' }}
        fill={i < Math.round(rating) ? '#D4AF37' : 'none'}
      />
    );
  }
  return stars;
}

function DriversView() {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold" style={{ color: '#F5F0E8' }}>Driver Management</h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {driverStats.map((card) => {
          const IconComp = card.icon;
          return (
            <div key={card.label} className="rounded-xl p-5" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm" style={{ color: '#9A9590' }}>{card.label}</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '1A' }}>
                  <IconComp size={20} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#F5F0E8' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Drivers Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2520' }}>
                {['Name', 'ID', 'Phone', 'Rating', 'Trips Today', 'Status', 'Vehicle Assigned'].map((h) => {
                  return <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {driversData.map((d) => {
                return (
                  <tr key={d.idNum} style={{ borderBottom: '1px solid #2A2520' }} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#F5F0E8' }}>{d.name}</td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9A9590' }}>{d.idNum}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{d.phone}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        {renderStars(d.rating)}
                        <span className="ml-1 text-xs" style={{ color: '#9A9590' }}>{d.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#F5F0E8' }}>{d.trips}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={"px-2.5 py-1 rounded-full text-xs font-medium " + getDriverStatusStyle(d.status)}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{d.vehicle}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --- CustomersView --- */

const customerStats = [
  { label: 'Total Customers', value: '1,247', icon: UsersIcon, color: '#D4AF37' },
  { label: 'New This Month', value: '89', icon: TrendingUpIcon, color: '#22C55E' },
  { label: 'VIP Members', value: '156', icon: CrownIcon, color: '#A855F7' },
  { label: 'Avg Satisfaction', value: '4.8', icon: StarIcon, color: '#F59E0B' },
];

const customersData = [
  { name: 'Maria Garcia', email: 'maria.garcia@email.com', phone: '+57 310 234 5678', trips: 42, spent: '$5,240', since: 'Jan 2024', tier: 'Platinum' },
  { name: 'Carlos Ruiz', email: 'carlos.ruiz@email.com', phone: '+57 315 876 5432', trips: 28, spent: '$3,150', since: 'Mar 2024', tier: 'Gold' },
  { name: 'Ana Torres', email: 'ana.torres@email.com', phone: '+57 320 111 2233', trips: 15, spent: '$1,890', since: 'Jun 2024', tier: 'Gold' },
  { name: 'Diego Mendoza', email: 'diego.mendoza@email.com', phone: '+57 311 444 5566', trips: 8, spent: '$960', since: 'Sep 2024', tier: 'Standard' },
  { name: 'Sofia Herrera', email: 'sofia.herrera@email.com', phone: '+57 318 999 8877', trips: 56, spent: '$7,820', since: 'Nov 2023', tier: 'Platinum' },
  { name: 'Juan Ramirez', email: 'juan.ramirez@email.com', phone: '+57 300 222 3344', trips: 3, spent: '$340', since: 'Feb 2026', tier: 'Standard' },
  { name: 'Valentina Rojas', email: 'valentina.rojas@email.com', phone: '+57 312 555 6677', trips: 21, spent: '$2,470', since: 'May 2024', tier: 'Gold' },
  { name: 'Santiago Castro', email: 'santiago.castro@email.com', phone: '+57 316 888 9900', trips: 67, spent: '$9,130', since: 'Aug 2023', tier: 'Platinum' },
];

function getTierStyle(tier: string) {
  if (tier === 'Platinum') return { backgroundColor: '#A855F71A', color: '#A855F7', border: '1px solid #A855F733' };
  if (tier === 'Gold') return { backgroundColor: '#D4AF371A', color: '#D4AF37', border: '1px solid #D4AF3733' };
  return { backgroundColor: '#9A95901A', color: '#9A9590', border: '1px solid #9A959033' };
}

function CustomersView() {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold" style={{ color: '#F5F0E8' }}>Customer Management</h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {customerStats.map((card) => {
          const IconComp = card.icon;
          return (
            <div key={card.label} className="rounded-xl p-5" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm" style={{ color: '#9A9590' }}>{card.label}</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '1A' }}>
                  <IconComp size={20} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#F5F0E8' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Customers Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2520' }}>
                {['Name', 'Email', 'Phone', 'Total Trips', 'Total Spent', 'Member Since', 'Tier'].map((h) => {
                  return <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {customersData.map((c) => {
                return (
                  <tr key={c.email} style={{ borderBottom: '1px solid #2A2520' }} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#F5F0E8' }}>{c.name}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{c.email}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{c.phone}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#F5F0E8' }}>{c.trips}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#F5F0E8' }}>{c.spent}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{c.since}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={getTierStyle(c.tier)}>
                        {c.tier}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --- AnalyticsView --- */

const analyticsStats = [
  { label: 'Monthly Revenue', value: '$12,450', icon: DollarSignIcon, color: '#22C55E' },
  { label: 'Trip Growth', value: '+18%', icon: TrendingUpIcon, color: '#3B82F6' },
  { label: 'Avg Trip Value', value: '$38', icon: ClipboardListIcon, color: '#D4AF37' },
  { label: 'Customer Retention', value: '92%', icon: UsersIcon, color: '#A855F7' },
];

const revenueByCityData = [
  { city: 'Bogota', pct: 45, revenue: '$5,603' },
  { city: 'Medellin', pct: 28, revenue: '$3,486' },
  { city: 'Cartagena', pct: 15, revenue: '$1,868' },
  { city: 'Cali', pct: 8, revenue: '$997' },
  { city: 'Others', pct: 4, revenue: '$496' },
];

const topRoutesData = [
  { route: 'Bogota -> Medellin', trips: 245, revenue: '$29,400', avg: '$120' },
  { route: 'Bogota -> Airport', trips: 189, revenue: '$6,615', avg: '$35' },
  { route: 'Medellin -> Rionegro', trips: 156, revenue: '$7,020', avg: '$45' },
  { route: 'Cartagena -> Barranquilla', trips: 132, revenue: '$11,220', avg: '$85' },
  { route: 'Cali -> Bogota', trips: 98, revenue: '$17,150', avg: '$175' },
  { route: 'Cartagena City Tour', trips: 87, revenue: '$8,265', avg: '$95' },
];

const peakHoursData = [
  { hour: '6 AM', level: 'medium' },
  { hour: '7 AM', level: 'high' },
  { hour: '8 AM', level: 'very high' },
  { hour: '9 AM', level: 'very high' },
  { hour: '10 AM', level: 'high' },
  { hour: '11 AM', level: 'medium' },
  { hour: '12 PM', level: 'medium' },
  { hour: '1 PM', level: 'low' },
  { hour: '2 PM', level: 'low' },
  { hour: '3 PM', level: 'medium' },
  { hour: '4 PM', level: 'high' },
  { hour: '5 PM', level: 'very high' },
  { hour: '6 PM', level: 'very high' },
  { hour: '7 PM', level: 'high' },
  { hour: '8 PM', level: 'high' },
  { hour: '9 PM', level: 'medium' },
  { hour: '10 PM', level: 'low' },
  { hour: '11 PM', level: 'low' },
];

function getPeakColor(level: string) {
  if (level === 'very high') return '#D4AF37';
  if (level === 'high') return '#D4AF3799';
  if (level === 'medium') return '#D4AF3755';
  return '#D4AF3722';
}

function AnalyticsView() {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold" style={{ color: '#F5F0E8' }}>Analytics Dashboard</h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsStats.map((card) => {
          const IconComp = card.icon;
          return (
            <div key={card.label} className="rounded-xl p-5" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm" style={{ color: '#9A9590' }}>{card.label}</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '1A' }}>
                  <IconComp size={20} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#F5F0E8' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Revenue by City */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
        <h4 className="text-sm font-semibold mb-4" style={{ color: '#F5F0E8' }}>Revenue by City</h4>
        <div className="space-y-3">
          {revenueByCityData.map((item) => {
            return (
              <div key={item.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#F5F0E8' }}>{item.city}</span>
                  <span style={{ color: '#9A9590' }}>{item.pct + '% - ' + item.revenue}</span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#2A2520' }}>
                  <div
                    className="h-3 rounded-full"
                    style={{ width: item.pct + '%', backgroundColor: '#D4AF37' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Routes Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #2A2520' }}>
          <h4 className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>Top Routes</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2520' }}>
                {['Route', 'Trips', 'Revenue', 'Avg Price'].map((h) => {
                  return <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#9A9590' }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {topRoutesData.map((r) => {
                return (
                  <tr key={r.route} style={{ borderBottom: '1px solid #2A2520' }} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm" style={{ color: '#F5F0E8' }}>{r.route}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9A9590' }}>{r.trips}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#F5F0E8' }}>{r.revenue}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#D4AF37' }}>{r.avg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2520' }}>
        <h4 className="text-sm font-semibold mb-4" style={{ color: '#F5F0E8' }}>Peak Hours</h4>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
          {peakHoursData.map((h) => {
            return (
              <div key={h.hour} className="flex flex-col items-center gap-1">
                <div
                  className="w-full aspect-square rounded-lg"
                  style={{ backgroundColor: getPeakColor(h.level) }}
                />
                <span className="text-[10px]" style={{ color: '#9A9590' }}>{h.hour}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#D4AF3722' }} />
            <span className="text-[10px]" style={{ color: '#9A9590' }}>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#D4AF3755' }} />
            <span className="text-[10px]" style={{ color: '#9A9590' }}>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#D4AF3799' }} />
            <span className="text-[10px]" style={{ color: '#9A9590' }}>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#D4AF37' }} />
            <span className="text-[10px]" style={{ color: '#9A9590' }}>Very High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Main AdminPanel --- */

export function AdminPanel({ isOpen, onClose, user }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<SidebarItem>('dashboard');

  function renderContent() {
    if (activeSection === 'dashboard') return <DashboardView />;
    if (activeSection === 'bookings') return <BookingsView />;
    if (activeSection === 'fleet') return <FleetView />;
    if (activeSection === 'drivers') return <DriversView />;
    if (activeSection === 'customers') return <CustomersView />;
    if (activeSection === 'analytics') return <AnalyticsView />;
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col"
          style={{ backgroundColor: '#0A0A0A' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 h-16 shrink-0"
            style={{ backgroundColor: '#0A0A0A', borderBottom: '1px solid #2A2520' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-wide" style={{ color: '#D4AF37' }}>ELIJAH</span>
              <span className="text-sm font-medium" style={{ color: '#9A9590' }}>|</span>
              <span className="text-sm font-medium" style={{ color: '#F5F0E8' }}>Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#D4AF3733' }}
                >
                  <UserIcon size={16} style={{ color: '#D4AF37' }} />
                </div>
                <span className="text-sm" style={{ color: '#F5F0E8' }}>{user}</span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ color: '#9A9590' }}
                aria-label="Close admin panel"
              >
                <XIcon size={20} />
              </button>
            </div>
          </div>

          {/* Body: Sidebar + Content */}
          <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
            {/* Sidebar - Desktop */}
            <nav
              className="hidden sm:flex flex-col w-[200px] shrink-0 py-4 overflow-y-auto"
              style={{ backgroundColor: '#141414', borderRight: '1px solid #2A2520' }}
            >
              {sidebarItems.map((item) => {
                const isActive = activeSection === item.key;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => { setActiveSection(item.key); }}
                    className={"flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors w-full text-left " + (isActive ? "" : "hover:bg-white/5")}
                    style={
                      isActive
                        ? { color: '#D4AF37', borderLeft: '3px solid #D4AF37', backgroundColor: '#D4AF370D' }
                        : { color: '#9A9590', borderLeft: '3px solid transparent' }
                    }
                  >
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Navigation */}
            <div
              className="flex sm:hidden overflow-x-auto shrink-0 px-2 gap-1 py-2"
              style={{ backgroundColor: '#141414', borderBottom: '1px solid #2A2520' }}
            >
              {sidebarItems.map((item) => {
                const isActive = activeSection === item.key;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => { setActiveSection(item.key); }}
                    className={"flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors " + (isActive ? "" : "hover:bg-white/5")}
                    style={
                      isActive
                        ? { color: '#D4AF37', backgroundColor: '#D4AF371A' }
                        : { color: '#9A9590' }
                    }
                  >
                    <IconComp size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
