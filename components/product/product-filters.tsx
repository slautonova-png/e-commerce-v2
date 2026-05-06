"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/types";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
}

export function ProductFilters({
  categories,
  selectedCategory,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/products");
  };

  const hasFilters = selectedCategory || searchParams.get("search");

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Search</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-md border border-input bg-background px-4 py-2 pr-10 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Categories
        </h3>
        <div className="space-y-2">
          <Link
            href="/products"
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
