"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ChevronLeft, Minus, Plus, ShoppingCart, Package, Check } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const images = product.images?.sort((a, b) => a.display_order - b.display_order) || [];
  const primaryImage = images.find((img) => img.is_primary) || images[0];

  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      variant_id: selectedVariant.id,
      product_id: product.id,
      product_name: product.name,
      variant_info: [selectedVariant.color, selectedVariant.size]
        .filter(Boolean)
        .join(" / "),
      price: selectedVariant.price,
      quantity,
      image_url: primaryImage?.image_url || "",
      in_stock: selectedVariant.in_stock,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleVariantSelect = (color?: string, size?: string) => {
    const variant = product.variants?.find(
      (v) =>
        (!color || v.color === color) &&
        (!size || v.size === size)
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to products
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-xl bg-card border border-border overflow-hidden">
            {images[selectedImageIndex] ? (
              <Image
                src={images[selectedImageIndex].image_url}
                alt={images[selectedImageIndex].alt_text || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-20 shrink-0 rounded-lg border overflow-hidden transition-colors ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-sm text-primary hover:text-primary/80"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

          <p className="text-3xl font-bold text-primary">
            {formatPrice(selectedVariant?.price || product.base_price)}
          </p>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleVariantSelect(color!, selectedVariant?.size || undefined)}
                    className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                      selectedVariant?.color === color
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleVariantSelect(selectedVariant?.color || undefined, size!)}
                    className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                      selectedVariant?.size === size
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          {selectedVariant && (
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedVariant.in_stock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {selectedVariant.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-medium w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.in_stock}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {addedToCart ? (
              <>
                <Check className="h-5 w-5" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </>
            )}
          </button>

          {/* SKU */}
          {selectedVariant && (
            <p className="text-sm text-muted-foreground">
              SKU: {selectedVariant.sku}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
