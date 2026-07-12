import { Link, useLocation } from 'react-router';
import type { UserPublic } from '~/lib/types';

interface SidebarProps {
  user: UserPublic;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    roles: ['admin'],
  },
  {
    label: 'Dashboard',
    href: '/dashboard/ustadz',
    icon: '📊',
    roles: ['ustadz'],
  },
  {
    label: 'Santri',
    href: '/santri',
    icon: '👨‍🎓',
    roles: ['admin'],
  },
  {
    label: 'Ustadz',
    href: '/ustadz',
    icon: '👨‍🏫',
    roles: ['admin'],
  },
  {
    label: 'Kelas',
    href: '/kelas',
    icon: '🏫',
    roles: ['admin'],
  },
  {
    label: 'Mata Pelajaran',
    href: '/mapel',
    icon: '📖',
    roles: ['admin'],
  },
  {
    label: 'Wali Santri',
    href: '/wali',
    icon: '👪',
    roles: ['admin'],
  },
  {
    label: 'Jadwal',
    href: '/jadwal',
    icon: '📅',
    roles: ['admin', 'ustadz'],
  },
  {
    label: 'Absensi',
    href: '/absensi',
    icon: '✅',
    roles: ['admin', 'ustadz'],
  },
  {
    label: 'Laporan',
    href: '/laporan',
    icon: '📋',
    roles: ['admin'],
  },
];

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const filteredItems = navItems.filter(
    (item) => item.roles.includes(user.role) || user.role === 'admin',
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-[#0D6B3E] flex items-center justify-center text-white text-lg">
            🕌
          </div>
          <div>
            <h1 className="font-semibold text-[#1A1D23] text-sm leading-tight">
              Web Absensi
            </h1>
            <p className="text-[10px] text-[#6B7280]">Pondok Pesantren</p>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-3 border-b border-gray-100 bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0D6B3E] flex items-center justify-center text-white text-xs font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1D23] truncate">
                {user.username}
              </p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#E8F5EF] text-[#0D6B3E]">
                {user.role === 'admin'
                  ? 'Admin'
                  : user.role === 'ustadz'
                    ? 'Ustadz'
                    : user.role === 'santri'
                      ? 'Santri'
                      : 'Wali Santri'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-[#E8F5EF] text-[#0D6B3E] border-l-[3px] border-[#0D6B3E]'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1D23] border-l-[3px] border-transparent'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white">
          <form action="/logout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors duration-200"
            >
              <span>🚪</span>
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
