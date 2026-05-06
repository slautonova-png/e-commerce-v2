import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartContent } from "@/components/cart/cart-content";

export const metadata = {
  title: "Shopping Cart | Autonova",
  description: "Review your shopping cart and proceed to checkout",
};

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Shopping Cart
          </h1>
          <CartContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
