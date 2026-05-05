import { useState } from 'react';
import { ShoppingCart, Star, Package, Zap, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatRupiah } from '../data/products';

export default function ProductCard({ product, layout = 'default' }) {
  const { dispatch, cart } = useShop();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 600);
  };

  const isLarge = layout === 'large';
  const isMedium = layout === 'medium';

  return (
    <div
      className={`card group relative overflow-hidden flex flex-col
        ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
        ${isMedium ? 'md:col-span-2' : ''}
      `}
    >
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-white text-[10px] font-bold
            px-2.5 py-1 rounded-full shadow-lg animate-fade-in`}
        >
          {product.badge}
        </div>
      )}

      {/* Stock Warning */}
      {product.stock <= 5 && product.stock > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500/90 text-black text-[10px] font-bold
          px-2 py-1 rounded-full flex items-center gap-1">
          <Zap size={9} />
          Sisa {product.stock}
        </div>
      )}

      {/* Image */}
      <div className={`relative overflow-hidden bg-slate-800/50 ${isLarge ? 'h-64 md:h-72' : 'h-48'}`}>
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
            <Package size={32} className="text-slate-600" />
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500
            group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-200 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={14} className="text-emerald-400" />
            <span>{product.description.slice(0, 40)}...</span>
          </div>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
            <span className="glass px-4 py-2 rounded-xl text-sm font-semibold text-gray-300">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category Tag */}
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 
          border border-emerald-500/20 px-2 py-0.5 rounded-full w-fit">
          {product.category}
        </span>

        {/* Name */}
        <h3 className={`font-semibold text-gray-100 leading-tight line-clamp-2
          ${isLarge ? 'text-lg' : 'text-sm'}`}>
          {product.name}
        </h3>

        {/* Rating & Sold */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-gray-300">{product.rating}</span>
          </div>
          <span>•</span>
          <span>{product.sold.toLocaleString('id-ID')} terjual</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Package size={11} />
            <span>Stok: {product.stock}</span>
          </div>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div>
            <p className={`font-bold gradient-text ${isLarge ? 'text-xl' : 'text-base'}`}>
              {formatRupiah(product.price)}
            </p>
            {cartItem && (
              <p className="text-[11px] text-emerald-500/70 mt-0.5">
                {cartItem.quantity} di keranjang
              </p>
            )}
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold
              transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50
              ${addedAnim
                ? 'bg-emerald-400 text-black scale-110'
                : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 hover:border-transparent hover:shadow-lg hover:shadow-emerald-500/30'
              }`}
          >
            <ShoppingCart size={15} className={addedAnim ? 'animate-spin-fast' : ''} />
            <span className="hidden sm:inline">
              {addedAnim ? 'Ditambah!' : 'Tambah'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
