import { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TransactionHistory from './components/TransactionHistory';
import AdminDashboard from './components/AdminDashboard';

// ─── Inner App (uses context) ─────────────────────────────────────────────────
function AppContent() {
  const { activeTab, dispatch } = useShop();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleOpenCheckout = () => {
    dispatch({ type: 'CLOSE_CART' }); // tutup cart drawer dulu
    setCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {activeTab === 'shop' && (
          <div>
            <HeroBanner />
            <div data-section="products">
              <ProductGrid />
            </div>
          </div>
        )}

        {activeTab === 'history' && <TransactionHistory />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-8 px-4 text-center">
        <p className="text-sm text-gray-600">
          © 2025{' '}
          <span className="text-emerald-500 font-semibold">SummitStore</span>{' '}
          — Outdoor &amp; School Merchandise
        </p>
        <p className="text-xs text-gray-700 mt-1">
          Dibangun dengan ❤️ menggunakan React + Tailwind CSS
        </p>
      </footer>

      {/* Cart Drawer (Sidebar) */}
      <CartDrawer onCheckout={handleOpenCheckout} />

      {/* Checkout Modal */}
      {checkoutOpen && <CheckoutModal onClose={handleCloseCheckout} />}
    </div>
  );
}

// ─── Root App with Provider ───────────────────────────────────────────────────
export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
