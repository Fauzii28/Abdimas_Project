import { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Mountain,
  LayoutDashboard,
  ClipboardList,
  Store,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const navItems = [
  { id: 'shop', label: 'Toko', icon: Store },
  { id: 'history', label: 'Riwayat', icon: ClipboardList },
  { id: 'admin', label: 'Admin', icon: LayoutDashboard },
];

export default function Navbar() {
  const { dispatch, cartItemCount, activeTab, searchQuery } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
    if (activeTab !== 'shop') dispatch({ type: 'SET_TAB', payload: 'shop' });
  };

  const handleTabChange = (tab) => {
    dispatch({ type: 'SET_TAB', payload: tab });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-darker border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* ── Logo ── */}
          <button
            onClick={() => handleTabChange('shop')}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
              <Mountain size={18} className="text-black" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-gray-100 leading-none block">
                Summit
                <span className="gradient-text">Store</span>
              </span>
              <span className="text-xs text-gray-500 leading-none">Outdoor & School</span>
            </div>
          </button>

          {/* ── Search Bar (Desktop) ── */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              id="search-input"
              type="text"
              placeholder="Cari produk outdoor, alat sekolah..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-slate-800/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5
                         text-sm text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40
                         transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ── Nav Items (Desktop) ── */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${activeTab === id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl
                         bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30
                         text-gray-300 hover:text-emerald-400
                         transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Buka keranjang belanja"
            >
              <ShoppingCart size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 badge text-[10px] animate-bounce-in">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl
                         bg-white/5 hover:bg-white/10 border border-white/10
                         text-gray-300 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Search ── */}
        <div className="md:hidden pb-3 relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-slate-800/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5
                       text-sm text-gray-200 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40
                       transition-all duration-300"
          />
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1 animate-fade-in border-t border-white/5 pt-3">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${activeTab === id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <div className="mt-2 px-4 py-2 flex items-center gap-2 text-xs text-gray-600">
              <Sparkles size={12} />
              Outdoor &amp; School Merchandise Store
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
