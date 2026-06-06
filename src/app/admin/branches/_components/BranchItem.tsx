"use client";

import { Button } from "@/components/ui/button";
import { deleteBranch } from "../_actions/branch";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Branch } from "@prisma/client";
import EditBranch from "./EditBranch";

export default function BranchItem({ branch }: { branch: Branch }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await deleteBranch(branch.id);

      if (res.status === 200) {
        toast.success(res.message || "تم حذف الفرع بنجاح");
      } else {
        toast.error(res.message || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <li className="bg-gray-300 p-4 rounded-md flex justify-between">
      <div>
        <p className="text-black font-medium text-lg flex-1">{branch.name}</p>
        <p className="text-sm text-gray-500">{branch.city}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleDelete} variant="secondary" disabled={isLoading}>
          <Trash2 />
        </Button>
        <EditBranch branch={branch} />
      </div>
    </li>
  );
}
