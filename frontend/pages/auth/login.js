import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { authAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { token, user } = res.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'farmer') router.push('/farmer/dashboard');
      else if (user.role === 'admin') router.push('/admin/dashboard');
      else router.push('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-green-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/60 to-green-900/40" />
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl">🌾</div>
            <span className="font-display text-xl font-bold text-white">Krishi Market</span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-bold text-white leading-snug mb-4">
            "Fresh from the farm,<br /><em className="text-green-300 not-italic">direct to your door.</em>"
          </blockquote>
          <p className="text-white/60 text-sm leading-relaxed">
            Connecting India's farmers and families since 2020. Over 18,000 happy customers and 2,400 verified farms.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl">🌾</div>
              <span className="font-display text-xl font-bold text-stone-900">Krishi Market</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Sign in</h1>
            <p className="text-stone-500">Welcome back! Please enter your details.</p>
          </div>

          <div className="card p-8" style={{boxShadow:'var(--shadow-lg)'}}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" className="input" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>

              {/* Demo hint */}
             

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500 mt-6">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-green-700 font-semibold hover:underline">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
