import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';

const NAV = [
  { href: '/farmer/dashboard', label: 'Overview',    icon: '📊' },
  { href: '/farmer/products',  label: 'My Products', icon: '🌾' },
  { href: '/farmer/add-product', label: 'Add Product', icon: '➕' },
  { href: '/farmer/orders',    label: 'Orders',      icon: '📦' },
  { href: '/farmer/profile',   label: 'Farm Profile', icon: '🏡' },
];

export default function FarmerSidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-green-950 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-lg">🌾</div>
          <div>
            <span className="font-display text-lg font-bold text-white">Krishi</span>
            <span className="font-display text-lg font-bold text-green-400"> Market</span>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-lg font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs text-green-300/70">Farmer Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        <p className="px-6 pt-2 pb-1 text-[10px] font-bold tracking-widest uppercase text-white/30">Menu</p>
        {NAV.map(item => (
          <Link key={item.href} href={item.href}>
            <div className={`dash-nav-item ${router.pathname === item.href ? 'active' : ''}`}>
              <span className="text-lg w-6 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/">
          <div className="dash-nav-item">
            <span className="text-lg w-6 text-center">🏠</span>
            <span>Back to Store</span>
          </div>
        </Link>
        <div className="dash-nav-item" onClick={() => { logout(); router.push('/'); }}>
          <span className="text-lg w-6 text-center">🚪</span>
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  );
}
