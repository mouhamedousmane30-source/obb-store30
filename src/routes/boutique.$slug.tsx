import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { getProduct, getRelated, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/boutique/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    return {
      meta: [
        { title: p ? `${p.name} — OBB Store` : "Produit — OBB Store" },
        { name: "description", content: p?.description.slice(0, 160) ?? "Produit OBB Store" },
        { property: "og:title", content: p ? `${p.name} — OBB Store` : "OBB Store" },
        { property: "og:description", content: p?.description.slice(0, 160) ?? "OBB Store" },
        ...(p?.image ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-3xl font-display mb-4">Produit introuvable</h1>
        <Link to="/boutique" className="text-accent underline">Retour à la boutique</Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const related = getRelated(product);
  const [variant, setVariant] = useState<string | undefined>(product.variants?.options[0]);
  const [activeImg, setActiveImg] = useState(0);
  const { add } = useCart();
  const navigate = useNavigate();

  return (
    <main className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <Link
          to="/boutique"
          className="text-[11px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← Boutique
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-[4/5] bg-stone-100 overflow-hidden mb-4">
            <img
              src={product.gallery[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden bg-stone-100 border-2 transition-colors ${
                    i === activeImg ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:py-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-semibold mb-4">
            {product.subtitle}
          </p>
          <h1 className="text-3xl md:text-5xl font-display mb-6">{product.name}</h1>
          <p className="font-mono text-xl mb-8">{formatPrice(product.price)}</p>
          <p className="text-foreground/80 leading-relaxed mb-10 max-w-prose">
            {product.description}
          </p>

          {product.variants && (
            <div className="mb-10">
              <p className="text-[11px] uppercase tracking-widest text-muted mb-3">
                {product.variants.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setVariant(opt)}
                    className={`px-5 py-2 border text-sm transition-colors ${
                      variant === opt
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-foreground/15 hover:border-foreground/40"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => add(product.slug, variant)}
              className="flex-1 py-4 bg-primary text-primary-foreground uppercase tracking-[0.2em] text-xs font-bold hover:bg-foreground transition-colors"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={() => {
                add(product.slug, variant);
                navigate({ to: "/panier" });
              }}
              className="flex-1 py-4 border border-foreground/20 uppercase tracking-[0.2em] text-xs font-bold hover:bg-foreground/5 transition-colors"
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-foreground/5">
          <h2 className="text-2xl md:text-3xl font-display mb-12">Vous aimerez aussi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
