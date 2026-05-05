import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatRupiah, paymentMethods } from '../data/products';

function StatCard({ icon: Icon, label, value, sub, color = 'emerald', trend }) {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
    },
    blue: {
      bg: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/20',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
    },
    purple: {
      bg: 'from-purple-500/20 to-pink-500/10',
      border: 'border-purple-500/20',
      icon: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
    },
    amber: {
      bg: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${c.border}
        bg-gradient-to-br ${c.bg} p-5 hover:scale-105 transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={18} className={c.icon} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ArrowUpRight size={11} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-100 mt-1 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1.5">{sub}</p>}
      </div>
      {/* Decorative */}
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${c.iconBg} rounded-full opacity-40 group-hover:scale-150 transition-all duration-500`} />
    </div>
  );
}

export default function AdminDashboard() {
  const { products, transactions, totalRevenue, dispatch } = useShop();

  const totalOrders = transactions.length;
  const totalItemsSold = transactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleResetStock = () => {
    // Reset products to initial data from localStorage wipe
    if (window.confirm('Reset semua stok produk ke default? Transaksi tidak akan terhapus.')) {
      localStorage.removeItem('outdoor_shop_products');
      window.location.reload();
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <LayoutDashboard size={26} className="text-emerald-400" />
            Dashboard Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau performa toko Anda secara real-time
          </p>
        </div>
        <button
          id="reset-stock-btn"
          onClick={handleResetStock}
          className="btn-ghost flex items-center gap-2 text-sm text-amber-400 border-amber-500/20 hover:bg-amber-500/10"
        >
          <RefreshCw size={14} />
          Reset Stok
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Total Pendapatan"
          value={formatRupiah(totalRevenue)}
          sub={`Rata-rata ${formatRupiah(avgOrderValue)}/pesanan`}
          color="emerald"
          trend="Live"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Pesanan"
          value={totalOrders.toLocaleString('id-ID')}
          sub={`${totalItemsSold} item terjual`}
          color="blue"
        />
        <StatCard
          icon={Package}
          label="Total Produk"
          value={products.length}
          sub={`${outOfStockProducts.length} stok habis`}
          color="purple"
        />
        <StatCard
          icon={Users}
          label="Pelanggan Unik"
          value={new Set(transactions.map((t) => t.customer.phone)).size}
          sub="berdasarkan nomor HP"
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Orders Table ── */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="font-semibold text-gray-100 flex items-center gap-2">
              <ShoppingBag size={16} className="text-emerald-400" />
              Daftar Pesanan Masuk
            </h2>
            <span className="text-xs text-gray-500 bg-slate-800/60 px-2.5 py-1 rounded-full">
              {totalOrders} total
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <ShoppingBag size={32} className="text-slate-600" />
              <p className="text-gray-400 font-medium">Belum ada pesanan masuk</p>
              <p className="text-xs text-gray-600">Pesanan akan muncul setelah checkout</p>
              <button
                onClick={() => dispatch({ type: 'SET_TAB', payload: 'shop' })}
                className="btn-primary text-sm mt-2"
              >
                Buka Toko
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['ID Pesanan', 'Pelanggan', 'Pembayaran', 'Item', 'Total', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/3">
                  {transactions.map((t) => {
                    const pm = paymentMethods.find(
                      (m) => m.id === t.customer.paymentMethod
                    );
                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-white/2 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-emerald-400">{t.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-200 font-medium truncate max-w-[120px]">
                            {t.customer.name}
                          </p>
                          <p className="text-xs text-gray-500">{t.customer.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-400">
                            {pm?.icon} {pm?.label || t.customer.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-300">
                            {t.items.reduce((s, i) => s + i.quantity, 0)} pcs
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-emerald-400">
                            {formatRupiah(t.total)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full w-fit border border-emerald-500/20">
                            <CheckCircle size={10} />
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Sidebar: Stock & Alerts ── */}
        <div className="flex flex-col gap-4">
          {/* Low Stock Alert */}
          {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-100 flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-amber-400" />
                Peringatan Stok
              </h3>
              <div className="space-y-2.5">
                {outOfStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-200 truncate">{p.name}</p>
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                        <AlertTriangle size={9} />
                        Stok Habis
                      </p>
                    </div>
                  </div>
                ))}
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-200 truncate">{p.name}</p>
                      <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                        <Clock size={9} />
                        Sisa {p.stock} unit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Stock Table */}
          <div className="card overflow-hidden flex-1">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="font-semibold text-gray-100 flex items-center gap-2 text-sm">
                <Package size={14} className="text-emerald-400" />
                Stok Produk
              </h3>
            </div>
            <div className="overflow-y-auto max-h-80">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/3 hover:bg-white/2 transition-colors last:border-0"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        p.stock === 0
                          ? 'bg-red-500'
                          : p.stock <= 5
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        p.stock === 0
                          ? 'text-red-400'
                          : p.stock <= 5
                          ? 'text-amber-400'
                          : 'text-gray-300'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-100 text-sm mb-3">Aksi Cepat</h3>
            <div className="space-y-2">
              <button
                onClick={() => dispatch({ type: 'SET_TAB', payload: 'shop' })}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl
                           bg-slate-800/60 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20
                           text-sm text-gray-300 hover:text-emerald-400 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} />
                  Buka Toko
                </div>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_TAB', payload: 'history' })}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl
                           bg-slate-800/60 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20
                           text-sm text-gray-300 hover:text-blue-400 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  Lihat Riwayat
                </div>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
