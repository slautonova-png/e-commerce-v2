"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Profile, Order, Address } from "@/lib/types";
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface AccountDashboardProps {
  user: User;
  profile: Profile | null;
  orders: Order[];
  addresses: Address[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  confirmed: "bg-blue-500/10 text-blue-500",
  processing: "bg-blue-500/10 text-blue-500",
  shipped: "bg-purple-500/10 text-purple-500",
  delivered: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
};

export function AccountDashboard({
  user,
  profile,
  orders,
  addresses,
}: AccountDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">(
    "profile"
  );
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <UserIcon className="h-5 w-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Package className="h-5 w-5" />
              Orders
              {orders.length > 0 && (
                <span className="ml-auto text-xs bg-secondary rounded-full px-2 py-0.5">
                  {orders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "addresses"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <MapPin className="h-5 w-5" />
              Addresses
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <ProfileTab user={user} profile={profile} />
          )}
          {activeTab === "orders" && <OrdersTab orders={orders} />}
          {activeTab === "addresses" && <AddressesTab addresses={addresses} />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({
  user,
  profile,
}: {
  user: User;
  profile: Profile | null;
}) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Profile Information
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="w-full rounded-md border border-input bg-muted px-4 py-3 text-muted-foreground cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="+94 77 123 4567"
          />
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-500"
                : "bg-destructive/10 border border-destructive/20 text-destructive"
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No orders yet
        </h3>
        <p className="mt-2 text-muted-foreground">
          When you place an order, it will appear here.
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
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-semibold text-foreground">
                {order.order_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold text-primary">
                {formatPrice(order.total)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  statusColors[order.status] || "bg-secondary text-foreground"
                }`}
              >
                {order.status}
              </span>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        View All Orders
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function AddressesTab({ addresses }: { addresses: Address[] }) {
  if (addresses.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No saved addresses
        </h3>
        <p className="mt-2 text-muted-foreground">
          Add an address for faster checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="rounded-xl border border-border bg-card p-6"
        >
          {address.is_default && (
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium mb-3">
              Default
            </span>
          )}
          <p className="font-medium text-foreground">{address.full_name}</p>
          <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {address.address_line1}
            {address.address_line2 && <>, {address.address_line2}</>}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.city}, {address.district}
            {address.postal_code && ` ${address.postal_code}`}
          </p>
        </div>
      ))}
    </div>
  );
}
