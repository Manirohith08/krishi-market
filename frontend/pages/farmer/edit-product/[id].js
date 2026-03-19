import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FarmerSidebar from '../../../components/farmer/FarmerSidebar';
import { productsAPI } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function EditProduct() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    productsAPI.getById(id).then(res => {
      const p = res.data.product;
      setForm({
        productName: p.productName,
        description: p.description,
        category: p.category,
        pricePerUnit: p.pricePerUnit,
        unit: p.unit || 'kg',
        availableQuantity: p.availableQuantity,
        harvestDate: p.harvestDate ? p.harvestDate.slice(0, 10) : '',
        organicFlag: p.organicFlag
      });
      if (p.productImage) {
        setPreview(p.productImage.startsWith('http') ? p.productImage : `${API_URL}${p.productImage}`);
      }
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('productImage', image);
      await productsAPI.update(id, formData);
      toast.success('Product updated!');
      router.push('/farmer/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return (
    <div className="flex min-h-screen bg-gray-50">
      <FarmerSidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin text-4xl">🌾</div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FarmerSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            <div onClick={() => document.getElementById('editImg').click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-forest-400 transition-all">
              {preview ? <img src={preview} className="h-36 mx-auto rounded-lg object-cover" alt="Preview" /> : <div className="text-gray-400 py-4">📸 Click to change image</div>}
              <input id="editImg" type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files[0]) { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }}} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Product Name</label><input className="input" value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} required /></div>
              <div><label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {['vegetables','fruits','dairy','grains','herbs','other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div><label className="label">Description</label><textarea className="input h-20 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>

            <div className="grid grid-cols-3 gap-4">
              <div><label className="label">Price (₹)</label><input className="input" type="number" min="0" step="0.01" value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit: e.target.value})} required /></div>
              <div><label className="label">Unit</label>
                <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                  {['kg','g','litre','piece','dozen','quintal','bunch'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div><label className="label">Quantity</label><input className="input" type="number" min="0" value={form.availableQuantity} onChange={e => setForm({...form, availableQuantity: e.target.value})} required /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Harvest Date</label><input className="input" type="date" value={form.harvestDate} onChange={e => setForm({...form, harvestDate: e.target.value})} /></div>
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.organicFlag} onChange={e => setForm({...form, organicFlag: e.target.checked})} className="w-5 h-5 accent-forest-600" />
                  <span className="text-sm font-medium">🌿 Organic</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">{saving ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" onClick={() => router.back()} className="btn-secondary px-6">Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
