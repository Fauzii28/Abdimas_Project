import {
  ClipboardList,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Receipt,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatRupiah, paymentMethods } from '../data/products';

const statusColor = {
  Selesai: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Proses: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Batal: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function TransactionCard({ transaction }) {
  const [expanded, setExpanded] = useState(false);
  const paymentLabel = paymentMethods.find(
    (m) => m.id === transaction.customer.paymentMethod
  );

  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card overflow-hidden animate-slide-in-up">
      {/* Header Row */}
      <div
        className="flex items-start justify-between p-5 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Receipt size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-100 text-sm">{transaction.id}</p>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[transaction.status] || statusColor.Selesai}`}
              >
                {transaction.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar size={11} />
              {formattedDate} · {formattedTime}
            </p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Package size={11} className="text-gray-500" />
              {transaction.items.reduce((s, i) => s + i.quantity, 0)} item ·{' '}
              <span className="text-emerald-400 font-semibold">
                {formatRupiah(transaction.total)}
              </span>
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-300 transition-colors p-1 flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t border-white/5 px-5 py-4 space-y-4 animate-fade-in">
          {/* Customer Info */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="glass-darker rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <MapPin size={11} className="text-emerald-400" />
                Info Pengiriman
              </p>
              <p className="text-sm font-semibold text-gray-200">{transaction.customer.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{transaction.customer.phone}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{transaction.customer.address}</p>
            </div>
            <div className="glass-darker rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <CreditCard size={11} className="text-emerald-400" />
                Pembayaran
              </p>
              <p className="text-sm font-semibold text-gray-200">
                {paymentLabel?.icon} {paymentLabel?.label || transaction.customer.paymentMethod}
              </p>
              <div className="mt-2 space-y-0.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatRupiah(transaction.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>PPN 11%</span>
                  <span>{formatRupiah(transaction.tax)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-200 pt-1 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-emerald-400">{formatRupiah(transaction.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <ShoppingBag size={11} className="text-emerald-400" />
              Produk Dipesan
            </p>
            <div className="space-y-2">
              {transaction.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/30"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatRupiah(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-emerald-400 flex-shrink-0">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionHistory() {
  const { transactions, dispatch } = useShop();

  return (
    <section className="py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <ClipboardList size={26} className="text-emerald-400" />
            Riwayat Transaksi
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {transactions.length} transaksi tersimpan
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'shop' })}
          className="btn-ghost flex items-center gap-2 text-sm"
          id="back-to-shop-btn"
        >
          <ArrowLeft size={14} />
          Kembali Belanja
        </button>
      </div>

      {transactions.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/60 flex items-center justify-center border border-white/5">
            <ClipboardList size={36} className="text-slate-500" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-300">Belum ada transaksi</h3>
            <p className="text-gray-500 text-sm mt-1">
              Riwayat pembelian Anda akan muncul di sini
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_TAB', payload: 'shop' })}
            className="btn-primary text-sm"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </section>
  );
}
