import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Armchair, LayoutGrid, Smartphone, Package } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "seat-covers": <Armchair className="h-8 w-8" />,
  "floor-mats": <LayoutGrid className="h-8 w-8" />,
  "phone-holders": <Smartphone className="h-8 w-8" />,
  default: <Package className="h-8 w-8" />,
};

export async function CategoryGrid() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Default categories if none exist
  const defaultCategories = [
    {
      id: "1",
      name: "Seat Covers",
      slug: "seat-covers",
      description: "Premium quality seat covers for all car models",
    },
    {
      id: "2",
      name: "Floor Mats",
      slug: "floor-mats",
      description: "Durable and stylish floor mats",
    },
    {
      id: "3",
      name: "Phone Holders",
      slug: "phone-holders",
      description: "Secure and convenient phone mounting solutions",
    },
  ];

  const displayCategories =
    categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find exactly what you need for your vehicle
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative flex flex-col items-center p-8 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {categoryIcons[category.slug] || categoryIcons.default}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
