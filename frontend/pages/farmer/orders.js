import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import { ordersAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  'Pending':          'bg-amber-100 text-amber-800',
  'Confirmed':        'bg-blue-100 text-blue-800',
  'Packed':           'bg-indigo-100 text-indigo-800',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  'Delivered':        'bg-green-100 text-green-800',
  'Cancelled':        'bg-red-100 text-red-700',
};
const NEXT_STATUS = {
  'Pending': 'Confirmed', 'Confirmed': 'Packed',
  'Packed': 'Out for Delivery', 'Out for Delivery': 'Delivered',
};

export default function FarmerOrders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'farmer') { router.push('/'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getFarmerOrders();
      setOrders(res.data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      await ordersAPI.updateStatus({ orderId, status });
      await fetchOrders();
      const updated = (await ordersAPI.getFarmerOrders()).data.orders.find(o => o._id === orderId);
      setSelected(updated || null);
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(false); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);
  const STATUS_FILTERS = ['all','Pending','Confirmed','Packed','Out for Delivery','Delivered','Cancelled'];

  return (
    <div className="flex min-h-screen">
      <FarmerSidebar />
      <main className="flex-1 bg-stone-50 overflow-auto">
        <div className="bg-white border-b border-stone-100 px-8 py-5 flex items-center justify-between sticky top-0 z-30" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">Manage Orders</h1>
            <p className="text-stone-400 text-sm mt-0.5">{orders.length} total · {orders.filter(o=>o.orderStatus==='Pending').length} pending</p>
          </div>
        </div>

        <div className="p-8">
          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {STATUS_FILTERS.map(s => {
              const count = s === 'all' ? orders.length : orders.filter(o => o.orderStatus === s).length;
              return (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === s ? 'bg-green-700 text-white shadow-green' : 'bg-white border border-stone-200 text-stone-600 hover:border-green-300'
                  }`}
                  style={filter===s?{boxShadow:'0 4px 12px rgba(21,128,61,0.25)'}:{}}>
                  {s === 'all' ? 'All' : s} ({count})
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="card h-28 skeleton" />)
              ) : filtered.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="text-stone-400 font-medium">No orders here</p>
                </div>
              ) : filtered.map(order => (
                <div key={order._id} onClick={() => setSelected(order)}
                  className={`card card-hover p-4 ${selected?._id === order._id ? 'ring-2 ring-green-500' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-mono text-[11px] text-stone-400">{order.orderId}</p>
                    <span className={`status-pill text-[11px] ${STATUS_STYLES[order.orderStatus] || 'bg-stone-100 text-stone-600'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="font-bold text-stone-800 text-sm">{order.customerName}</p>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-stone-400">
                    <span>{order.products?.length} item(s)</span>
                    <span className="font-bold text-stone-700">₹{order.totalPrice?.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-stone-300 mt-1.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                  </p>
                </div>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-3">
              {selected ? (
                <div className="card p-7" style={{boxShadow:'var(--shadow-md)'}}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="font-mono text-xs text-stone-400 mb-1">{selected.orderId}</p>
                      <h2 className="font-display text-xl font-bold text-stone-900">{selected.customerName}</h2>
                    </div>
                    <span className={`status-pill text-sm ${STATUS_STYLES[selected.orderStatus] || 'bg-stone-100 text-stone-600'}`}>
                      {selected.orderStatus}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2.5 mb-5 pb-5 border-b border-stone-100">
                    {selected.products?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-stone-800">{item.productName}</p>
                          <p className="text-stone-400 text-xs">{item.quantity} {item.unit} × ₹{item.pricePerUnit}</p>
                        </div>
                        <p className="font-bold text-stone-900">₹{item.subtotal?.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-stone-100">
                      <span>Total</span>
                      <span className="text-green-700">₹{selected.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-stone-50 rounded-xl p-4 text-sm mb-5 border border-stone-100">
                    <p className="font-bold text-stone-700 mb-2">📍 Delivery Address</p>
                    <p className="text-stone-500">{selected.deliveryAddress?.street}</p>
                    <p className="text-stone-500">{selected.deliveryAddress?.city}, {selected.deliveryAddress?.state} – {selected.deliveryAddress?.pincode}</p>
                    <p className="text-stone-400 text-xs mt-1.5">📞 {selected.deliveryAddress?.phone}</p>
                    <p className="text-stone-400 text-xs capitalize mt-0.5">⏰ Slot: {selected.deliverySlot}</p>
                  </div>

                  {/* Actions */}
                  {NEXT_STATUS[selected.orderStatus] && (
                    <button onClick={() => updateStatus(selected._id, NEXT_STATUS[selected.orderStatus])}
                      disabled={updating}
                      className="btn-primary w-full py-3.5 mb-3">
                      {updating ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Updating…
                        </span>
                      ) : `Mark as ${NEXT_STATUS[selected.orderStatus]} →`}
                    </button>
                  )}
                  {selected.orderStatus === 'Pending' && (
                    <button onClick={() => updateStatus(selected._id, 'Cancelled')} disabled={updating}
                      className="btn-danger w-full py-2.5 text-sm">
                      Cancel Order
                    </button>
                  )}
                  {selected.orderStatus === 'Delivered' && (
                    <div className="text-center py-3 text-green-600 font-semibold text-sm bg-green-50 rounded-xl border border-green-100">
                      🎉 Order completed successfully
                    </div>
                  )}
                </div>
              ) : (
                <div className="card p-14 text-center flex flex-col items-center justify-center" style={{minHeight:'300px'}}>
                  <p className="text-5xl mb-3">👈</p>
                  <p className="text-stone-400 font-medium">Select an order to manage it</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
