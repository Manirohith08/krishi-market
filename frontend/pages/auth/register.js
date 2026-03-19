import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { authAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const { role: queryRole } = router.query;
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: queryRole || 'customer', phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await authAPI.register(data);
      const { token, user } = res.data;
      login(user, token);
      toast.success(res.data.message);
      if (user.role === 'farmer') router.push('/farmer/dashboard');
      else router.push('/products');
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs) toast.error(errs[0].msg);
      else toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-green-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/65 to-green-900/40" />
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl">🌾</div>
            <span className="font-display text-xl font-bold text-white">Krishi Market</span>
          </Link>
        </div>

        {/* Benefits list */}
        <div className="relative z-10 space-y-5">
          <h2 className="font-display text-3xl font-bold text-white">Join India's largest<br /><em className="text-green-300 not-italic">farm-direct</em> marketplace</h2>
          <div className="space-y-3 mt-4">
            {[
              form.role === 'farmer'
                ? ['💰','Daily payouts, no middlemen']
                : ['🥦','Farm-fresh produce daily'],
              form.role === 'farmer'
                ? ['👥','Reach 18,000+ customers']
                : ['✅','Verified farmer produce'],
              form.role === 'farmer'
                ? ['📊','Sales analytics dashboard']
                : ['🚚','Free delivery above ₹500'],
              form.role === 'farmer'
                ? ['🌿','Support for organic certification']
                : ['🔄','Easy returns & refunds'],
            ].map(([ic, tx]) => (
              <div key={tx} className="flex items-center gap-3 text-white/80 text-sm">
                <span className="w-8 h-8 rounded-lg bg-green-700/50 flex items-center justify-center text-base flex-shrink-0">{ic}</span>
                {tx}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-stone-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl">🌾</div>
              <span className="font-display text-xl font-bold text-stone-900">Krishi Market</span>
            </Link>
          </div>

          <div className="mb-7">
            <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Create account</h1>
            <p className="text-stone-500">Start buying or selling farm-fresh produce today.</p>
          </div>

          <div className="card p-8" style={{boxShadow:'var(--shadow-lg)'}}>
            {/* Role toggle */}
            <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-6 p-1 bg-stone-50">
              {['customer','farmer'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({...form, role: r})}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg capitalize transition-all ${
                    form.role === r
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                  style={form.role === r ? {boxShadow:'0 4px 12px rgba(21,128,61,0.25)'} : {}}
                >
                  {r === 'customer' ? '🛒 Customer' : '👨‍🌾 Farmer'}
                </button>
              ))}
            </div>

            {form.role === 'farmer' && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-5 text-xs text-amber-800 flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">ℹ️</span>
                <span>Farmer accounts require admin approval before you can list products. Usually approved within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input" placeholder="Ramesh Kumar"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div>
                <label className="label">Phone <span className="text-stone-400 font-normal">(optional)</span></label>
                <input type="tel" className="input" placeholder="+91 9876543210"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Password</label>
                  <input type="password" className="input" placeholder="Min. 6 chars"
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
                </div>
                <div>
                  <label className="label">Confirm</label>
                  <input type="password" className="input" placeholder="Repeat"
                    value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : `Create ${form.role === 'farmer' ? 'Farmer' : 'Customer'} Account →`}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-green-700 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
