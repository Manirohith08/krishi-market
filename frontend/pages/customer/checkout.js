import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/common/Navbar';
import { cartAPI, ordersAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

const SLOTS = [
  { value:'morning',   label:'Morning',   time:'7 AM – 11 AM', icon:'🌅' },
  { value:'afternoon', label:'Afternoon', time:'12 PM – 4 PM', icon:'☀️' },
  { value:'evening',   label:'Evening',   time:'5 PM – 8 PM',  icon:'🌆' },
];

export default function Checkout() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street:'', city:'', state:'', pincode:'', phone: user?.phone || '' });
  const [slot, setSlot] = useState('morning');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'customer') { router.push('/'); return; }
    cartAPI.get().then(res => {
      if (!res.data.cart?.products?.length) { router.push('/customer/cart'); return; }
      setCart(res.data.cart);
    }).finally(() => setLoading(false));
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
      toast.error('Please fill all delivery address fields'); return;
    }
    setPlacing(true);
    try {
      const res = await ordersAPI.create({ deliveryAddress: address, deliverySlot: slot, paymentMethod: 'COD' });
      toast.success('Order placed successfully! 🎉');
      router.push('/customer/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    finally { setPlacing(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50"><Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-green-600 border-t-transparent rounded-full animate-spin" style={{border:'3px solid',borderTopColor:'transparent'}} />
      </div>
    </div>
  );

  const delivery = (cart?.totalPrice || 0) >= 500 ? 0 : 40;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="bg-green-950 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-green-400 text-xs font-bold tracking-widest uppercase mb-1">Almost there!</p>
          <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
          {/* Steps indicator */}
          <div className="flex items-center gap-3 mt-5">
            {['Delivery Details','Review & Pay'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? 'bg-green-400 text-white' : step === i + 1 ? 'bg-white text-green-800' : 'bg-white/20 text-white/50'
                }`}>{step > i + 1 ? '✓' : i + 1}</div>
                <span className={`text-sm font-medium ${step === i + 1 ? 'text-white' : 'text-white/50'}`}>{s}</span>
                {i < 1 && <div className="w-8 h-px bg-white/20 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="card p-7">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">1</span>
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Street / House No.</label>
                  <input className="input" placeholder="123 MG Road, Near City Bank"
                    value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input className="input" placeholder="Mumbai"
                      value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input className="input" placeholder="Maharashtra"
                      value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Pincode</label>
                    <input className="input" placeholder="400001" maxLength={6}
                      value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" placeholder="9876543210"
                      value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery slot */}
            <div className="card p-7">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">2</span>
                Delivery Slot
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {SLOTS.map(s => (
                  <button key={s.value} type="button" onClick={() => setSlot(s.value)}
                    className={`border-2 rounded-2xl p-4 text-center transition-all ${
                      slot === s.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-stone-200 hover:border-green-300 bg-white'
                    }`}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <p className={`text-sm font-bold ${slot === s.value ? 'text-green-800' : 'text-stone-700'}`}>{s.label}</p>
                    <p className={`text-xs mt-0.5 ${slot === s.value ? 'text-green-600' : 'text-stone-400'}`}>{s.time}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="card p-7">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">3</span>
                Payment Method
              </h2>
              <div className="flex items-center gap-4 border-2 border-green-500 bg-green-50 rounded-2xl p-4">
                <span className="text-3xl">💵</span>
                <div className="flex-1">
                  <p className="font-bold text-green-900">Cash on Delivery</p>
                  <p className="text-xs text-green-700 mt-0.5">Pay when you receive your order</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">✓</div>
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24" style={{boxShadow:'var(--shadow-md)'}}>
              <h2 className="font-display text-xl font-bold text-stone-900 mb-5">Order Summary</h2>

              <div className="space-y-2.5 mb-4 pb-4 border-b border-stone-100 max-h-48 overflow-y-auto">
                {cart?.products?.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-stone-600 flex-1 truncate pr-2">{item.productName} × {item.quantity}</span>
                    <span className="font-semibold text-stone-800 flex-shrink-0">₹{(item.pricePerUnit * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm pb-4 mb-4 border-b border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span><span className="font-semibold">₹{cart?.totalPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  {delivery === 0
                    ? <span className="font-semibold text-green-600">Free</span>
                    : <span className="font-semibold">₹{delivery}</span>}
                </div>
              </div>

              <div className="flex justify-between font-bold text-stone-900 text-xl mb-6">
                <span>Total</span>
                <span className="text-green-700">₹{((cart?.totalPrice || 0) + delivery).toFixed(2)}</span>
              </div>

              <button onClick={handlePlaceOrder} disabled={placing}
                className="btn-primary w-full py-4 text-base">
                {placing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : '✅ Place Order'}
              </button>

              <p className="text-[11px] text-stone-400 text-center mt-3 leading-relaxed">
                By placing this order you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
