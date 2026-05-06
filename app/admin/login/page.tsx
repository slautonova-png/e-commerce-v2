import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = {
  title: "Admin Login | Autonova",
  description: "Sign in to the admin dashboard",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-primary">AUTONOVA</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in with your admin credentials
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
