"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/formatters";
import { Checkbox } from "../ui/checkbox";
import { Extra, ProductSizes, Size } from "@prisma/client";
import { ProductWithRelations } from "@/types/product";
import { useState } from "react";
import { getCartItemId, useCartStore } from "@/store/cart-store";

function AddToCartButton({
  item,
  allExtras,
}: {
  item: ProductWithRelations;
  allExtras: Extra[];
}) {
  const cart = useCartStore((s) => s.items);
  const addCartItem = useCartStore((s) => s.addCartItem);


  const defaultSize =
    cart.find((element) => element.id === item.id)?.size ||
    item.sizes.find((s) => s.name === ProductSizes.SMALL) ||
    item.sizes[0];

  const defaultExtras =
    cart.find((element) => element.id === item.id)?.extras || [];

  const [selectedSize, setSelectedSize] = useState<Size | undefined>(defaultSize);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtras);

  const cartItemId = getCartItemId(item.id, selectedSize, selectedExtras);
  const quantity = cart.find((i) => i.cartItemId === cartItemId)?.quantity ?? 0;
  let totalPrice = selectedSize?.price ?? 0;

  for (const extra of selectedExtras) {
    totalPrice += extra.price;
  }

  const handleAddToCart = () => {
    addCartItem({
      cartItemId: getCartItemId(item.id, selectedSize, selectedExtras),
      id: item.id,
      image: item.image,
      name: item.name,
      size: selectedSize,
      extras: selectedExtras,
      quantity: 1,
    });
  };
  const sortedSizes = [...item.sizes].sort((a, b) => {
    const order = {
      SMALL: 1,
      MEDIUM: 2,
      LARGE: 3,
    };

    return order[a.name] - order[b.name];
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="mt-4 text-white rounded-full !px-8"
        >
          <span>Add To Cart</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center">
          <Image src={item.image} alt={item.name} width={200} height={200} />
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription className="text-center">
            {item.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <Label htmlFor="pick-size">Pick your size</Label>
            <PickSize
              sizes={sortedSizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>
          <div className="space-y-4 text-center">
            <Label htmlFor="add-extras">Any extras?</Label>
            <Extras
              extras={allExtras}
              selectedExtras={selectedExtras}
              setSelectedExtras={setSelectedExtras}
            />
          </div>
        </div>
        <DialogFooter>
          {quantity === 0 ? (
            <Button
              type="submit"
              onClick={handleAddToCart}
              className="w-full h-10"
            >
              Add to cart {formatCurrency(totalPrice)}
            </Button>
          ) : (
            <ChooseQuantity
              quantity={quantity}
              item={item}
              selectedSize={selectedSize}
              selectedExtras={selectedExtras}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCartButton;

function PickSize({
  sizes,
  selectedSize,
  setSelectedSize,
}: {
  sizes: Size[];
  selectedSize: Size | undefined;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size | undefined>>;
}) {
  return (
    <RadioGroup defaultValue="comfortable">
      {sizes.map((size) => (
        <div
          key={size.id}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
        >
          <RadioGroupItem
            value={size.name}
            checked={selectedSize?.id === size.id}
            onClick={() => setSelectedSize(size)}
            id={size.id}
          />
          <Label htmlFor={size.id}>
            {size.name} {formatCurrency(size.price)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
function Extras({
  extras,
  selectedExtras,
  setSelectedExtras,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
}) {
  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      const filteredSelectedExtras = selectedExtras.filter(
        (item) => item.id !== extra.id,
      );
      setSelectedExtras(filteredSelectedExtras);
    } else {
      setSelectedExtras((prev) => [...prev, extra]);
    }
  };
  return extras.map((extra) => (
    <div
      key={extra.id}
      className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
    >
      <Checkbox
        id={extra.id}
        onClick={() => handleExtra(extra)}
        checked={Boolean(selectedExtras.find((e) => e.id === extra.id))}
      />
      <Label
        htmlFor={extra.id}
        className="text-sm text-gary-600 p-5 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {extra.name} {formatCurrency(extra.price)}
      </Label>
    </div>
  ));
}

const ChooseQuantity = ({
  quantity,
  item,
  selectedExtras,
  selectedSize,
}: {
  quantity: number;
  selectedExtras: Extra[];
  selectedSize: Size | undefined;
  item: ProductWithRelations;
}) => {
  const addCartItem = useCartStore((s) => s.addCartItem);
  const removeCartItem = useCartStore((s) => s.removeCartItem);
  const removeItemFromCart = useCartStore((s) => s.removeItemFromCart);

  const cartItemId = getCartItemId(item.id, selectedSize, selectedExtras);

  return (
    <div className="flex items-center flex-col gap-2 mt-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" onClick={() => removeCartItem(cartItemId)}>
          -
        </Button>
        <div>
          <span className="text-black">{quantity} in cart</span>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            addCartItem({
              cartItemId,
              id: item.id,
              image: item.image,
              name: item.name,
              extras: selectedExtras,
              size: selectedSize,
              quantity: 1,
            })
          }
        >
          +
        </Button>
      </div>
      <Button size="sm" onClick={() => removeItemFromCart(cartItemId)}>
        Remove
      </Button>
    </div>
  );
};
