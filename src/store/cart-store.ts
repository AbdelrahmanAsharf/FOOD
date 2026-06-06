import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Extra, Size } from "@prisma/client";

export type CartItem = {
  cartItemId: string;
  name: string;
  id: string;
  image: string;
  quantity: number; 
  size?: Size;
  extras?: Extra[];
};

type CartState = {
  items: CartItem[];
  addCartItem: (item: CartItem) => void;
  removeCartItem: (cartItemId: string) => void;
  removeItemFromCart: (id: string) => void;
  clearCart: () => void;
};


export const getCartItemId = (id: string, size?: Size, extras?: Extra[]) => {
  const extrasKey =
    extras
      ?.map((e) => e.id)
      .sort()
      .join("-") || "";
  return `${id}-${size?.id || ""}-${extrasKey}`;
};


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addCartItem: (item: CartItem) => {
        const items = [...get().items];
        const index = items.findIndex((i) => i.cartItemId === item.cartItemId);
        if (index !== -1) {
          items[index].quantity += 1;
        } else {
          items.push({ ...item, quantity: 1 });
        }
        set({ items });
      },

      removeCartItem: (cartItemId: string) => {
        const items = [...get().items];
        const index = items.findIndex((i) => i.cartItemId === cartItemId);
        if (index !== -1) {
          if (items[index].quantity === 1) {
            items.splice(index, 1);
          } else {
            items[index].quantity--;
          }
        }
        set({ items });
      },

      removeItemFromCart: (cartItemId: string) => {
        set({ items: get().items.filter((i) => i.cartItemId !== cartItemId) });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
