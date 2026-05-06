import Link from "next/link";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmed - ${orderNumber} | Autonova`,
    description: "Your order has been placed successfully",
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="text-2xl font-bold text-primary mt-1">{orderNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <Package className="h-6 w-6 text-primary mx-auto" />
            <p className="text-sm font-medium text-foreground mt-2">
              Processing
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;re preparing your order
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <Truck className="h-6 w-6 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium text-foreground mt-2">
              Delivery
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              3-5 business days
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent to your email address with order
          details.
        </p>

        <div className="flex flex-col gap-4 pt-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
