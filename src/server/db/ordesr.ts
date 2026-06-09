import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getOrders = cache(
  async () => {
    const orders = await db.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  },
  ["orders"],
  { revalidate: 3600 }
);
