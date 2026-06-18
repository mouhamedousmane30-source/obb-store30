import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group">
      <Link
        to="/boutique/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/5] overflow-hidden bg-stone-100 mb-4"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-[10px] uppercase tracking-widest font-semibold px-2 py-1">
            Nouveau
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            add(product.slug, product.variants?.options[0]);
          }}
          className="absolute bottom-0 w-full py-4 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
        >
          Ajouter au panier
        </button>
      </Link>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-medium text-sm">{product.name}</h3>
          <p className="text-[11px] text-muted uppercase tracking-widest mt-1">
            {product.subtitle}
          </p>
        </div>
        <span className="font-mono text-sm whitespace-nowrap">{formatPrice(product.price)}</span>
      </div>
    </div>
  );
}
