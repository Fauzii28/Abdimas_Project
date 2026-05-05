import { X, Minus, Plus, Trash2, ShoppingBag, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatRupiah } from '../data/products';
import { useState } from 'react';

export default function CartDrawer({ onCheckout }) {
  const {
    cart,
    cartOpen,
    cartItemCount,
    cartSubtotal,
    cartTax,
    cartTotal,
    dispatch,
  } = useShop();

  const [removingId, setRemovingId] = useState(null);

  if (!cartOpen) return null;

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
      setRemovingId(null);
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />

      {/* Drawer */}
      <aside
        id="cart-drawer"
        className="fixed top-0 right-0 h-full w-full max-w-sm z-50
                   bg-slate-900 border-l border-white/10 shadow-2xl
                   flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShoppingCart size={16} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-100 leading-none">Keranjang</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="w-8 h-8 flex items-center justify-center rounded-xl
                       bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200
                       transition-all duration-200"
            aria-label="Tutup keranjang"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/60 flex items-center justify-center border border-white/5">
                <ShoppingBag size={32} className="text-slate-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-300">Keranjang kosong</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tambahkan produk untuk mulai belanja
                </p>
              </div>
              <button
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                className="btn-primary text-sm"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className={`flex gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5
                  hover:border-emerald-500/20 transition-all duration-300
                  ${removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 leading-tight line-clamp-2 mb-1">
                    {item.name}
                  </p>
                  <p className="text-emerald-400 text-sm font-semibold">
                    {formatRupiah(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      id={`qty-minus-${item.id}`}
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: { id: item.id, delta: -1 },
                        })
                      }
                      className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600
                                 flex items-center justify-center text-gray-300
                                 transition-all duration-200 hover:scale-110 active:scale-90"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-gray-100 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      id={`qty-plus-${item.id}`}
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: { id: item.id, delta: 1 },
                        })
                      }
                      className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-emerald-500/30
                                 flex items-center justify-center text-gray-300 hover:text-emerald-400
                                 transition-all duration-200 hover:scale-110 active:scale-90"
                      aria-label="Tambah jumlah"
                    >
                      <Plus size={12} />
                    </button>

                    <span className="ml-auto text-xs text-gray-500">
                      = {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  id={`remove-item-${item.id}`}
                  onClick={() => handleRemove(item.id)}
                  className="btn-danger p-1.5 self-start flex-shrink-0"
                  aria-label={`Hapus ${item.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="px-5 py-5 border-t border-white/5 space-y-3">
            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal ({cartItemCount} item)</span>
                <span className="text-gray-200">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <span>Pajak (PPN 11%)</span>
                </div>
                <span className="text-gray-200">{formatRupiah(cartTax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/5">
                <span className="text-gray-100">Total</span>
                <span className="gradient-text text-lg">{formatRupiah(cartTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                id="clear-cart-btn"
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="btn-ghost flex-shrink-0 text-sm px-3"
              >
                <Trash2 size={14} />
              </button>
              <button
                id="checkout-btn"
                onClick={onCheckout}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles size={14} />
                Checkout
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
