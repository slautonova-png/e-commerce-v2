import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "./product-card";
import { Package } from "lucide-react";

interface ProductGridProps {
  categorySlug?: string;
  searchQuery?: string;
}

export async function ProductGrid({
  categorySlug,
  searchQuery,
}: ProductGridProps) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    // First get category ID
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading products</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No products found
        </h3>
        <p className="mt-2 text-muted-foreground">
          {categorySlug
            ? "No products in this category yet."
            : "No products available yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
