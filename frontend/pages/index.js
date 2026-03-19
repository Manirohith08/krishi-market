import Link from 'next/link';
import Navbar from '../components/common/Navbar';
import ProductCard from '../components/common/ProductCard';

const CATS = [
  { name:'Vegetables', slug:'vegetables', img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop&auto=format', count:'140+' },
  { name:'Fruits',     slug:'fruits',     img:'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&h=280&fit=crop&auto=format', count:'90+' },
  { name:'Dairy',      slug:'dairy',      img:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=280&fit=crop&auto=format', count:'45+' },
  { name:'Grains',     slug:'grains',     img:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=280&fit=crop&auto=format', count:'60+' },
  { name:'Herbs',      slug:'herbs',      img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop&auto=format', count:'30+' },
  { name:'Spices',     slug:'other',      img:'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=280&fit=crop&auto=format', count:'55+' },
];

const HOW = [
  { icon:'👨‍🌾', step:'1', title:'Farmer Lists', desc:'Verified farmers upload fresh produce with pricing and harvest dates.' },
  { icon:'🛒',   step:'2', title:'You Browse',  desc:'Explore hundreds of products, filter by category, compare prices.' },
  { icon:'🚚',   step:'3', title:'We Deliver',  desc:'Farm-fresh orders arrive at your door — tracked every step.' },
];

const STATS = [['2,400+','Verified Farmers'],['18K+','Happy Customers'],['99%','Fresh Guarantee'],['500+','Cities Served']];

export default function Home({ featuredProducts }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800&auto=format&fit=crop&q=80"
            alt="Farmers market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/75 to-green-800/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl">
            {/* Pill */}
            <div className="animate-fade-up inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-7">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Delivering to 500+ cities across India
            </div>

            <h1 className="animate-fade-up-d1 font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
              Fresh Produce<br />
              <em className="text-green-300 not-italic">Directly From</em><br />
              Farmers
            </h1>

            <p className="animate-fade-up-d2 text-lg text-white/75 max-w-lg leading-relaxed mb-10">
              Skip the middlemen. Buy directly from verified local farmers and get the freshest seasonal produce delivered to your doorstep — at fair prices that support rural India.
            </p>

            <div className="animate-fade-up-d3 flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary text-base px-8 py-4 rounded-2xl bg-white text-green-800 hover:bg-green-50 font-bold" style={{boxShadow:'0 6px 24px rgba(0,0,0,0.18)'}}>
                🛒 Browse Products
              </Link>
              <Link href="/auth/register?role=farmer" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all text-base">
                👨‍🌾 Become a Farmer
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-up-d4 grid grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/15">
              {STATS.map(([n,l]) => (
                <div key={l}>
                  <div className="font-display text-3xl font-bold text-white">{n}</div>
                  <div className="text-xs text-white/55 mt-1 font-medium">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating cards - decorative */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 animate-float z-10">
          {[
            { img:'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=100&h=100&fit=crop', name:'Organic Tomatoes', price:'₹38/kg', tag:'🌿 Organic' },
            { img:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100&h=100&fit=crop', name:'Alphonso Mangoes', price:'₹280/doz', tag:'🥭 Season' },
          ].map((c,i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-3.5 text-white w-56">
              <img src={c.img} alt={c.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{c.name}</p>
                <p className="text-green-300 text-xs mt-0.5">{c.price}</p>
                <span className="text-[10px] bg-green-600/70 px-2 py-0.5 rounded-full mt-1 inline-block">{c.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────── */}
      <div className="bg-green-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {[
              ['🚚','Free delivery above ₹500'],
              ['✅','Farmer verified produce'],
              ['🌿','No chemicals or additives'],
              ['🔄','Easy returns & refunds'],
            ].map(([ic,tx]) => (
              <div key={tx} className="flex items-center gap-2.5 text-sm text-white/80 font-medium">
                <span className="text-lg">{ic}</span>{tx}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-3">Shop by category</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-900">What are you <em className="text-green-700 not-italic">craving</em> today?</h2>
            <p className="text-lg text-stone-500 mt-4">From crisp vegetables to creamy dairy — everything your kitchen needs</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATS.map(cat => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
                <div className="group card card-hover overflow-hidden cursor-pointer">
                  <div className="relative overflow-hidden h-32">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-2.5 left-0 right-0 text-center">
                      <p className="text-white text-sm font-bold">{cat.name}</p>
                      <p className="text-white/70 text-[11px]">{cat.count} items</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────── */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-2">Handpicked for you</p>
              <h2 className="font-display text-4xl font-bold text-stone-900">Farm <em className="text-green-700 not-italic">Fresh Today</em></h2>
              <p className="text-stone-500 mt-2">Harvested in the last 24 hours, delivered by morning</p>
            </div>
            <Link href="/products" className="hidden sm:block btn-secondary text-sm py-2.5 px-5">
              View All Products →
            </Link>
          </div>

          {featuredProducts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            /* Demo cards when DB is empty */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { _id:'1', productName:'Farm Fresh Tomatoes', description:'Vine-ripened, zero chemicals. Straight from Nashik farms.', category:'vegetables', pricePerUnit:38, unit:'kg', organicFlag:true, farmerName:'Ramesh Kumar', farmLocation:'Nashik', availableQuantity:50, productImage:'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=300&fit=crop' },
                { _id:'2', productName:'Alphonso Mangoes', description:'GI-tagged Ratnagiri Alphonso. Peak season sweetness.', category:'fruits', pricePerUnit:280, unit:'dozen', organicFlag:false, farmerName:'Patel Orchards', farmLocation:'Ratnagiri', availableQuantity:30, productImage:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop' },
                { _id:'3', productName:'Baby Spinach Leaves', description:'Tender baby spinach, washed and packed fresh daily.', category:'vegetables', pricePerUnit:45, unit:'bunch', organicFlag:true, farmerName:'Green Leaf Farm', farmLocation:'Pune', availableQuantity:8, productImage:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop' },
                { _id:'4', productName:'A2 Desi Cow Milk', description:'Bilona method A2 milk from indigenous Gir cows.', category:'dairy', pricePerUnit:72, unit:'litre', organicFlag:true, farmerName:'Sahyadri Dairy', farmLocation:'Kolhapur', availableQuantity:20, productImage:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
              ].map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link href="/products" className="btn-primary">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* ── FARMER BANNER ─────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden" style={{background:'linear-gradient(135deg,#14532d,#15803d)'}}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/20" />
              <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-white/10" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-10 lg:p-16">
              <div className="relative z-10">
                <p className="text-green-300 text-xs font-bold tracking-widest uppercase mb-4">For Farmers</p>
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                  Grow with us.<br /><em className="text-green-300 not-italic">Sell directly</em> to customers.
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-8">
                  Join 2,400+ farmers already earning more on Krishi Market. No middlemen, daily payouts, and a supportive community of growers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/auth/register?role=farmer" className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-7 py-3.5 rounded-xl hover:bg-green-50 transition-all text-sm" style={{boxShadow:'0 4px 16px rgba(0,0,0,0.15)'}}>
                    🌱 Start Selling Free
                  </Link>
                  <Link href="/auth/login" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm">
                    Already a farmer? →
                  </Link>
                </div>
              </div>
              <div className="relative z-10 hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=700&h=450&fit=crop&auto=format"
                  alt="Happy farmer"
                  className="rounded-2xl w-full object-cover h-72"
                  style={{boxShadow:'0 20px 60px rgba(0,0,0,0.30)'}}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-3">Simple process</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-900">How Krishi Market <em className="text-green-700 not-italic">Works</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {HOW.map((s,i) => (
              <div key={s.title} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 transition-transform group-hover:-translate-y-2 duration-300"
                  style={{background:'linear-gradient(135deg,#dcfce7,#f0fdf4)',boxShadow:'0 8px 24px rgba(22,163,74,0.15)'}}>
                  <span className="text-4xl">{s.icon}</span>
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center">{s.step}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{s.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-3">Community voices</p>
            <h2 className="font-display text-4xl font-bold text-stone-900">Loved by <em className="text-green-700 not-italic">farmers & families</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q:'"The tomatoes taste unlike anything from a supermarket. Real flavour, zero chemicals — my family is healthier!"', name:'Priya Sharma', role:'Customer, Pune', img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop' },
              { q:'"I finally get fair prices. No middlemen. Krishi Market changed my livelihood and my family\'s future."', name:'Ramesh Patel', role:'Farmer, Nashik', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' },
              { q:'"Organic produce used to be expensive and complicated. Now I get everything at my door by 7 AM — fresher than any market."', name:'Anita Krishnan', role:'Customer, Bengaluru', img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop' },
            ].map((t,i) => (
              <div key={i} className="card p-7">
                <div className="text-amber-400 text-lg mb-4">★★★★★</div>
                <p className="text-stone-600 text-sm leading-relaxed italic mb-6">{t.q}</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-stone-800">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="bg-green-950 text-white/60 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-lg">🌾</div>
                <span className="font-display text-lg font-bold text-white">Krishi Market</span>
              </div>
              <p className="text-sm leading-relaxed">Connecting India's farmers directly to conscious consumers. Fresh, fair, sustainable.</p>
            </div>
            {[
              { title:'Shop', links:['Vegetables','Fruits','Dairy','Grains & Pulses'] },
              { title:'Farmers', links:['Sell on Krishi','Farmer Login','Success Stories','Resources'] },
              { title:'Company', links:['About Us','Blog','Careers','Contact'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">{col.title}</p>
                <div className="space-y-3">
                  {col.links.map(l => <p key={l} className="text-sm hover:text-white cursor-pointer transition-colors">{l}</p>)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <span>© 2024 Krishi Market. All rights reserved.</span>
            <span>Made with ❤️ for Indian Farmers 🇮🇳</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?limit=8`);
    const data = await res.json();
    return { props: { featuredProducts: data.products || [] } };
  } catch {
    return { props: { featuredProducts: [] } };
  }
}
