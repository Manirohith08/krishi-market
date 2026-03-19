import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/common/Navbar';
import { adminAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const MONTHLY = [
  { month:'Aug', revenue:180000, orders:420 },
  { month:'Sep', revenue:210000, orders:510 },
  { month:'Oct', revenue:195000, orders:480 },
  { month:'Nov', revenue:260000, orders:640 },
  { month:'Dec', revenue:310000, orders:760 },
  { month:'Jan', revenue:280000, orders:690 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [s, f, o] = await Promise.all([adminAPI.getStats(), adminAPI.getPendingFarmers(), adminAPI.getOrders()]);
      setStats(s.data.stats);
      setPendingFarmers(f.data.farmers || []);
      setOrders(o.data.orders || []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const approveFarmer = async (id) => {
    try {
      await adminAPI.approveFarmer(id);
      setPendingFarmers(p => p.filter(f => f._id !== id));
      toast.success('Farmer approved!');
    } catch { toast.error('Failed to approve'); }
  };

  const kpis = [
    { label:'Total Users',    value: stats?.totalUsers,     icon:'👥', color:'blue' },
    { label:'Active Farmers', value: stats?.farmers,        icon:'👨‍🌾', color:'green' },
    { label:'Customers',      value: stats?.customers,      icon:'🛒', color:'purple' },
    { label:'Platform Revenue', value: stats?.totalRevenue ? `₹${Math.round(stats.totalRevenue/1000)}K` : '₹0', icon:'💰', color:'amber' },
    { label:'Total Products', value: stats?.totalProducts,  icon:'🌾', color:'green' },
    { label:'Total Orders',   value: stats?.totalOrders,    icon:'📦', color:'blue' },
    { label:'Pending Approval', value: stats?.pendingFarmers, icon:'⏳', color:'rose' },
  ].slice(0, 4);

  const TABS = [
    { id:'overview', label:'Overview' },
    { id:'pending',  label:`Pending (${pendingFarmers.length})` },
    { id:'orders',   label:'Orders' },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Header */}
      <div className="bg-green-950 py-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <p className="text-green-400 text-xs font-bold tracking-widest uppercase mb-2">Admin</p>
            <h1 className="font-display text-4xl font-bold text-white">Platform Analytics</h1>
            <p className="text-white/50 mt-1">Real-time marketplace overview</p>
          </div>
          {pendingFarmers.length > 0 && (
            <div className="flex items-center gap-3 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-sm font-medium px-5 py-3 rounded-xl">
              <span className="animate-pulse">⚠️</span>
              {pendingFarmers.length} farmer(s) awaiting approval
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {kpis.map(k => (
            <div key={k.label} className={`kpi-card ${k.color}`}>
              <span className="text-3xl block mb-3">{k.icon}</span>
              <div className="font-display text-4xl font-bold text-stone-900">{loading ? '—' : k.value ?? '—'}</div>
              <div className="text-sm text-stone-400 mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue chart */}
          <div className="card p-6 lg:col-span-2">
            <div className="mb-5">
              <h2 className="font-display text-lg font-bold text-stone-800">Revenue Trend</h2>
              <p className="text-stone-400 text-xs mt-0.5">Monthly platform revenue (last 6 months)</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="month" tick={{fontSize:12,fill:'#a8a29e'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:12,fill:'#a8a29e'}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`} />
                <Tooltip
                  formatter={(v) => [`₹${(v/1000).toFixed(0)}K`, 'Revenue']}
                  contentStyle={{background:'#fff',border:'1px solid #e7e5e4',borderRadius:'12px',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',fontSize:'13px'}}
                />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={{r:5,fill:'#16a34a',strokeWidth:0}} activeDot={{r:7}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-stone-800 mb-5">Sales by Category</h2>
            <div className="space-y-4">
              {[
                { label:'🥦 Vegetables', pct:42, color:'bg-green-500' },
                { label:'🍎 Fruits', pct:28, color:'bg-orange-400' },
                { label:'🥛 Dairy', pct:16, color:'bg-blue-400' },
                { label:'🌾 Grains', pct:14, color:'bg-amber-400' },
              ].map(c => (
                <div key={c.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-stone-600 font-medium">{c.label}</span>
                    <span className="text-stone-800 font-bold">{c.pct}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{width:`${c.pct}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-stone-200 pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
                tab === t.id
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label:'Total Products', value: stats?.totalProducts, icon:'🌾', bg:'bg-green-50 border-green-100' },
              { label:'Total Orders',   value: stats?.totalOrders,   icon:'📦', bg:'bg-blue-50 border-blue-100' },
              { label:'Pending Approvals', value: stats?.pendingFarmers, icon:'⏳', bg:'bg-amber-50 border-amber-100' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-8 text-center ${s.bg}`}>
                <span className="text-5xl block mb-4">{s.icon}</span>
                <div className="font-display text-5xl font-bold text-stone-900 mb-2">{loading ? '—' : s.value ?? 0}</div>
                <div className="text-sm text-stone-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Pending farmers */}
        {tab === 'pending' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
              <h2 className="font-semibold text-amber-800">Pending Farmer Approvals · {pendingFarmers.length} awaiting</h2>
            </div>
            {pendingFarmers.length === 0 ? (
              <div className="p-14 text-center">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-stone-400 font-medium">All farmers approved!</p>
              </div>
            ) : pendingFarmers.map(f => (
              <div key={f._id} className="flex items-center gap-4 px-6 py-4 border-b border-stone-50 hover:bg-stone-50 last:border-0 transition-colors">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-bold text-green-800 text-lg flex-shrink-0">
                  {f.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800">{f.name}</p>
                  <p className="text-sm text-stone-400">{f.email}</p>
                  <p className="text-xs text-stone-300 mt-0.5">Applied {new Date(f.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveFarmer(f._id)} className="btn-primary text-xs py-2 px-4 rounded-lg">✓ Approve</button>
                  <button className="btn-danger text-xs py-2 px-4 rounded-lg">✗ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-semibold text-stone-800">Recent Platform Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    {['Order ID','Customer','Farmer','Amount','Date','Status'].map(h => (
                      <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {orders.slice(0, 20).map(o => (
                    <tr key={o._id} className="hover:bg-green-50/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-stone-400">{o.orderId}</td>
                      <td className="px-6 py-4 font-medium text-stone-700">{o.customerName}</td>
                      <td className="px-6 py-4 text-stone-600">{o.farmerName}</td>
                      <td className="px-6 py-4 font-bold text-stone-900">₹{o.totalPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-stone-400 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`status-pill ${
                          o.orderStatus==='Delivered' ? 'bg-green-100 text-green-800' :
                          o.orderStatus==='Cancelled' ? 'bg-red-100 text-red-700' :
                          o.orderStatus==='Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>{o.orderStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
