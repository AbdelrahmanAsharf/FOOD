import Menu from "@/components/menu";
import { getProductsByCategory } from "@/server/db/products";
import { db } from "@/lib/prisma";

async function MenuPage() {
  const [categorites, allExtras] = await Promise.all([
    getProductsByCategory(),
    db.extra.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main>
      {categorites.length > 0 ? (
        categorites.map((category) => (
          <section key={category.id} className="section-gap">
            <div className="container text-center">
              <h1 className="text-primary font-bold text-4xl italic mb-6">
                {category.name}
              </h1>
              <Menu items={category.products} allExtras={allExtras} />
            </div>
          </section>
        ))
      ) : (
        <p className="text-gray-600 text-center py-20">No Products Found</p>
      )}
    </main>
  );
}

export default MenuPage;