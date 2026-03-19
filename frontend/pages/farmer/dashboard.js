import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import { ordersAPI, productsAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const QUICK_ACTIONS = [
  { href:'/farmer/add-product', icon:'➕', label:'Add Product', desc:'List new produce' },
  { href:'/farmer/orders',      icon:'📦', label:'View Orders', desc:'Manage incoming' },
  { href:'/farmer/products',    icon:'🌾', label:'My Products', desc:'Edit listings' },
  { href:'/farmer/profile',     icon:'🏡', label:'Farm Profile', desc:'Update info' },
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'farmer') { router.push('/'); return; }
    if (!user.isApproved) return;

    Promise.all([
      ordersAPI.getFarmerStats(),
      ordersAPI.getFarmerOrders(),
      productsAPI.getMyProducts()
    ]).then(([s, o, p]) => {
      setStats(s.data.stats);
      setRecentOrders((o.data.orders || []).slice(0, 5));
      setProducts(p.data.products || []);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  if (!user.isApproved) return (
    <div className="flex min-h-screen">
      <FarmerSidebar />
      <main className="flex-1 flex items-center justify-center bg-stone-50 p-8">
        <div className="card p-12 text-center max-w-md" style={{boxShadow:'var(--shadow-lg)'}}>
          <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center text-4xl mx-auto mb-6">⏳</div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">Awaiting Approval</h2>
          <p className="text-stone-500 mb-6 text-sm leading-relaxed">Your farmer account is under review. An admin will approve it shortly — usually within 24 hours.</p>
          <Link href="/" className="btn-secondary text-sm">Back to Home</Link>
        </div>
      </main>
    </div>
  );

  const chartData = [
    { name:'Pending',   value: stats?.pending || 0 },
    { name:'Confirmed', value: stats?.confirmed || 0 },
    { name:'Delivered', value: stats?.delivered || 0 },
    { name:'Cancelled', value: stats?.cancelled || 0 },
  ];

  const kpis = [
    { label:'Total Orders',  value: stats?.total || 0,                       icon:'📦', color:'blue' },
    { label:'Revenue',       value: `₹${(stats?.revenue || 0).toFixed(0)}`,  icon:'💰', color:'green' },
    { label:'Pending',       value: stats?.pending || 0,                      icon:'⏳', color:'amber' },
    { label:'Products Live', value: products.length,                          icon:'🌾', color:'purple' },
  ];

  return (
    <div className="flex min-h-screen">
      <FarmerSidebar />
      <main className="flex-1 bg-stone-50 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-stone-100 px-8 py-5 flex items-center justify-between sticky top-0 z-30" style={{boxShadow:'var(--shadow-xs)'}}>
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">Farm Dashboard</h1>
            <p className="text-stone-400 text-sm mt-0.5">Welcome back, {user.name}!</p>
          </div>
          <Link href="/farmer/add-product" className="btn-primary text-sm py-2.5 px-5">+ Add Product</Link>
        </div>

        <div className="p-8 max-w-5xl">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {kpis.map(k => (
              <div key={k.label} className={`kpi-card ${k.color}`}>
                <span className="text-3xl block mb-3">{k.icon}</span>
                <div className="font-display text-4xl font-bold text-stone-900">{loading ? '—' : k.value}</div>
                <div className="text-sm text-stone-400 mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart */}
            <div className="card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-bold text-stone-800">Order Overview</h2>
                  <p className="text-stone-400 text-xs mt-0.5">Order status breakdown</p>
                </div>
              </div>
              {loading ? (
                <div className="h-52 skeleton rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill:'#a8a29e' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill:'#a8a29e' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background:'#fff', border:'1px solid #e7e5e4', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', fontSize:'13px' }}
                      cursor={{ fill:'#f0fdf4' }}
                    />
                    <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Quick actions */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-stone-800 mb-5">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map(a => (
                  <Link key={a.href} href={a.href}>
                    <div className="group p-4 rounded-xl border-2 border-dashed border-stone-200 hover:border-green-400 hover:bg-green-50 transition-all text-center cursor-pointer">
                      <span className="text-3xl block mb-2">{a.icon}</span>
                      <p className="text-xs font-bold text-stone-700 group-hover:text-green-700">{a.label}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{a.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent orders table */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="font-display text-lg font-bold text-stone-800">Recent Orders</h2>
              <Link href="/farmer/orders" className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors">View All →</Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
            ) : recentOrders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-stone-400 font-medium">No orders yet</p>
                <p className="text-stone-300 text-sm mt-1">Add products so customers can place orders!</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    {['Order ID','Customer','Amount','Date','Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {recentOrders.map(order => (
                    <tr key={order._id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-stone-400">{order.orderId}</td>
                      <td className="px-6 py-4 font-semibold text-stone-800">{order.customerName}</td>
                      <td className="px-6 py-4 font-bold text-stone-900">₹{order.totalPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-stone-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`status-pill text-xs font-bold px-3 py-1 rounded-full ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          order.orderStatus === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>{order.orderStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
