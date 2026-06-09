"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Category, ProductSizes, Size } from "@prisma/client";
import { ProductWithRelations } from "@/types/product";
import { ProductFormValues, productSchema } from "@/validations/products";
import ItemOptions from "./ItemOptions";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../_actions/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadImage } from "@/components/upload-image";

export function Menuform({
  product,
  categories,
}: {
  categories: Category[];
  product?: ProductWithRelations;
}) {
  const router = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      categoryId: product?.categoryId || "",
      sizes: product?.sizes || [],
      image: product?.image || "", 
    },
  });

  const [sizes, setSizes] = useState<Partial<Size>[]>(product?.sizes || []);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function onSubmit(values: ProductFormValues) {
    setLoading(true);
    try {
      const cleanedSizes = sizes
        .filter((size) => size.name && size.price !== undefined)
        .map((size) => ({
          name: size.name as ProductSizes,
          price: size.price as number,
        }));

      const finalValues: ProductFormValues = {
        ...values,
        image: values.image,
        sizes: cleanedSizes,
      };
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        finalValues.image = data.url; 
      }

      if (product) {
        await updateProduct(product.id, finalValues);
        toast.success("تم التعديل بنجاح");
      } else {
        await createProduct(finalValues);
        toast.success("تم الإنشاء بنجاح");
      }
      router.push("/admin/menu-items");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false); 
    }
  }

  const onDelete = async () => {
    if (!product) return;
    try {
      await deleteProduct(product.id);
      toast.success("تم الحذف");
      router.push("/admin/menu-items");
    } catch {
      toast.error("فشل الحذف");
    }
  };
  return (
    <main className="max-w-2xl mx-auto my-10 p-6 border rounded-lg shadow bg-white space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>صورة المنتج</FormLabel>
                <UploadImage
                  previewUrl={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : field.value || ""
                  }
                  onFileSelect={(file) => {
                    setSelectedFile(file);
                    const fakeUrl = URL.createObjectURL(file);
                    form.setValue("image", fakeUrl); 
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* الاسم */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المنتج</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: بيتزا مارجريتا" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* الوصف */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Textarea placeholder="اكتب وصفاً للمنتج" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* الفئة */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الفئة</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded px-3 py-2 bg-white"
                  >
                    <option value="">اختر فئة</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*للأحجام */}
          <Accordion
            type="multiple"
            className="bg-gray-100 rounded-md  px-4  w-full"
          >
            {/* SIZES */}
            <AccordionItem value="sizes" className="border-none ">
              <AccordionTrigger className="text-black font-medium">
                الأحجام (Sizes)
              </AccordionTrigger>
              <AccordionContent>
                <ItemOptions
                  state={sizes}
                  setState={setSizes}
                  title="الأحجام (Sizes)"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="space-y-3">
            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "جارٍ الحفظ..."
                : product
                  ? "تعديل المنتج"
                  : "حفظ المنتج"}
            </Button>

            {product ? (
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={onDelete}
              >
                🗑️ حذف المنتج
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/menu-items")}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </main>
  );
}
