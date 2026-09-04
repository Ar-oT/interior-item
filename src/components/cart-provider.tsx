"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { addCartItem } from "@/app/cart/actions";
import type { CartLine } from "@/lib/cart-model";
import { products } from "@/data/products";

type CartContextValue = {
  items: CartLine[];
  count: number;
  pending: boolean;
  add: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  initialItems,
}: {
  children: ReactNode;
  initialItems: CartLine[];
}) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const value = useMemo(() => {
    const add = (productId: string) => {
      const product = products.find((item) => item.id === productId);
      if (!product) return;

      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [
          ...current,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
      });

      startTransition(async () => {
        await addCartItem(productId);
      });
    };

    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      pending: isPending,
      add,
    };
  }, [items, isPending]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
