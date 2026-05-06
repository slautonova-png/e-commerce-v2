import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My Account | Autonova",
  description: "Manage your account, orders, and addresses",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AccountDashboard
          user={user}
          profile={profile}
          orders={orders || []}
          addresses={addresses || []}
        />
      </main>
      <Footer />
    </div>
  );
}
