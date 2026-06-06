"use client";

import { useActionState, useEffect } from "react";
import { addExtra } from "../_actions/extra";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialState = { status: 0, message: "" };

export default function AddExtraForm() {
  const [state, action, pending] = useActionState(addExtra, initialState);

  useEffect(() => {
    if (!pending && state.message) {
      if (state.status === 201) toast.success(state.message);
      else if (state.status === 500) toast.error(state.message);
    }
  }, [state.message, state.status, pending]);

  return (
    <form action={action} className="mb-6 space-y-4">
      <div>
        <Label htmlFor="name">اسم الإضافة</Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="مثال: بطاطس، جبنة، كاتشب..."
        />
      </div>
      <div>
        <Label htmlFor="price">السعر</Label>
        <Input
          type="number"
          name="price"
          id="price"
          min={0}
          step={0.01}
          placeholder="0.00"
        />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "جاري الإضافة..." : "إضافة"}
      </Button>
    </form>
  );
}