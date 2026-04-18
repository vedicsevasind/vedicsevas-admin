import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Building, Users,
  Calendar, LogOut
} from 'lucide-react';

const navItems = [
  { path: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { path: '/pujas',      label: 'Pujas',       icon: BookOpen },
  { path: '/temples',    label: 'Temples',     icon: Building },
  { path: '/priests',    label: 'Priests',     icon: Users },
  { path: '/bookings',   label: 'Bookings',    icon: Calendar },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { admin, logout } = useAuth();

  return (
    <div className="w-64 bg-saffron-700 text-white min-h-screen flex flex-col">
      {/* Logo area */}
      <div className="p-6 border-b border-saffron-600">
        <div className="text-3xl mb-1">🕉️</div>
        <h1 className="text-xl font-bold">VedicSevas</h1>
        <p className="text-orange-300 text-xs">Admin Panel</p>
      </div>

      {/* Admin info */}
      <div className="px-4 py-3 border-b border-saffron-600">
        <p className="text-xs text-orange-300">Logged in as</p>
        <p className="text-sm font-medium truncate">{admin?.name}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-white text-saffron-700 font-semibold'
                  : 'text-orange-100 hover:bg-saffron-600'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}