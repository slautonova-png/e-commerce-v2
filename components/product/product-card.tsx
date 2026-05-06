import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary);
  const firstImage = product.images?.[0];
  const displayImage = primaryImage || firstImage;

  const lowestPrice = product.variants?.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.base_price
  );

  const hasMultiplePrices =
    product.variants &&
    product.variants.length > 1 &&
    new Set(product.variants.map((v) => v.price)).size > 1;

  const inStock = product.variants?.some((v) => v.in_stock) ?? true;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300"
    >
      <div className="aspect-square relative bg-muted overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage.image_url}
            alt={displayImage.alt_text || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
        {product.is_featured && inStock && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-semibold text-primary">
          {hasMultiplePrices && "From "}
          {formatPrice(lowestPrice || product.base_price)}
        </p>
      </div>
    </Link>
  );
}
