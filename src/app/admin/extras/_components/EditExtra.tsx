"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Extra } from "@prisma/client";
import { EditIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateExtra } from "../_actions/extra";
import { ValidationError } from "next/dist/compiled/amphtml-validator";

type InitialStateType = {
  message?: string;
  error?: ValidationError;
  status?: number | null;
};

const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
};

function EditExtra({ extra }: { extra: Extra }) {
  const [state, action, pending] = useActionState(
    updateExtra.bind(null, extra.id),
    initialState
  );

  useEffect(() => {
    if (state.message) {
      toast.success(state.message, {
        className: state.status === 200 ? "text-green-400" : "text-red-500",
      });
    }
  }, [state.message, state.status]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>تعديل الإضافة</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-4">
          <div>
            <Label>اسم الإضافة</Label>
            <Input name="name" defaultValue={extra.name} placeholder="مثال: بطاطس" />
            {state.error?.name && (
              <p className="text-sm text-destructive mt-1">
                {state.error.name}
              </p>
            )}
          </div>
          <div>
            <Label>السعر</Label>
            <Input
              name="price"
              type="number"
              min={0}
              step={0.01}
              defaultValue={extra.price}
              placeholder="0"
            />
            {state.error?.price && (
              <p className="text-sm text-destructive mt-1">
                {state.error.price}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditExtra;