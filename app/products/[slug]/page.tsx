import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductDetails } from "@/components/product/product-details";
import { createClient } from "@/lib/supabase/server";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Autonova`,
    description: product.description || `Buy ${product.name} from Autonova`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetails product={product} />
      </main>
      <Footer />
    </div>
  );
}
