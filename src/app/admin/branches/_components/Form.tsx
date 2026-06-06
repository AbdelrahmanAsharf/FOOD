"use client";

import { useFormState } from "react-dom";
import { addBranch } from "../_actions/branch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { toast } from "sonner";

const initialState = {
  status: 0,
  message: "",
};

export default function Form() {
  const [state, action, pending] = useFormState(addBranch, initialState);
  useEffect(() => {
    if (!pending && state.message) {
      if (state.status === 201) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state.message, state.status, pending]);

  return (
    <form action={action} className="mb-4 space-y-4">
      <div>
        <Label htmlFor="name">اسم الفرع</Label>
        <Input type="text" name="name" id="name" placeholder="ادخل اسم الفرع" />
      </div>

      <div>
        <Label htmlFor="city">المدينة</Label>
        <Input
          type="text"
          name="city"
          id="city"
          placeholder="ادخل اسم المدينة"
        />
      </div>

      <div>
        <Label htmlFor="address">العنوان</Label>
        <Input
          type="text"
          name="address"
          id="address"
          placeholder="ادخل العنوان"
        />
      </div>

      <div>
        <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
        <Input
          type="text"
          name="phone"
          id="phone"
          placeholder="ادخل رقم الهاتف"
        />
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "جاري الإضافة..." : "إضافة"}
      </Button>
    </form>
  );
}
