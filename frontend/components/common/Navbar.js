import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { useState, useEffect } from 'react';
import { cartAPI } from '../../lib/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user?.role === 'customer') {
      cartAPI.get().then(r => setCartCount(r.data.cart?.products?.length || 0)).catch(() => {});
    }
  }, [user]);

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-green-950/95 backdrop-blur-xl shadow-xl'
        : 'bg-green-950'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-green group-hover:scale-105 transition-transform">
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-white tracking-tight">Krishi</span>
              <span className="font-display text-xl font-bold text-green-400 tracking-tight"> Market</span>
            </div>
          </Link>

          {/* Centre nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/products" className="px-4 py-2 rounded-lg text-sm font-medium text-green-100/80 hover:text-white hover:bg-white/10 transition-all">
              Browse Products
            </Link>
            {user?.role === 'farmer' && <>
              <Link href="/farmer/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-green-100/80 hover:text-white hover:bg-white/10 transition-all">Dashboard</Link>
              <Link href="/farmer/products" className="px-4 py-2 rounded-lg text-sm font-medium text-green-100/80 hover:text-white hover:bg-white/10 transition-all">My Products</Link>
              <Link href="/farmer/orders" className="px-4 py-2 rounded-lg text-sm font-medium text-green-100/80 hover:text-white hover:bg-white/10 transition-all">Orders</Link>
            </>}
            {user?.role === 'admin' && <>
              <Link href="/admin/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-green-100/80 hover:text-white hover:bg-white/10 transition-all">Admin Panel</Link>
            </>}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-green-100/80 hover:text-white transition-colors">Sign In</Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2.5 px-5">Get Started</Link>
              </>
            ) : (
              <>
                {user.role === 'customer' && (
                  <Link href="/customer/cart" className="relative w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg transition-all group">
                    🛒
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-earth-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-green-950">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-white font-medium max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="text-sm text-green-200/70 hover:text-white transition-colors font-medium">
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-all">
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1 animate-fade-in">
            <Link href="/products" className="block px-4 py-2.5 text-sm text-green-100/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Browse Products</Link>
            {user ? (
              <>
                {user.role === 'customer' && <>
                  <Link href="/customer/cart" className="block px-4 py-2.5 text-sm text-green-100/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Cart {cartCount > 0 && `(${cartCount})`}</Link>
                  <Link href="/customer/dashboard" className="block px-4 py-2.5 text-sm text-green-100/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">My Orders</Link>
                </>}
                {user.role === 'farmer' && <>
                  <Link href="/farmer/dashboard" className="block px-4 py-2.5 text-sm text-green-100/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Dashboard</Link>
                  <Link href="/farmer/products" className="block px-4 py-2.5 text-sm text-green-100/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">My Products</Link>
                </>}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 rounded-lg transition-all">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2.5 text-sm text-green-100/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Sign In</Link>
                <Link href="/auth/register" className="block mx-2 text-center btn-primary text-sm py-2.5">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
