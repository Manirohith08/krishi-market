import Link from 'next/link';
import Navbar from '../../components/common/Navbar';
import ProductCard from '../../components/common/ProductCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api','') || 'http://localhost:5000';

export default function FarmerPublicProfile({ profile, products }) {
  if (!profile) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center text-4xl mx-auto mb-5">👨‍🌾</div>
        <h2 className="font-display text-2xl text-stone-600 mb-3">Farmer not found</h2>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const photoUrl = profile.profilePhoto
    ? (profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${API_URL}${profile.profilePhoto}`)
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop';

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Cover */}
      <div className="relative h-64 overflow-hidden bg-green-900">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&h=400&fit=crop&auto=format"
          alt="Farm cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Profile card */}
        <div className="card -mt-16 p-8 mb-10" style={{boxShadow:'var(--shadow-xl)'}}>
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={photoUrl}
                alt={profile.farmerName}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white"
                style={{boxShadow:'var(--shadow-lg)'}}
              />
              {profile.farmingMethod === 'organic' && (
                <span className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-base border-2 border-white">✓</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-stone-900">{profile.farmerName}</h1>
                {profile.farmingMethod === 'organic' && <span className="badge-organic">🌿 Certified Organic</span>}
              </div>
              <p className="text-green-700 font-semibold text-lg">{profile.farmName}</p>

              <div className="flex flex-wrap gap-5 mt-4 text-sm text-stone-500">
                <span className="flex items-center gap-1.5"><span>📍</span>{profile.farmLocation}</span>
                {profile.yearsOfExperience > 0 && <span className="flex items-center gap-1.5"><span>🗓</span>{profile.yearsOfExperience} years farming</span>}
                <span className="flex items-center gap-1.5"><span>⭐</span>4.9 · 248 reviews</span>
              </div>

              {profile.bio && <p className="text-stone-500 text-sm leading-relaxed mt-4 max-w-xl">{profile.bio}</p>}
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/products" className="btn-primary text-sm py-2.5 px-5">🛒 Shop Products</Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 py-6 border-t border-b border-stone-100 mb-6">
            {[
              [profile.yearsOfExperience || 10, 'Years Experience'],
              [products.length || 28, 'Products'],
              ['3,400+', 'Orders Fulfilled'],
              ['4.9★', 'Avg Rating'],
            ].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-3xl font-bold text-green-700">{v}</div>
                <div className="text-xs text-stone-400 font-medium mt-1 uppercase tracking-wide">{l}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {profile.cropTypes?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.cropTypes.map(c => (
                <span key={c} className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full font-medium capitalize">{c}</span>
              ))}
              <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full font-medium">Direct Delivery</span>
              <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full font-medium">Same Day Harvest</span>
            </div>
          )}
        </div>

        {/* Products */}
        <div className="flex items-center justify-between mb-7">
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Products by <em className="text-green-700 not-italic">{profile.farmerName?.split(' ')[0]}</em>
          </h2>
          <span className="text-sm text-stone-400">{products.length} products</span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="card p-14 text-center">
            <p className="text-5xl mb-3">🌱</p>
            <p className="text-stone-400 font-medium">No products listed yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const [profileRes, productsRes] = await Promise.all([
      fetch(`${API}/farmers/${params.id}`),
      fetch(`${API}/products?farmer=${params.id}`)
    ]);
    const profileData = await profileRes.json();
    const productsData = await productsRes.json();
    if (!profileData.success) return { notFound: true };
    return { props: { profile: profileData.profile, products: productsData.products || [] } };
  } catch { return { notFound: true }; }
}
