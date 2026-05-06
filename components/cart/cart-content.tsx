"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, Package } from "lucide-react";

export function CartContent() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shippingFee = subtotal > 10000 ? 0 : 350;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Your cart is empty
        </h2>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center mt-6 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.variant_id}
            className="flex gap-4 p-4 rounded-xl border border-border bg-card"
          >
            <div className="relative h-24 w-24 shrink-0 rounded-lg bg-muted overflow-hidden">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product_id}`}
                className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {item.product_name}
              </Link>
              {item.variant_info && (
                <p className="text-sm text-muted-foreground mt-1">
                  {item.variant_info}
                </p>
              )}
              <p className="text-lg font-semibold text-primary mt-2">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => removeItem(item.variant_id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.variant_id, item.quantity - 1)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.variant_id, item.quantity + 1)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Order Summary
          </h2>

          <div className="space-y-3">
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
            {subtotal < 10000 && (
              <p className="text-xs text-muted-foreground">
                Free shipping on orders over {formatPrice(10000)}
              </p>
            )}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-semibold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 w-full flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/products"
            className="mt-3 w-full flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
