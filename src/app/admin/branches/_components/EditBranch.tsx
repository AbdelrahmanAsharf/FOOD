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
import { Branch } from "@prisma/client";
import { EditIcon } from "lucide-react";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateBranch } from "../_actions/branch";

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

function EditBranch({ branch }: { branch: Branch }) {
  const [state, action, pending] = useActionState(
    updateBranch.bind(null, branch.id),
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

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل الفرع</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="name">اسم الفرع</Label>
            <Input
              id="branchName"
              name="branchName"
              defaultValue={branch.name}
              placeholder="اسم الفرع"
            />
            {state.error?.name && (
              <p className="text-sm text-destructive mt-1">
                {state.error.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="city">المدينة</Label>
            <Input
              id="city"
              name="city"
              defaultValue={branch.city}
              placeholder="المدينة"
            />
            {state.error?.city && (
              <p className="text-sm text-destructive mt-1">
                {state.error.city}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">العنوان</Label>
            <Input
              id="address"
              name="address"
              defaultValue={branch.address}
              placeholder="العنوان"
            />
            {state.error?.address && (
              <p className="text-sm text-destructive mt-1">
                {state.error.address}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={branch.phone || ""}
              placeholder="رقم الهاتف"
            />
            {state.error?.phone && (
              <p className="text-sm text-destructive mt-1">
                {state.error.phone}
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

export default EditBranch;