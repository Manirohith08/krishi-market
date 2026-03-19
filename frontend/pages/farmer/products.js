import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import { productsAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
const FALLBACK_IMGS = {
  vegetables:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
  fruits:'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=300&h=200&fit=crop',
  dairy:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop',
  grains:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
  herbs:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
  other:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=300&h=200&fit=crop',
};

export default function FarmerProducts() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'farmer') { router.push('/'); return; }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getMyProducts();
      setProducts(res.data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    setDeleting(id);
    try {
      await productsAPI.delete(id);
      setProducts(p => p.filter(x => x._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (product) => {
    try {
      const fd = new FormData();
      fd.append('isActive', String(!product.isActive));
      await productsAPI.update(product._id, fd);
      setProducts(p => p.map(x => x._id === product._id ? {...x, isActive: !x.isActive} : x));
      toast.success(product.isActive ? 'Product hidden from store' : 'Product now visible');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="flex min-h-screen">
      <FarmerSidebar />
      <main className="flex-1 bg-stone-50 overflow-auto">
        <div className="bg-white border-b border-stone-100 px-8 py-5 flex items-center justify-between sticky top-0 z-30" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">My Products</h1>
            <p className="text-stone-400 text-sm mt-0.5">{products.length} products listed</p>
          </div>
          <Link href="/farmer/add-product" className="btn-primary text-sm py-2.5 px-5">+ Add Product</Link>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => <div key={i} className="card h-64 skeleton" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="card p-20 text-center" style={{boxShadow:'var(--shadow-md)'}}>
              <div className="w-24 h-24 rounded-3xl bg-green-50 flex items-center justify-center text-5xl mx-auto mb-6">🌾</div>
              <h2 className="font-display text-2xl font-bold text-stone-700 mb-2">No products yet</h2>
              <p className="text-stone-400 mb-7">Start listing your fresh farm produce!</p>
              <Link href="/farmer/add-product" className="btn-primary">Add Your First Product</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(product => {
                const imgUrl = product.productImage
                  ? (product.productImage.startsWith('http') ? product.productImage : `${API_URL}${product.productImage}`)
                  : FALLBACK_IMGS[product.category] || FALLBACK_IMGS.other;

                return (
                  <div key={product._id} className={`card overflow-hidden transition-all ${!product.isActive ? 'opacity-60' : ''}`}>
                    <div className="relative h-40 overflow-hidden">
                      <img src={imgUrl} alt={product.productName} className="w-full h-full object-cover" />
                      {product.organicFlag && (
                        <span className="absolute top-2 left-2 badge-organic text-[11px]">🌿 Organic</span>
                      )}
                      {!product.isActive && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full">Hidden</span>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-stone-600 text-[11px] font-semibold px-2 py-1 rounded-full capitalize">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-stone-900 text-base truncate mb-1">{product.productName}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xl font-bold text-green-700">₹{product.pricePerUnit}</span>
                          <span className="text-xs text-stone-400 ml-1">/{product.unit || 'kg'}</span>
                        </div>
                        <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">
                          Stock: {product.availableQuantity}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Link href={`/farmer/edit-product/${product._id}`}
                          className="flex items-center justify-center gap-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 rounded-xl transition-colors font-semibold">
                          ✏️ Edit
                        </Link>
                        <button onClick={() => toggleActive(product)}
                          className="flex items-center justify-center gap-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 py-2 rounded-xl transition-colors font-semibold">
                          {product.isActive ? '🙈 Hide' : '👁 Show'}
                        </button>
                        <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id}
                          className="flex items-center justify-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl transition-colors font-semibold disabled:opacity-50">
                          {deleting === product._id ? '...' : '🗑 Del'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
