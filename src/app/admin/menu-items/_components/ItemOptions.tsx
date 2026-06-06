"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProductSizes, Size } from "@prisma/client";

type ItemOptionsProps = {
  state: Partial<Size>[];
  setState: React.Dispatch<React.SetStateAction<Partial<Size>[]>>;
  title: string;
};

const ALL_SIZES = [ProductSizes.SMALL, ProductSizes.MEDIUM, ProductSizes.LARGE];

export default function ItemOptions({ state, setState, title }: ItemOptionsProps) {
  const addOption = () => {
    setState((prev) => [...prev, { name: undefined, price: 0 }]);
  };

  const onChangeName = (value: ProductSizes, index: number) => {
    setState((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], name: value };
      return newItems;
    });
  };

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setState((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], price: Number(e.target.value) || 0 };
      return newItems;
    });
  };

  const removeOption = (indexToRemove: number) => {
    setState((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-4 border rounded-xl p-5 bg-gray-50">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">{title}</Label>
        {state.length < ALL_SIZES.length && (
          <Button type="button" onClick={addOption} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            إضافة
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {state.map((item, index) => {
          // الأحجام المتاحة = كل الأحجام ماعدا اللي اتاخدت في rows تانية
          const availableSizes = ALL_SIZES.filter(
            (size) => !state.some((s, i) => s.name === size && i !== index)
          );

          return (
            <div key={index} className="flex gap-3 items-end bg-white p-4 rounded-lg border">
              <div className="flex-1">
                <Label className="text-xs text-gray-500">الحجم</Label>
                <Select
                  onValueChange={(value) => onChangeName(value as ProductSizes, index)}
                  value={item.name || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحجم" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSizes.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name === ProductSizes.SMALL
                          ? "صغير"
                          : name === ProductSizes.MEDIUM
                            ? "وسط"
                            : "كبير"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32">
                <Label className="text-xs text-gray-500">السعر (جنيه)</Label>
                <Input
                  type="number"
                  min={0}
                  value={item.price ?? ""}
                  onChange={(e) => onChangePrice(e, index)}
                  placeholder="0"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}

        {state.length === 0 && (
          <p className="text-gray-400 text-center py-8">لم يتم إضافة أي أحجام بعد</p>
        )}
      </div>
    </div>
  );
}