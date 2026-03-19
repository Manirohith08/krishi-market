import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/common/Navbar';
import { productsAPI, cartAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
const FALLBACK = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&h=500&fit=crop';

export default function ProductDetail({ product, farmerProfile }) {
  const { user } = useAuth();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  if (!product) return (
    <div className="min-h-screen bg-stone-50"><Navbar />
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl text-stone-600 mb-4">Product not found</h2>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const imageUrl = product.productImage
    ? (product.productImage.startsWith('http') ? product.productImage : `${API_URL}${product.productImage}`)
    : FALLBACK;

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login'); router.push('/auth/login'); return; }
    if (user.role !== 'customer') { toast.error('Only customers can add to cart'); return; }
    setAdding(true);
    try {
      await cartAPI.add({ productId: product._id, quantity: qty });
      toast.success(`${qty} × ${product.productName} added to cart!`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add'); }
    finally { setAdding(false); }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-400 mb-8">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-stone-700 font-medium truncate max-w-xs">{product.productName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="card overflow-hidden rounded-3xl relative" style={{boxShadow:'var(--shadow-lg)'}}>
              <img src={imageUrl} alt={product.productName} className="w-full aspect-square object-cover" />
              <button
                onClick={() => setWished(!wished)}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all text-xl">
                {wished ? '❤️' : '🤍'}
              </button>
              {product.organicFlag && (
                <div className="absolute top-4 left-4">
                  <span className="badge-organic">🌿 Certified Organic</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-stone-400 text-sm font-medium capitalize mb-2">{product.category}</p>
              <h1 className="font-display text-4xl font-bold text-stone-900 leading-tight mb-3">
                {product.productName}
              </h1>
              {product.organicFlag && (
                <span className="badge-organic inline-flex">🌿 Organically Grown</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold text-green-700">₹{product.pricePerUnit}</span>
              <span className="text-stone-400 text-lg">per {product.unit || 'kg'}</span>
            </div>

            <p className="text-stone-600 leading-relaxed text-base">{product.description}</p>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['📦','Available', `${product.availableQuantity} ${product.unit || 'kg'}`],
                ['🌱','Farming', product.organicFlag ? 'Organic' : 'Conventional'],
                product.harvestDate && ['📅','Harvested', new Date(product.harvestDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})],
                product.farmLocation && ['📍','Location', product.farmLocation],
              ].filter(Boolean).map(([ic, label, val]) => (
                <div key={label} className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                  <p className="text-stone-400 text-xs font-medium mb-0.5">{ic} {label}</p>
                  <p className="font-semibold text-stone-800 text-sm">{val}</p>
                </div>
              ))}
            </div>

            {/* Farmer */}
            {farmerProfile && (
              <div className="flex items-center gap-4 bg-green-50 rounded-2xl p-4 border border-green-100">
                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">👨‍🌾</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900">{farmerProfile.farmerName || product.farmerName}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{farmerProfile.farmName} · {farmerProfile.farmLocation}</p>
                </div>
                <Link href={`/farmers/${product.farmerId?._id || product.farmerId}`}
                  className="text-sm text-green-700 font-semibold hover:text-green-800 transition-colors whitespace-nowrap">
                  View Farm →
                </Link>
              </div>
            )}

            {/* Add to cart */}
            {product.availableQuantity > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden bg-white">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-12 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-50 text-xl font-bold transition-colors">−</button>
                    <span className="w-12 text-center font-bold text-stone-900 text-lg">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.availableQuantity, qty + 1))}
                      className="w-12 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-50 text-xl font-bold transition-colors">+</button>
                  </div>
                  <button onClick={handleAddToCart} disabled={adding}
                    className="btn-primary flex-1 py-4 text-base">
                    {adding ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Adding…
                      </span>
                    ) : '🛒 Add to Cart'}
                  </button>
                </div>
                <p className="text-sm text-stone-400 text-center">
                  Total: <span className="font-bold text-green-700 text-base">₹{(product.pricePerUnit * qty).toFixed(2)}</span> for {qty} {product.unit}
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center text-red-600 font-semibold">
                ❌ Out of Stock
              </div>
            )}

            {/* Low stock warning */}
            {product.availableQuantity > 0 && product.availableQuantity <= 10 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-amber-800 text-sm font-medium flex items-center gap-2">
                ⚡ Only {product.availableQuantity} {product.unit} left — order soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API}/products/${params.id}`);
    const data = await res.json();
    if (!data.success) return { notFound: true };
    return { props: { product: data.product, farmerProfile: data.farmerProfile || null } };
  } catch { return { notFound: true }; }
}
