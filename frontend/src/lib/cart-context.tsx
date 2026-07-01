import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { PRODUCTS, type Product } from "./products";
import { fetchProducts } from "./api/products";

export interface CartItem {
  slug: string;
  variant?: string;
  quantity: number;
}

export interface CartLine {
  product: Product;
  variant?: string;
  quantity: number;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  total: number;
  products: Product[];
  add: (slug: string, variant?: string, quantity?: number) => void;
  remove: (slug: string, variant?: string) => void;
  setQuantity: (slug: string, variant: string | undefined, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "obb-cart-v1";

function sameLine(a: CartItem, slug: string, variant?: string) {
  return a.slug === slug && (a.variant ?? "") === (variant ?? "");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const { data: apiProducts } = useQuery({
    queryKey: ["products", "catalog"],
    queryFn: async () => {
      const res = await fetchProducts({ limit: 100 });
      return res.products;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const catalog = apiProducts?.length ? apiProducts : PRODUCTS;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((slug: string, variant?: string, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => sameLine(it, slug, variant));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { slug, variant, quantity }];
    });
  }, []);

  const remove = useCallback((slug: string, variant?: string) => {
    setItems((prev) => prev.filter((it) => !sameLine(it, slug, variant)));
  }, []);

  const setQuantity = useCallback(
    (slug: string, variant: string | undefined, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) return prev.filter((it) => !sameLine(it, slug, variant));
        return prev.map((it) =>
          sameLine(it, slug, variant) ? { ...it, quantity } : it,
        );
      });
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = [];
    for (const it of items) {
      const product = catalog.find((p) => p.slug === it.slug);
      if (!product) continue;
      lines.push({
        product,
        variant: it.variant,
        quantity: it.quantity,
        lineTotal: product.prix * it.quantity,
      });
    }
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const total = lines.reduce((s, l) => s + l.lineTotal, 0);
    return { items, lines, count, total, products: catalog, add, remove, setQuantity, clear };
  }, [items, catalog, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
