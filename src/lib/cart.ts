import { CartItem } from "@/store/cart-store";

export const deliveryFee = 5;

export const getCartQuantity = (cart: CartItem[]) => {
  return cart.reduce((quantity, item) => item.quantity! + quantity, 0);
};

export const getItemQuantity = (id: string, cart: CartItem[]) => {
  return cart
    .filter((item) => item.id === id)
    .reduce((sum, item) => sum + item.quantity, 0);
};

export const getSubTotal = (cart: CartItem[]) => {
  return cart.reduce((total, cartItem) => {
    const extrasTotal =
      cartItem.extras?.reduce(
        (sum, extra) => sum + extra.price,
        0
      ) || 0;

    const itemTotal =
      (cartItem.size?.price || 0) +
      extrasTotal;

    return total + itemTotal * (cartItem.quantity || 1);
  }, 0);
};

export const getTotalAmount = (cart: CartItem[]) => {
  return getSubTotal(cart) + deliveryFee;
};
