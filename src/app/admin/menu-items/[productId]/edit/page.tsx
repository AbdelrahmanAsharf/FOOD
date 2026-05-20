import { getProduct, getProducts } from "@/server/db/products";

import { Menuform } from "../../_components/Form";
import { getCategories } from "@/server/db/categories";
import { redirect } from "next/navigation";

export async function generateStaticParams(): Promise<{ productId: string }[]> {
  const products = await getProducts();
  return products.map((product) => ({
    productId: String(product.id),
  }));
}

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);
  const categories = await getCategories();

  if (!product) {
    redirect("/admin/menu-item");
  }
  return (
  <main>
    <section>
      <div className="container">
        <Menuform
          product={product ?? undefined}
          categories={categories}
        />
      </div>
    </section>
  </main>
);

}
