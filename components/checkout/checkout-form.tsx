"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  CreditCard,
  Smartphone,
  Banknote,
  Package,
  Truck,
} from "lucide-react";

type PaymentMethod = "payhere" | "koko_pay" | "mintpay" | "cod";

interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  postal_code: string;
}

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const paymentMethods = [
  {
    id: "payhere" as PaymentMethod,
    name: "PayHere",
    description: "Credit/Debit Cards, Bank Transfer",
    icon: CreditCard,
  },
  {
    id: "koko_pay" as PaymentMethod,
    name: "Koko Pay",
    description: "Buy now, pay later in installments",
    icon: Smartphone,
  },
  {
    id: "mintpay" as PaymentMethod,
    name: "Mintpay",
    description: "Split payment into 3 installments",
    icon: Smartphone,
  },
  {
    id: "cod" as PaymentMethod,
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Banknote,
  },
];

export function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("payhere");
  const [guestEmail, setGuestEmail] = useState("");
  const [address, setAddress] = useState<ShippingAddress>({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    district: "",
    postal_code: "",
  });

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 10000 ? 0 : 350;
  const total = subtotal + shippingFee;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({ id: user.id, email: user.email || "" });
        setGuestEmail(user.email || "");
      }
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            product_name: item.product_name,
            variant_info: item.variant_info,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          shipping_address: address,
          payment_method: paymentMethod,
          guest_email: user ? null : guestEmail,
          guest_phone: user ? null : address.phone,
          subtotal,
          shipping_fee: shippingFee,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      clearCart();
      router.push(`/order-confirmation/${data.order_number}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Guest Email (if not logged in) */}
          {!user && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Contact Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="your@email.com"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Order confirmation will be sent to this email
                </p>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Shipping Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={address.full_name}
                  onChange={(e) =>
                    setAddress({ ...address, full_name: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  required
                  value={address.address_line1}
                  onChange={(e) =>
                    setAddress({ ...address, address_line1: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={address.address_line2}
                  onChange={(e) =>
                    setAddress({ ...address, address_line2: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Colombo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  District
                </label>
                <select
                  required
                  value={address.district}
                  onChange={(e) =>
                    setAddress({ ...address, district: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={address.postal_code}
                  onChange={(e) =>
                    setAddress({ ...address, postal_code: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="10100"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="sr-only"
                  />
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      paymentMethod === method.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <method.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{method.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.variant_id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 rounded-lg bg-muted overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {item.product_name}
                    </p>
                    {item.variant_info && (
                      <p className="text-xs text-muted-foreground">
                        {item.variant_info}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/20 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Place Order</>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Delivery in 3-5 business days</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
