import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice, type Product } from "@/data/products";

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "flex flex-col overflow-hidden rounded-sm border border-line bg-white/40 lg:col-span-2 lg:row-span-2"
          : "flex flex-col overflow-hidden rounded-sm border border-line bg-white/40"
      }
    >
      <div
        className={
          featured
            ? "relative aspect-[4/3] bg-line/40 lg:aspect-auto lg:min-h-[28rem]"
            : "relative aspect-[4/5] bg-line/40"
        }
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover"
          priority={featured}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-2xl tracking-tight">{product.name}</h3>
          <p className="text-sm tabular-nums">{formatPrice(product.price)}</p>
        </div>
        <p className="text-xs tracking-[0.18em] text-moss uppercase">
          {product.material}
        </p>
        <p className="flex-1 text-sm leading-7 text-ink/70">{product.description}</p>
        <div className="flex justify-end">
          <AddToCartButton id={product.id} name={product.name} />
        </div>
      </div>
    </article>
  );
}
