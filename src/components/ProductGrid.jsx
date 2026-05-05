import { Filter, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { categories } from '../data/products';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { filteredProducts, selectedCategory, searchQuery, dispatch } = useShop();

  const handleCategoryChange = (cat) => {
    dispatch({ type: 'SET_CATEGORY', payload: cat });
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <SlidersHorizontal size={26} className="text-emerald-400" />
            Katalog Produk
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {filteredProducts.length} produk{' '}
            {searchQuery && (
              <span>
                untuk "<span className="text-emerald-400">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-500" />
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                ${selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 scale-105'
                  : 'bg-slate-800/60 text-gray-400 hover:text-gray-200 hover:bg-slate-700/60 border border-white/5'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bento Grid ── */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {filteredProducts.map((product, index) => {
            // Bento grid sizing logic
            let layout = 'default';
            if (index === 0 && product.size === 'large') layout = 'large';
            else if (product.size === 'medium') layout = 'medium';
            return (
              <ProductCard key={product.id} product={product} layout={layout} />
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/60 flex items-center justify-center border border-white/5">
            <PackageSearch size={36} className="text-slate-500" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-300">Produk tidak ditemukan</h3>
            <p className="text-gray-500 text-sm mt-1">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
          <button
            onClick={() => {
              dispatch({ type: 'SET_SEARCH', payload: '' });
              dispatch({ type: 'SET_CATEGORY', payload: 'Semua' });
            }}
            className="btn-ghost text-sm"
          >
            Reset Filter
          </button>
        </div>
      )}
    </section>
  );
}
