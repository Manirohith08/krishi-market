import Link from 'next/link';
import Navbar from '../components/common/Navbar';
import ProductCard from '../components/common/ProductCard';
import { useEffect, useState } from "react";

const CATS = [
  { name:'Vegetables', slug:'vegetables', img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop&auto=format', count:'140+' },
  { name:'Fruits', slug:'fruits', img:'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&h=280&fit=crop&auto=format', count:'90+' },
  { name:'Dairy', slug:'dairy', img:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=280&fit=crop&auto=format', count:'45+' },
  { name:'Grains', slug:'grains', img:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=280&fit=crop&auto=format', count:'60+' },
  { name:'Herbs', slug:'herbs', img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop&auto=format', count:'30+' },
  { name:'Spices', slug:'other', img:'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=280&fit=crop&auto=format', count:'55+' },
];

const HOW = [
  { icon:'👨‍🌾', step:'1', title:'Farmer Lists', desc:'Verified farmers upload fresh produce with pricing and harvest dates.' },
  { icon:'🛒', step:'2', title:'You Browse', desc:'Explore hundreds of products, filter by category, compare prices.' },
  { icon:'🚚', step:'3', title:'We Deliver', desc:'Farm-fresh orders arrive at your door — tracked every step.' },
];

const STATS = [
  ['2,400+','Verified Farmers'],
  ['18K+','Happy Customers'],
  ['99%','Fresh Guarantee'],
  ['500+','Cities Served']
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=8`);
        const data = await res.json();
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.log(err);
        setFeaturedProducts([]);
      }
    };

    fetchProducts();
  }, []);

  if (!featuredProducts) {
    return <h1 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h1>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800&auto=format&fit=crop&q=80"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-white">
            Fresh Produce From Farmers
          </h1>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-6">
          {CATS.map(cat => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
              <div className="bg-white p-3 rounded shadow cursor-pointer">
                <img src={cat.img} className="h-24 w-full object-cover rounded" />
                <p className="text-center mt-2 font-semibold">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-green-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))
          ) : (
            <p>No products</p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white text-center py-6">
        © 2024 Krishi Market
      </footer>
    </div>
  );
}
