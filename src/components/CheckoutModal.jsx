import { useState } from 'react';
import {
  X,
  User,
  MapPin,
  CreditCard,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatRupiah, paymentMethods } from '../data/products';

const STEPS = { FORM: 'form', LOADING: 'loading', SUCCESS: 'success' };

export default function CheckoutModal({ onClose }) {
  const { cart, cartSubtotal, cartTax, cartTotal, dispatch } = useShop();

  const [step, setStep] = useState(STEPS.FORM);
  const [paidTotal, setPaidTotal] = useState(0); // simpan total sebelum cart dikosongkan
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'transfer',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!form.address.trim()) newErrors.address = 'Alamat wajib diisi';
    if (!form.phone.trim()) newErrors.phone = 'Nomor HP wajib diisi';
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim()))
      newErrors.phone = 'Nomor HP tidak valid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(STEPS.LOADING);
    const totalSnapshot = cartTotal; // ambil sebelum cart dikosongkan

    // Simulate payment processing
    setTimeout(() => {
      setPaidTotal(totalSnapshot);
      dispatch({
        type: 'CHECKOUT',
        payload: {
          customerInfo: {
            name: form.name,
            address: form.address,
            phone: form.phone,
            paymentMethod: form.paymentMethod,
          },
        },
      });
      setStep(STEPS.SUCCESS);
    }, 2000);
  };

  const handleClose = () => {
    if (step === STEPS.LOADING) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-2xl shadow-2xl shadow-black/50 flex flex-col max-h-[90vh] animate-slide-in-up">
        {/* Header */}
        {step !== STEPS.SUCCESS && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div>
              <h2 className="font-bold text-lg text-gray-100">Checkout</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Lengkapi data pengiriman untuk melanjutkan
              </p>
            </div>
            {step !== STEPS.LOADING && (
              <button
                id="close-checkout-btn"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl
                           bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200
                           transition-all duration-200"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* ── FORM STEP ── */}
        {step === STEPS.FORM && (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* Order Summary Mini */}
            <div className="glass-darker rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <ShoppingBag size={14} className="text-emerald-400" />
                <span>Ringkasan Pesanan ({cart.length} item)</span>
              </div>
              {cart.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-400">
                  <span className="truncate pr-2">{item.name} x{item.quantity}</span>
                  <span className="flex-shrink-0">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
              {cart.length > 3 && (
                <p className="text-xs text-gray-500">+{cart.length - 3} item lainnya</p>
              )}
              <div className="border-t border-white/5 pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatRupiah(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>PPN 11%</span>
                  <span>{formatRupiah(cartTax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-100 pt-1">
                  <span>Total Bayar</span>
                  <span className="gradient-text">{formatRupiah(cartTotal)}</span>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="checkout-name" className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-1.5">
                <User size={14} className="text-emerald-400" />
                Nama Lengkap
              </label>
              <input
                id="checkout-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
                className={`input-field ${errors.name ? 'border-red-500/60 ring-1 ring-red-500/30' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="checkout-phone" className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-1.5">
                <span className="text-emerald-400 text-base">📱</span>
                Nomor HP
              </label>
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className={`input-field ${errors.phone ? 'border-red-500/60 ring-1 ring-red-500/30' : ''}`}
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="checkout-address" className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-1.5">
                <MapPin size={14} className="text-emerald-400" />
                Alamat Pengiriman
              </label>
              <textarea
                id="checkout-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                placeholder="Jl. Contoh No. 1, Kota, Provinsi..."
                className={`input-field resize-none ${errors.address ? 'border-red-500/60 ring-1 ring-red-500/30' : ''}`}
              />
              {errors.address && (
                <p className="text-xs text-red-400 mt-1">{errors.address}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                <CreditCard size={14} className="text-emerald-400" />
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    htmlFor={`payment-${method.id}`}
                    className={`flex items-center gap-2.5 p-3 rounded-xl cursor-pointer
                      border transition-all duration-200
                      ${form.paymentMethod === method.id
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-gray-100'
                        : 'border-white/5 bg-slate-800/40 text-gray-400 hover:border-white/15'
                      }`}
                  >
                    <input
                      type="radio"
                      id={`payment-${method.id}`}
                      name="paymentMethod"
                      value={method.id}
                      checked={form.paymentMethod === method.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-xs font-medium leading-tight">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              id="submit-payment-btn"
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
            >
              <span>Bayar Sekarang</span>
              <ChevronRight size={16} />
            </button>
          </form>
        )}

        {/* ── LOADING STEP ── */}
        {step === STEPS.LOADING && (
          <div className="px-6 py-16 flex flex-col items-center gap-5 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard size={24} className="text-emerald-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Memproses Pembayaran</h3>
              <p className="text-sm text-gray-500 mt-1">
                Mohon tunggu, jangan tutup halaman ini...
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SUCCESS STEP ── */}
        {step === STEPS.SUCCESS && (
          <div className="px-6 py-12 flex flex-col items-center gap-5 text-center animate-bounce-in">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-100">Pesanan Berhasil! 🎉</h3>
              <p className="text-sm text-gray-400 mt-2">
                Terima kasih, <span className="text-emerald-400 font-semibold">{form.name}</span>!
                <br />Pesanan Anda sedang diproses dan akan segera dikirimkan.
              </p>
            </div>
            <div className="glass-darker rounded-xl px-5 py-3 text-sm text-gray-400">
              <p>Total dibayar: <span className="text-emerald-400 font-bold">{formatRupiah(cartTotal)}</span></p>
              <p className="text-xs mt-0.5">via {paymentMethods.find(m => m.id === form.paymentMethod)?.label}</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                id="view-history-btn"
                onClick={() => {
                  dispatch({ type: 'SET_TAB', payload: 'history' });
                  onClose();
                }}
                className="btn-ghost flex-1 text-sm"
              >
                Lihat Riwayat
              </button>
              <button
                id="continue-shopping-btn"
                onClick={onClose}
                className="btn-primary flex-1 text-sm"
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
