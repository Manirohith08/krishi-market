import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import ProductCard from '../../components/common/ProductCard';
import { productsAPI } from '../../lib/api';
import { useRouter } from 'next/router';

const CATS = [
  { slug:'all',        label:'All Products', emoji:'🌟' },
  { slug:'vegetables', label:'Vegetables',   emoji:'🥦' },
  { slug:'fruits',     label:'Fruits',       emoji:'🍎' },
  { slug:'dairy',      label:'Dairy',        emoji:'🥛' },
  { slug:'grains',     label:'Grains',       emoji:'🌾' },
  { slug:'herbs',      label:'Herbs',        emoji:'🌿' },
  { slug:'other',      label:'Other',        emoji:'🛒' },
];

const DEMO_PRODUCTS = [
  { _id:'d1', productName:'Farm Fresh Tomatoes', description:'Vine-ripened, zero chemicals.', category:'vegetables', pricePerUnit:38, unit:'kg', organicFlag:true, farmerName:'Ramesh Kumar', farmLocation:'Nashik', availableQuantity:50, productImage:'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=300&fit=crop' },
  { _id:'d2', productName:'Alphonso Mangoes', description:'GI-tagged Ratnagiri Alphonso.', category:'fruits', pricePerUnit:280, unit:'dozen', organicFlag:false, farmerName:'Patel Orchards', farmLocation:'Ratnagiri', availableQuantity:30, productImage:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop' },
  { _id:'d3', productName:'Baby Spinach', description:'Tender baby spinach, packed fresh.', category:'vegetables', pricePerUnit:45, unit:'bunch', organicFlag:true, farmerName:'Green Leaf Farm', farmLocation:'Pune', availableQuantity:8, productImage:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
  { _id:'d4', productName:'A2 Desi Cow Milk', description:'Bilona method A2 milk from Gir cows.', category:'dairy', pricePerUnit:72, unit:'litre', organicFlag:true, farmerName:'Sahyadri Dairy', farmLocation:'Kolhapur', availableQuantity:20, productImage:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
  { _id:'d5', productName:'Himalayan Pink Potatoes', description:'Mountain-grown, naturally sweet.', category:'vegetables', pricePerUnit:28, unit:'kg', organicFlag:false, farmerName:'Singh Farms', farmLocation:'Agra', availableQuantity:100, productImage:'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=300&fit=crop' },
  { _id:'d6', productName:'Nashik Red Onions', description:'Pungent and full-flavoured onions.', category:'vegetables', pricePerUnit:22, unit:'kg', organicFlag:false, farmerName:'Satara Co-op', farmLocation:'Maharashtra', availableQuantity:200, productImage:'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop' },
  { _id:'d7', productName:'Ooty Carrots', description:'Sweet Ooty hill carrots, seasonal.', category:'vegetables', pricePerUnit:48, unit:'kg', organicFlag:true, farmerName:'Ooty Hill Farms', farmLocation:'Tamil Nadu', availableQuantity:40, productImage:'https://images.unsplash.com/photo-1439127989242-c3749a012eac?w=400&h=300&fit=crop' },
  { _id:'d8', productName:'Khapli Wheat (Emmer)', description:'Ancient grain, naturally diabetic-friendly.', category:'grains', pricePerUnit:95, unit:'kg', organicFlag:true, farmerName:'Punjab Kisan', farmLocation:'Punjab', availableQuantity:60, productImage:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
];

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category: router.query.category || 'all',
    search: '', organic: false, page: 1
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => { fetchProducts(); }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page, limit: 12,
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.organic && { organic: true }),
      };
      const res = await productsAPI.getAll(params);
      setProducts(res.data.products?.length ? res.data.products : DEMO_PRODUCTS);
      setPagination(res.data.pagination || { total: DEMO_PRODUCTS.length, pages: 1 });
    } catch {
      setProducts(DEMO_PRODUCTS);
      setPagination({ total: DEMO_PRODUCTS.length, pages: 1 });
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: searchInput, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Header */}
      <div className="bg-green-950 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-green-400 text-xs font-bold tracking-widest uppercase mb-3">Fresh Produce</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-2">
            All Products
          </h1>
          <p className="text-white/50 text-base">{pagination.total || 0} products from verified farmers</p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl">
            <div className="flex gap-0 bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="flex items-center pl-5 text-stone-400 text-lg flex-shrink-0">🔍</div>
              <input
                type="text"
                className="flex-1 px-4 py-4 text-base text-stone-800 placeholder:text-stone-400 outline-none bg-transparent"
                placeholder="Search tomatoes, mangoes, A2 milk…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button type="submit" className="m-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 pb-20">
        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8 bg-white rounded-2xl p-3 shadow-sm border border-stone-100 overflow-x-auto">
          {CATS.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setFilters(f => ({ ...f, category: cat.slug, page: 1 }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                filters.category === cat.slug
                  ? 'bg-green-700 text-white shadow-green'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
              style={filters.category === cat.slug ? {boxShadow:'0 4px 12px rgba(21,128,61,0.30)'} : {}}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}

          <label className="ml-auto flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all text-sm text-stone-600 whitespace-nowrap">
            <input
              type="checkbox"
              checked={filters.organic}
              onChange={e => setFilters(f => ({ ...f, organic: e.target.checked, page: 1 }))}
              className="w-4 h-4 accent-green-600 rounded"
            />
            🌿 Organic only
          </label>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-500 text-sm">
            Showing <span className="font-semibold text-stone-800">{products.length}</span> products
            {filters.category !== 'all' && <span> in <span className="text-green-700 font-semibold capitalize">{filters.category}</span></span>}
          </p>
          <select className="text-sm border border-stone-200 rounded-xl px-4 py-2 text-stone-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="skeleton h-56 rounded-none" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-5 w-4/5" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="skeleton h-7 w-20" />
                    <div className="skeleton h-10 w-20 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {[...Array(pagination.pages)].map((_,i) => (
                  <button
                    key={i}
                    onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                    className={`w-11 h-11 rounded-xl text-sm font-semibold transition-all ${
                      filters.page === i+1
                        ? 'bg-green-700 text-white shadow-green'
                        : 'bg-white border border-stone-200 text-stone-600 hover:border-green-400'
                    }`}
                    style={filters.page === i+1 ? {boxShadow:'0 4px 12px rgba(21,128,61,0.30)'} : {}}
                  >
                    {i+1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-28">
            <div className="w-24 h-24 rounded-3xl bg-stone-100 flex items-center justify-center text-5xl mx-auto mb-5">🔍</div>
            <h3 className="font-display text-2xl text-stone-600 mb-2">No products found</h3>
            <p className="text-stone-400">Try a different category or search term</p>
            <button onClick={() => { setFilters({ category:'all', search:'', organic:false, page:1 }); setSearchInput(''); }} className="btn-primary mt-6">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
