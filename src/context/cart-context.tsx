import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  size: string;
  quantity: number;
  color: string;
  image: string;
  arrivalDate: string;
}

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isLoaded: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, quantity: number, size: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

const CART_STORAGE_KEY = "grocery-store-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveCart(items);
  }, [items, isLoaded]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const removeFromCart = (id: string, size: string) => {
    setItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: string, quantity: number, size: string) => {
    if (quantity <= 0) { removeFromCart(id, size); return; }
    setItems(prev => prev.map(item =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const getSubtotal = () => items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, isLoaded, addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
