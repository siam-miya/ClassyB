import { useState, useEffect } from "react";
import OrderForm from "../components/OrderForm";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../firebase/services";
 
const REVIEWS = [
  { name: "রাহেলা বেগম",   location: "ঢাকা",       text: "অসাধারণ মান! পরার পর সবাই প্রশংসা করেছে।",          stars: 5 },
  { name: "সুমাইয়া আক্তার", location: "চট্টগ্রাম", text: "দাম অনুযায়ী অনেক ভালো কোয়ালিটি। আবার অর্ডার করব।", stars: 5 },
  { name: "নাসরিন খানম",   location: "সিলেট",      text: "ডেলিভারি দ্রুত ছিল এবং প্যাকেজিং চমৎকার।",          stars: 4 },
];
 
export default function LandingPage() {
  const [products, setProducts]               = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderSuccess, setOrderSuccess]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
 
  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
      setProductsLoading(false);
    })();
  }, []);
 
  const handleOrderNow = (product) => {
    setSelectedProduct(product);
    setOrderSuccess(false);
    setTimeout(() => {
      document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
 
  return (
    <div className="min-h-screen bg-white font-sans" style={{ scrollBehavior: "smooth" }}>
 
      {/* ══ HEADER ══ */}
      <header className="bg-[#1a3a5c] text-white sticky top-0 z-50 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
 
          {/* Logo */}
       <a href="/">
       <img className="max-h-[70px] max-w-[70px]" src="main-logo.jpg" alt="main-logo" />
       </a>
 
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#products"     className="hover:text-yellow-300 transition-colors">Products</a>
            <a href="#how-it-works" className="hover:text-yellow-300 transition-colors">What should I order?</a>
            <a href="#reviews"      className="hover:text-yellow-300 transition-colors">Review</a>
            <a href="#order-section" className="hover:text-yellow-300 transition-colors">Order</a>
          </nav>
 
          {/* CTA + hamburger */}
          <div className="flex items-center gap-2">
            <a href="tel:01700000000"
              className="bg-yellow-400 text-gray-900 text-xs sm:text-sm font-black px-3 sm:px-4 py-2 rounded-full hover:bg-yellow-300 transition-all flex items-center gap-1 shadow">
              📞 <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call Now</span>
            </a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-white/15 hover:bg-white/25 p-2 rounded-lg transition-colors text-lg">
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
 
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 bg-[#122d4a]">
            {[
              { href: "#products",      label: "🛍️ Products" },
              { href: "#how-it-works",  label: "❓ How to order?" },
              { href: "#reviews",       label: "⭐ Review" },
              { href: "#order-section", label: "📝 Order Now" },
            ].map(link => (
              <a key={link.href} href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-5 py-3 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
 
      {/* ══ HERO ══ */}
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1e4d7b] to-[#2563a8] text-white py-14 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full pointer-events-none" />
 
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider animate-bounce shadow">
            🔥 সীমিত সময়ের অফার
          </span>
 
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-4">
            ঘরে বসেই পান<br />
            <span className="text-yellow-300">এক্সক্লুসিভ ফ্যাশন</span>
          </h1>
 
          <p className="text-blue-200 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            সর্বোচ্চ মানের, সাশ্রয়ী দামে।<br className="hidden sm:block" /> সারা বাংলাদেশে হোম ডেলিভারি।
          </p>
 
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#products"
              className="bg-yellow-400 text-gray-900 font-black text-base sm:text-lg px-7 sm:px-10 py-3.5 sm:py-4 rounded-full hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl">
              🛍️View the product
            </a>
            <a href="#order-section"
              className="border-2 border-white/60 text-white font-bold text-base sm:text-lg px-7 sm:px-10 py-3.5 sm:py-4 rounded-full hover:bg-white hover:text-[#1a3a5c] transition-all">
              Order Now
            </a>
          </div>
 
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-10 sm:mt-12">
            {[
              { icon: "✅", text: "ফ্রি হোম ডেলিভারি" },
              { icon: "🔄", text: "৭ দিনের রিটার্ন" },
              { icon: "💰", text: "ক্যাশ অন ডেলিভারি" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-1.5 text-sm text-blue-200">
                <span>{b.icon}</span><span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ══ STATS ══ */}
      <section className="bg-[#f0f6ff] border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 grid grid-cols-3 gap-2 sm:gap-6 text-center">
          {[
            { n: "৫০০০+", label: "সন্তুষ্ট গ্রাহক" },
            { n: "২০০+",  label: "পণ্যের সংগ্রহ" },
            { n: "৪.৯★", label: "গড় রেটিং" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-xl sm:text-3xl font-black text-[#1a3a5c]">{s.n}</div>
              <div className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* ══ PRODUCTS ══ */}
      <section id="products" className="py-12 sm:py-16 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-blue-600 font-bold text-xs sm:text-sm uppercase tracking-widest">Our Collection</span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2">Popular products</h2>
            <div className="w-14 sm:w-16 h-1 bg-blue-600 mx-auto mt-3 rounded-full" />
          </div>
 
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {productsLoading
              ? Array(3).fill(null).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-blue-50 animate-pulse">
                    <div className="h-48 sm:h-64 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-9 bg-gray-200 rounded-xl" />
                    </div>
                  </div>
                ))
              : products.length === 0
              ? (
                  <div className="col-span-full text-center py-16 sm:py-24 text-gray-400">
                    <div className="text-5xl sm:text-6xl mb-4">🛍️</div>
                    <p className="font-semibold text-sm sm:text-base">
New products coming soon...</p>
                  </div>
                )
              : products.map(p => (
                  <ProductCard key={p.id} product={p} onOrder={handleOrderNow} />
                ))
            }
          </div>
        </div>
      </section>
 
      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="bg-[#f0f6ff] py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-blue-600 font-bold text-xs sm:text-sm uppercase tracking-widest">সহজ প্রক্রিয়া</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a3a5c] mt-2">কীভাবে অর্ডার করবেন?</h2>
            <div className="w-14 h-1 bg-blue-600 mx-auto mt-3 rounded-full" />
          </div>
 
          {/* Steps — horizontal on desktop, 2×2 grid on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-blue-200 z-0" />
 
            {[
              { step: "১", title: "পণ্য বাছুন",  icon: "🛍️", desc: "পছন্দের পণ্য সিলেক্ট করুন" },
              { step: "২", title: "ফর্ম পূরণ",   icon: "📝", desc: "নাম, ঠিকানা ও ফোন দিন" },
              { step: "৩", title: "কনফার্ম",      icon: "📞", desc: "আমরা কল করে নিশ্চিত করব" },
              { step: "৪", title: "ডেলিভারি",    icon: "🚚", desc: "বাড়িতে পৌঁছে দেওয়া হবে" },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-4 sm:p-6 text-center shadow-sm border border-blue-50 hover:shadow-md transition-shadow relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a3a5c] text-white rounded-full flex items-center justify-center font-black text-base sm:text-lg mx-auto mb-2 sm:mb-3 shadow">
                  {item.step}
                </div>
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{item.icon}</div>
                <div className="font-black text-gray-900 text-sm sm:text-base">{item.title}</div>
                <div className="text-gray-500 text-xs sm:text-sm mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ══ REVIEWS ══ */}
      <section id="reviews" className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-blue-600 font-bold text-xs sm:text-sm uppercase tracking-widest">গ্রাহকদের মতামত</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">তারা কী বলছেন?</h2>
            <div className="w-14 h-1 bg-blue-600 mx-auto mt-3 rounded-full" />
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#f8fbff] border border-blue-100 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(null).map((_, j) => (
                    <span key={j} className={j < r.stars ? "text-yellow-400" : "text-gray-200"}>★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic text-sm sm:text-base mb-4 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1a3a5c] text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{r.name}</div>
                    <div className="text-gray-400 text-xs">{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ══ ORDER SECTION ══ */}
      <section id="order-section" className="bg-gradient-to-br from-[#1a3a5c] to-[#2563a8] py-12 sm:py-16 px-4 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
 
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-black px-4 py-1 rounded-full mb-3 uppercase tracking-wider">
              📦 অর্ডার করুন
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">এখনই অর্ডার দিন</h2>
            <p className="text-blue-200 mt-2 text-sm sm:text-base">ফর্ম পূরণ করুন, আমরা আপনাকে কনফার্ম করব</p>
          </div>
 
          {orderSuccess ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-2xl">
              <div className="text-6xl sm:text-7xl mb-4">🎉</div>
              <h3 className="text-xl sm:text-2xl font-black text-green-600">অর্ডার সফল হয়েছে!</h3>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">আমরা শীঘ্রই আপনাকে কল করব।</p>
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 text-sm font-semibold">✅ আপনার অর্ডার রেকর্ড হয়েছে</p>
                <p className="text-green-600 text-xs mt-1">আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে</p>
              </div>
              <button
                onClick={() => { setOrderSuccess(false); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="mt-6 bg-[#1a3a5c] text-white font-bold px-6 sm:px-8 py-3 rounded-full hover:bg-[#2563a8] transition-colors shadow-md">
                🛍️ আরও কেনাকাটা করুন
              </button>
            </div>
          ) : (
            <OrderForm
              selectedProduct={selectedProduct}
              onSuccess={() => setOrderSuccess(true)}
            />
          )}
        </div>
      </section>
 
      {/* ══ FOOTER ══ */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
            {/* Brand */}
            <div className="text-center sm:text-left">
             <img className="max-h-[50px] max-w-[50px]" src="main-logo.jpg" alt="logo" />
              <p className="text-gray-500 text-xs sm:text-sm mt-1">সেরা মানের ফ্যাশন, সেরা দামে</p>
            </div>
 
            {/* Quick links */}
            <div className="flex gap-4 sm:gap-6 text-sm">
              {["#products", "#how-it-works", "#reviews", "#order-section"].map((href, i) => (
                <a key={href} href={href}
                  className="hover:text-white transition-colors">
                  {["পণ্য", "কীভাবে?", "রিভিউ", "অর্ডার"][i]}
                </a>
              ))}
            </div>
          </div>
 
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <p>📞 01700-000000 &nbsp;|&nbsp; ✉️ fashionbd@email.com</p>
            <p>© 2026 FashionBD. সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
 
          {/* ── Creator credit ── */}
          <div className="mt-5 pt-4 border-t border-gray-800/50 text-center">
            <a
              href="https://www.facebook.com/profile.php?id=61578355676474"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 group"
            >
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                Created by
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1877f2] to-[#42a5f5] text-white text-xs font-black px-3 py-1.5 rounded-full shadow group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-200">
                <svg className="w-3.5 h-3.5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Website Creator
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}