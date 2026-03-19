import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/common/Navbar';
import StatusBadge from '../../components/common/StatusBadge';
import { ordersAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';

const STEPS = ['Pending','Confirmed','Packed','Out for Delivery','Delivered'];

function TrackBar({ status }) {
  if (status === 'Cancelled') return (
    <div className="flex items-center gap-2 text-red-500 text-xs font-bold mt-3 bg-red-50 rounded-lg px-3 py-2">❌ Order Cancelled</div>
  );
  const idx = STEPS.indexOf(status);
  return (
    <div className="flex items-center mt-3">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i < idx ? 'bg-green-600 text-white' : i === idx ? 'bg-green-700 text-white ring-4 ring-green-100' : 'bg-stone-100 text-stone-400'
          }`}>
            {i < idx ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-0.5 ${i < idx ? 'bg-green-500' : 'bg-stone-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'customer') { router.push('/'); return; }
    ordersAPI.getCustomerOrders()
      .then(res => setOrders(res.data.orders || []))
      .finally(() => setLoading(false));
  }, [user]);

  const kpis = [
    { label:'Total Orders', value: orders.length, icon:'📦', color:'blue' },
    { label:'Delivered',    value: orders.filter(o => o.orderStatus === 'Delivered').length, icon:'✅', color:'green' },
    { label:'In Progress',  value: orders.filter(o => !['Delivered','Cancelled'].includes(o.orderStatus)).length, icon:'🚚', color:'amber' },
    { label:'Cancelled',    value: orders.filter(o => o.orderStatus === 'Cancelled').length, icon:'❌', color:'rose' },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Top header bar */}
      <div className="bg-green-950 py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div>
            <p className="text-green-400 text-xs font-bold tracking-widest uppercase mb-1">My Account</p>
            <h1 className="font-display text-3xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          </div>
          <Link href="/products" className="btn-primary text-sm py-2.5 px-5">🛒 Shop More</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map(k => (
            <div key={k.label} className={`kpi-card ${k.color}`}>
              <span className="text-3xl block mb-3">{k.icon}</span>
              <div className="font-display text-4xl font-bold text-stone-900">{loading ? '—' : k.value}</div>
              <div className="text-sm text-stone-400 mt-1 font-medium">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Orders list */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-stone-900 mb-4">Order History</h2>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-28"><div className="skeleton h-full w-full rounded-xl" /></div>)}
              </div>
            ) : orders.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="font-display text-lg text-stone-600 mb-1">No orders yet</p>
                <p className="text-stone-400 text-sm mb-5">Start shopping fresh produce!</p>
                <Link href="/products" className="btn-primary text-sm">Browse Products</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div
                    key={order._id}
                    onClick={() => setActiveOrder(order)}
                    className={`card card-hover p-4 ${activeOrder?._id === order._id ? 'ring-2 ring-green-500' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <p className="font-mono text-[11px] text-stone-400">{order.orderId}</p>
                        <p className="font-semibold text-stone-800 text-sm mt-0.5">{order.farmerName}</p>
                      </div>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    <p className="text-xs text-stone-400 mb-2">
                      {order.products?.length} item(s) · <span className="font-semibold text-stone-600">₹{order.totalPrice?.toFixed(2)}</span>
                    </p>
                    <TrackBar status={order.orderStatus} />
                    <p className="text-[11px] text-stone-300 mt-2.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order detail */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-xl font-bold text-stone-900 mb-4">Order Details</h2>

            {activeOrder ? (
              <div className="card p-7" style={{boxShadow:'var(--shadow-md)'}}>
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="font-mono text-xs text-stone-400 mb-1">{activeOrder.orderId}</p>
                    <h3 className="font-display text-xl font-bold text-stone-900">{activeOrder.farmerName}</h3>
                  </div>
                  <StatusBadge status={activeOrder.orderStatus} />
                </div>

                {/* Items */}
                <div className="space-y-2.5 mb-5">
                  {activeOrder.products?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                      <div>
                        <p className="font-medium text-stone-800 text-sm">{item.productName}</p>
                        <p className="text-stone-400 text-xs mt-0.5">{item.quantity} × ₹{item.pricePerUnit}/{item.unit}</p>
                      </div>
                      <p className="font-bold text-stone-900">₹{item.subtotal?.toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-base pt-2">
                    <span className="text-stone-600">Total Amount</span>
                    <span className="text-green-700 text-xl">₹{activeOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-stone-50 rounded-xl p-4 text-sm mb-5 border border-stone-100">
                  <p className="font-semibold text-stone-700 mb-2">📍 Delivery Address</p>
                  <p className="text-stone-500">{activeOrder.deliveryAddress?.street}</p>
                  <p className="text-stone-500">{activeOrder.deliveryAddress?.city}, {activeOrder.deliveryAddress?.state} – {activeOrder.deliveryAddress?.pincode}</p>
                  <p className="text-stone-400 mt-1.5 text-xs">📞 {activeOrder.deliveryAddress?.phone}</p>
                </div>

                {/* Full tracker */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-4">
                  <p className="text-xs font-bold text-green-800 mb-3 uppercase tracking-wide">Delivery Progress</p>
                  <TrackBar status={activeOrder.orderStatus} />
                  <div className="flex justify-between mt-2">
                    {STEPS.map(s => <span key={s} className="text-[9px] text-stone-400 text-center w-1/5">{s}</span>)}
                  </div>
                </div>

                {/* Timeline */}
                {activeOrder.statusHistory?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Status Timeline</p>
                    <div className="space-y-2">
                      {[...activeOrder.statusHistory].reverse().map((h, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-stone-500">
                          <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                          <span className="font-semibold text-stone-700">{h.status}</span>
                          <span className="text-stone-300">·</span>
                          <span>{new Date(h.updatedAt).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-14 text-center h-64 flex flex-col items-center justify-center">
                <p className="text-5xl mb-3">👈</p>
                <p className="text-stone-400 text-sm font-medium">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
