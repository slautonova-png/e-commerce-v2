"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  BarChart3,
} from "lucide-react";

interface AdminSidebarProps {
  userRole: string;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "staff"],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    roles: ["admin", "staff"],
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    roles: ["admin"],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ["admin"],
  },
  {
    name: "Staff",
    href: "/admin/staff",
    icon: Users,
    roles: ["admin"],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
];

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card lg:block">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">AUTONOVA</span>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            Admin
          </span>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View Store
        </Link>
      </div>
    </aside>
  );
}
