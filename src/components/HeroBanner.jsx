import { ArrowRight, Zap, Shield, Truck, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const features = [
  { icon: Truck, text: 'Pengiriman Cepat' },
  { icon: Shield, text: 'Produk Original' },
  { icon: Star, text: 'Rating Terpercaya' },
  { icon: Zap, text: 'Stok Selalu Baru' },
];

export default function HeroBanner() {
  const { dispatch } = useShop();

  return (
    <div className="relative overflow-hidden pt-28 pb-12 px-4 sm:px-6">
      {/* Background Gradient Orbs */}
      <div className="absolute top-16 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">
              Toko Outdoor &amp; Sekolah Terpercaya
            </span>
            <Zap size={13} className="text-emerald-400" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-100 leading-tight mb-4 animate-slide-in-up">
            Gear Terbaik untuk{' '}
            <span className="gradient-text">Petualangan</span>
            <br />
            &amp;{' '}
            <span className="gradient-text">Belajarmu</span>
          </h1>

          {/* Sub */}
          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed animate-slide-in-up animation-delay-100">
            Temukan koleksi alat outdoor premium dan perlengkapan sekolah berkualitas.
            Dikirim cepat ke seluruh Indonesia.
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-3 flex-wrap animate-slide-in-up animation-delay-200">
            <button
              id="hero-shop-btn"
              onClick={() => {
                document
                  .querySelector('[data-section="products"]')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary flex items-center gap-2 text-base px-7 py-3.5"
            >
              Belanja Sekarang
              <ArrowRight size={16} />
            </button>
            <button
              id="hero-admin-btn"
              onClick={() => dispatch({ type: 'SET_TAB', payload: 'admin' })}
              className="btn-ghost flex items-center gap-2 text-base px-7 py-3.5"
            >
              Dashboard Admin
            </button>
          </div>

          {/* Features Pills */}
          <div className="flex items-center justify-center flex-wrap gap-3 mt-10 animate-fade-in animation-delay-300">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 glass px-3.5 py-2 rounded-full text-sm text-gray-400
                           hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300 cursor-default"
              >
                <Icon size={13} className="text-emerald-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
