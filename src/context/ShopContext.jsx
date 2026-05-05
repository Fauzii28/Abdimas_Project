import { createContext, useContext, useReducer, useEffect } from 'react';
import { productsData, TAX_RATE } from '../data/products';

// ─── LocalStorage Helpers ──────────────────────────────────────────────────────
const STORAGE_KEYS = {
  CART: 'outdoor_shop_cart',
  TRANSACTIONS: 'outdoor_shop_transactions',
  PRODUCTS: 'outdoor_shop_products',
};

const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
};

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  products: loadFromStorage(STORAGE_KEYS.PRODUCTS, productsData),
  cart: loadFromStorage(STORAGE_KEYS.CART, []),
  transactions: loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []),
  cartOpen: false,
  activeTab: 'shop',
  searchQuery: '',
  selectedCategory: 'Semua',
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
const shopReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find((item) => item.id === action.payload.id);
      const product = state.products.find((p) => p.id === action.payload.id);
      if (!product || product.stock <= 0) return state;

      let newCart;
      if (existing) {
        const newQty = existing.quantity + 1;
        if (newQty > product.stock) return state;
        newCart = state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      return { ...state, cart: newCart };
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter((item) => item.id !== action.payload);
      return { ...state, cart: newCart };
    }

    case 'UPDATE_QUANTITY': {
      const { id, delta } = action.payload;
      const product = state.products.find((p) => p.id === id);
      const newCart = state.cart
        .map((item) => {
          if (item.id !== id) return item;
          const newQty = item.quantity + delta;
          if (newQty < 1) return null;
          if (newQty > (product?.stock || 99)) return item;
          return { ...item, quantity: newQty };
        })
        .filter(Boolean);
      return { ...state, cart: newCart };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'CHECKOUT': {
      const { customerInfo } = action.payload;
      const subtotal = state.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;

      // Reduce stock
      const updatedProducts = state.products.map((product) => {
        const cartItem = state.cart.find((item) => item.id === product.id);
        if (!cartItem) return product;
        return { ...product, stock: product.stock - cartItem.quantity };
      });

      const transaction = {
        id: `TRX-${Date.now()}`,
        date: new Date().toISOString(),
        customer: customerInfo,
        items: [...state.cart],
        subtotal,
        tax,
        total,
        status: 'Selesai',
      };

      const newTransactions = [transaction, ...state.transactions];

      return {
        ...state,
        cart: [],
        transactions: newTransactions,
        products: updatedProducts,
        cartOpen: false,
      };
    }

    case 'TOGGLE_CART':
      return { ...state, cartOpen: !state.cartOpen };

    case 'CLOSE_CART':
      return { ...state, cartOpen: false };

    case 'SET_TAB':
      return { ...state, activeTab: action.payload, cartOpen: false };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────────────────────
const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Persist cart and transactions to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, state.cart);
  }, [state.cart]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, state.transactions);
  }, [state.transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, state.products);
  }, [state.products]);

  // Computed values
  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartTax = cartSubtotal * TAX_RATE;
  const cartTotal = cartSubtotal + cartTax;

  const filteredProducts = state.products.filter((product) => {
    const matchesCategory =
      state.selectedCategory === 'Semua' ||
      product.category === state.selectedCategory;
    const matchesSearch =
      !state.searchQuery ||
      product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalRevenue = state.transactions.reduce((sum, t) => sum + t.total, 0);

  const value = {
    ...state,
    dispatch,
    cartItemCount,
    cartSubtotal,
    cartTax,
    cartTotal,
    filteredProducts,
    totalRevenue,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
