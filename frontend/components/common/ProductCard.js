import Link from 'next/link';
import { cartAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const UNSPLASH = {
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format',
  fruits:     'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&h=300&fit=crop&auto=format',
  dairy:      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format',
  grains:     'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format',
  herbs:      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format',
  other:      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop&auto=format',
};

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  const imageUrl = product.productImage
    ? (product.productImage.startsWith('http') ? product.productImage : `${API_URL}${product.productImage}`)
    : UNSPLASH[product.category] || UNSPLASH.vegetables;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add items to cart'); return; }
    if (user.role !== 'customer') { toast.error('Only customers can add to cart'); return; }
    setAdding(true);
    try {
      await cartAPI.add({ productId: product._id, quantity: 1 });
      toast.success(`${product.productName} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setAdding(false); }
  };

  const isLowStock = product.availableQuantity > 0 && product.availableQuantity <= 10;
  const isOutOfStock = product.availableQuantity === 0;

  return (
    <Link href={`/products/${product._id}`} className="block group">
      <div className="card card-hover h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '220px' }}>
          <img
            src={imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges top-left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.organicFlag && <span className="badge-organic">🌿 Organic</span>}
            {isLowStock && <span className="badge-hot">⚡ Low Stock</span>}
          </div>

          {/* Wishlist top-right */}
          <button
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
          >
            <span className="text-base">{wished ? '❤️' : '🤍'}</span>
          </button>

          {/* Category chip */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="bg-white/90 backdrop-blur-sm text-stone-700 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize">
              {product.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          {/* Farmer line */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px]">👨‍🌾</div>
            <span className="text-xs text-stone-400 font-medium truncate">
              {product.farmerName || 'Local Farmer'}
              {product.farmLocation && ` · ${product.farmLocation}`}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-display text-base font-semibold text-stone-900 leading-snug mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
            {product.productName}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-400 leading-relaxed mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Price + Cart */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
            <div>
              <span className="text-2xl font-bold text-green-700">₹{product.pricePerUnit}</span>
              <span className="text-xs text-stone-400 ml-1">/{product.unit || 'kg'}</span>
            </div>

            {isOutOfStock ? (
              <span className="text-xs font-semibold text-stone-400 bg-stone-100 px-3 py-2 rounded-lg">Out of Stock</span>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={{ boxShadow: '0 4px 12px rgba(21,128,61,0.25)' }}
              >
                {adding ? (
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : '🛒'}
                {adding ? 'Adding…' : 'Add'}
              </button>
            )}
          </div>

          {isLowStock && (
            <p className="text-[11px] text-earth-600 font-semibold mt-2 flex items-center gap-1">
              ⚠️ Only {product.availableQuantity} {product.unit} left!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
