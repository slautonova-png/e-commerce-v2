import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout | Autonova",
  description: "Complete your purchase",
};

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
