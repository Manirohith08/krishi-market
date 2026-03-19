import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import { farmersAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

export default function FarmerProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    farmerName: '', farmName: '', farmLocation: '',
    cropTypes: '', farmingMethod: 'conventional',
    bio: '', yearsOfExperience: ''
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'farmer') { router.push('/'); return; }
    farmersAPI.getMyProfile().then(res => {
      const p = res.data.profile;
      if (p) {
        setProfile(p);
        setForm({
          farmerName: p.farmerName || user.name,
          farmName: p.farmName || '',
          farmLocation: p.farmLocation || '',
          cropTypes: p.cropTypes?.join(', ') || '',
          farmingMethod: p.farmingMethod || 'conventional',
          bio: p.bio || '',
          yearsOfExperience: p.yearsOfExperience || ''
        });
      } else {
        setForm(f => ({ ...f, farmerName: user.name }));
      }
    }).finally(() => setLoading(false));
  }, [user]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('profilePhoto', photo);
      if (profile) await farmersAPI.updateProfile(fd);
      else await farmersAPI.createProfile(fd);
      toast.success(profile ? 'Profile updated!' : 'Profile created!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const photoUrl = preview || (profile?.profilePhoto ? `${API_URL}${profile.profilePhoto}` : null);

  return (
    <div className="flex min-h-screen">
      <FarmerSidebar />
      <main className="flex-1 bg-stone-50 overflow-auto">
        <div className="bg-white border-b border-stone-100 px-8 py-5 sticky top-0 z-30" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
          <h1 className="font-display text-2xl font-bold text-stone-900">Farm Profile</h1>
          <p className="text-stone-400 text-sm mt-0.5">This is shown to customers browsing your products</p>
        </div>

        <div className="p-8 max-w-2xl">
          {loading ? (
            <div className="card p-8 space-y-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo card */}
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold text-stone-800 mb-5">Profile Photo</h2>
                <div className="flex items-center gap-5">
                  <div
                    onClick={() => document.getElementById('photoInput').click()}
                    className="w-24 h-24 rounded-2xl bg-green-100 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-4 border-white shadow-md flex-shrink-0"
                    style={{boxShadow:'var(--shadow-lg)'}}>
                    {photoUrl
                      ? <img src={photoUrl} className="w-full h-full object-cover" alt="Profile" />
                      : <span className="text-4xl">👨‍🌾</span>}
                  </div>
                  <div>
                    <button type="button" onClick={() => document.getElementById('photoInput').click()} className="btn-secondary text-sm py-2.5 px-5">
                      📸 Change Photo
                    </button>
                    <p className="text-xs text-stone-400 mt-2">JPG or PNG, max 5MB</p>
                  </div>
                  <input id="photoInput" type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </div>
              </div>

              {/* Details */}
              <div className="card p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-stone-800">Farm Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your Name</label>
                    <input className="input" value={form.farmerName}
                      onChange={e => setForm({...form, farmerName: e.target.value})} required />
                  </div>
                  <div>
                    <label className="label">Farm Name</label>
                    <input className="input" placeholder="Green Valley Farm"
                      value={form.farmName} onChange={e => setForm({...form, farmName: e.target.value})} required />
                  </div>
                </div>

                <div>
                  <label className="label">Farm Location</label>
                  <input className="input" placeholder="Nashik, Maharashtra"
                    value={form.farmLocation} onChange={e => setForm({...form, farmLocation: e.target.value})} required />
                </div>

                <div>
                  <label className="label">Crops Grown <span className="text-stone-400 font-normal">(comma-separated)</span></label>
                  <input className="input" placeholder="tomatoes, onions, wheat, mango"
                    value={form.cropTypes} onChange={e => setForm({...form, cropTypes: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Farming Method</label>
                    <select className="input" value={form.farmingMethod} onChange={e => setForm({...form, farmingMethod: e.target.value})}>
                      <option value="organic">🌿 Organic</option>
                      <option value="conventional">🌾 Conventional</option>
                      <option value="mixed">🔄 Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Years of Experience</label>
                    <input className="input" type="number" min="0" placeholder="10"
                      value={form.yearsOfExperience} onChange={e => setForm({...form, yearsOfExperience: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="label">Bio / About Your Farm</label>
                  <textarea className="input resize-none" rows={4}
                    placeholder="Tell customers about your farm, your practices, and what makes your produce special…"
                    value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} maxLength={500} />
                  <p className="text-xs text-stone-400 mt-1.5">{form.bio.length}/500 characters</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-4 text-base">
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : profile ? '✅ Update Profile' : '✅ Create Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
