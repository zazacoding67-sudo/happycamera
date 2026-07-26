"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

const STORAGE_KEY = "happycamera_wishlist";

interface WishlistItem {
  productId: string;
  name?: string;
  price?: number;
  imageUrl?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  isOpen: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string, details?: { name: string; price: number; imageUrl: string }) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishlistItem[];
  } catch {
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadWishlist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveWishlist(items);
  }, [items, hydrated]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  const isWishlisted = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const toggleWishlist = useCallback(
    (productId: string, details?: { name: string; price: number; imageUrl: string }) => {
      setItems((prev) => {
        const exists = prev.find((i) => i.productId === productId);
        if (exists) return prev.filter((i) => i.productId !== productId);
        return [...prev, { productId, ...details }];
      });
    },
    []
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      isOpen,
      isWishlisted,
      toggleWishlist,
      openWishlist,
      closeWishlist,
    }),
    [items, isOpen, isWishlisted, toggleWishlist, openWishlist, closeWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within <WishlistProvider>");
  return ctx;
}
