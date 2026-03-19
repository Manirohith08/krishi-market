import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/common/Navbar';
import { cartAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function Cart() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'customer') { router.push('/'); return; }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();
      setCart(res.data.cart);
    } catch { toast.error('Failed to load cart'); }
    finally { setLoading(false); }
  };

  const updateQty = async (productId, quantity) => {
    setUpdating(productId);
    try {
      const res = await cartAPI.update({ productId, quantity });
      setCart(res.data.cart);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setUpdating(null); }
  };

  const removeItem = async (productId) => {
    setUpdating(productId);
    try {
      const res = await cartAPI.remove({ productId });
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch { toast.error('Failed to remove'); }
    finally { setUpdating(null); }
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" style={{borderWidth:'3px'}} />
      </div>
    </div>
  );

  const items = cart?.products || [];
  const delivery = cart?.totalPrice >= 500 ? 0 : 40;
  const grandTotal = (cart?.totalPrice || 0) + delivery;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="bg-green-950 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-green-400 text-xs font-bold tracking-widest uppercase mb-1">Shopping</p>
          <h1 className="font-display text-3xl font-bold text-white">My Cart
            {items.length > 0 && <span className="text-green-400 ml-3 text-2xl">({items.length} items)</span>}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="card p-20 text-center" style={{boxShadow:'var(--shadow-md)'}}>
            <div className="w-24 h-24 rounded-3xl bg-green-50 flex items-center justify-center text-5xl mx-auto mb-6">🛒</div>
            <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">Your cart is empty</h2>
            <p className="text-stone-400 mb-7">Discover fresh produce from local farmers</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => {
                const imgUrl = item.productImage
                  ? (item.productImage.startsWith('http') ? item.productImage : `${API_URL}${item.productImage}`)
                  : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&h=120&fit=crop';
                const isUpdating = updating === item.productId;
                return (
                  <div key={item.productId} className={`card p-5 flex items-center gap-4 transition-all ${isUpdating ? 'opacity-60' : ''}`}>
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-green-50 flex-shrink-0">
                      <img src={imgUrl} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-900 truncate">{item.productName}</h3>
                      <p className="text-xs text-stone-400 mt-0.5">by {item.farmerName}</p>
                      <p className="text-green-700 font-bold mt-1">₹{item.pricePerUnit}<span className="text-stone-400 font-normal text-xs">/{item.unit || 'kg'}</span></p>
                    </div>
                    {/* Qty controls */}
                    <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
                      <button onClick={() => updateQty(item.productId, item.quantity - 1)} disabled={isUpdating || item.quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 text-lg font-bold disabled:opacity-30 transition-colors">−</button>
                      <span className="w-10 text-center font-bold text-stone-900">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.quantity + 1)} disabled={isUpdating}
                        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 text-lg font-bold disabled:opacity-30 transition-colors">+</button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="font-bold text-stone-900 text-lg">₹{(item.pricePerUnit * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeItem(item.productId)} disabled={isUpdating}
                        className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors font-medium">Remove</button>
                    </div>
                  </div>
                );
              })}

              {/* Continue shopping */}
              <Link href="/products" className="flex items-center gap-2 text-sm text-green-700 font-semibold hover:text-green-800 transition-colors mt-2">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24" style={{boxShadow:'var(--shadow-md)'}}>
                <h2 className="font-display text-xl font-bold text-stone-900 mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm text-stone-600 pb-4 mb-4 border-b border-stone-100">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-stone-800">₹{cart?.totalPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    {delivery === 0
                      ? <span className="text-green-600 font-semibold">Free 🎉</span>
                      : <span className="font-semibold text-stone-800">₹{delivery}</span>}
                  </div>
                  {delivery > 0 && (
                    <div className="bg-green-50 rounded-lg p-2.5 text-xs text-green-700 border border-green-100">
                      Add ₹{(500 - cart?.totalPrice).toFixed(0)} more for free delivery!
                    </div>
                  )}
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-lg mb-6">
                  <span>Total</span>
                  <span className="text-green-700">₹{grandTotal.toFixed(2)}</span>
                </div>
                <Link href="/customer/checkout" className="btn-primary w-full text-center block py-3.5">
                  Proceed to Checkout →
                </Link>
                <p className="text-center text-xs text-stone-400 mt-4">
                  🔒 Secure checkout · Cash on Delivery available
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
