import { useState } from 'react';
import { useRouter } from 'next/router';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import { productsAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    productName: '', description: '', category: 'vegetables',
    pricePerUnit: '', unit: 'kg', availableQuantity: '',
    harvestDate: '', organicFlag: false
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('productImage', image);
      await productsAPI.create(fd);
      toast.success('Product added successfully!');
      router.push('/farmer/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add product'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen">
      <FarmerSidebar />
      <main className="flex-1 bg-stone-50 overflow-auto">
        <div className="bg-white border-b border-stone-100 px-8 py-5 sticky top-0 z-30" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
          <h1 className="font-display text-2xl font-bold text-stone-900">Add New Product</h1>
          <p className="text-stone-400 text-sm mt-0.5">List your fresh produce for customers</p>
        </div>

        <div className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Product Image</h2>
              <div
                onClick={() => document.getElementById('imgInput').click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  preview ? 'border-green-300 bg-green-50' : 'border-stone-200 hover:border-green-300 hover:bg-green-50'
                }`}>
                {preview ? (
                  <img src={preview} className="h-48 mx-auto rounded-xl object-cover" alt="Preview" />
                ) : (
                  <div>
                    <div className="text-5xl mb-3">📸</div>
                    <p className="font-semibold text-stone-600">Click to upload image</p>
                    <p className="text-sm text-stone-400 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                )}
                <input id="imgInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </div>
              {preview && (
                <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                  className="mt-3 text-xs text-red-500 hover:text-red-600 font-medium">Remove image</button>
              )}
            </div>

            {/* Details */}
            <div className="card p-6 space-y-5">
              <h2 className="font-display text-lg font-bold text-stone-800">Product Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Product Name *</label>
                  <input className="input" placeholder="e.g. Fresh Tomatoes"
                    value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {['vegetables','fruits','dairy','grains','herbs','other'].map(c => (
                      <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea className="input resize-none" rows={3} placeholder="Describe your product — how it was grown, freshness, special qualities…"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input className="input" type="number" min="0" step="0.01" placeholder="25.00"
                    value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Unit</label>
                  <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                    {['kg','g','litre','piece','dozen','quintal','bunch'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Available Qty *</label>
                  <input className="input" type="number" min="0" placeholder="100"
                    value={form.availableQuantity} onChange={e => setForm({...form, availableQuantity: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Harvest Date</label>
                  <input className="input" type="date" value={form.harvestDate}
                    onChange={e => setForm({...form, harvestDate: e.target.value})} />
                </div>
                <div className="flex items-center mt-7">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={form.organicFlag}
                        onChange={e => setForm({...form, organicFlag: e.target.checked})} />
                      <div className={`w-12 h-6 rounded-full transition-colors ${form.organicFlag ? 'bg-green-600' : 'bg-stone-300'}`} />
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.organicFlag ? 'translate-x-6' : ''}`} />
                    </div>
                    <span className="text-sm font-semibold text-stone-700 group-hover:text-green-700 transition-colors">
                      🌿 Organic Product
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-4 text-base">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Adding Product…
                  </span>
                ) : '✅ Add Product'}
              </button>
              <button type="button" onClick={() => router.back()} className="btn-secondary px-7">Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
