"use client";

import { Button } from "@/components/ui/button";
import { deleteExtra } from "../_actions/extra";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Extra } from "@prisma/client";
import EditExtra from "./EditExtra";
import { formatCurrency } from "@/lib/formatters";

export default function ExtraItem({ extra }: { extra: Extra }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await deleteExtra(extra.id);
      if (res.status === 200) toast.success(res.message);
      else toast.error(res.message);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="bg-gray-300 p-4 rounded-md flex justify-between">
      <div>
        <p className="text-black font-medium text-lg">{extra.name}</p>
        <p className="text-sm text-gray-500">{formatCurrency(extra.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleDelete} variant="secondary" disabled={isLoading}>
          <Trash2 />
        </Button>
        <EditExtra extra={extra} />
      </div>
    </li>
  );
}