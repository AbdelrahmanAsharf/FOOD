import CartItems from "./_components/CartItems";
import CheckoutForm from "./_components/CheckoutForm";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function CartPage() {
  const { userId } = await auth();

  let user = null;

  if (userId) {
    user = await db.user.findUnique({
      where: { clerkId: userId },
    });
  }

  console.log(user);

  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <h1 className="text-primary text-center font-bold text-4xl italic mb-10">
            Cart
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <CartItems />
            {user ? (
              <CheckoutForm
                user={{
                  id: user.id,
                  username: user.name,
                  email: user.email,
                  phone: user.phone || "",
                  streetAddress: user.streetAddress || "",
                  postalCode: user.postalCode || "",
                  city: user.city || "",
                  country: user.country || "",
                }}
              />
            ) : (
              <section className="section-gap">
                <div className="container max-w-xl mx-auto">
                  <Alert className="bg-accent text-foreground border-border">
                    <Info className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-lg font-semibold">
                      تسجيل الدخول مطلوب
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      يجب تسجيل الدخول لإتمام عملية الدفع.
                      <div className="mt-4">
                        <Link href="/sign-in">
                          <Button className="bg-primary text-primary-foreground">
                            تسجيل الدخول
                          </Button>
                        </Link>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default CartPage;
