import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { add } = useCart();
  const navigate = useNavigate();

  return (
    <main className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <Link
          to="/boutique"
          className="text-[11px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← Boutique
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
        <div className="space-y-3 sm:space-y-4">
          <div className="aspect-[4/5] bg-stone-100 overflow-hidden rounded-xl shadow-sm">
            <img
              src={product.gallery[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden bg-stone-100 rounded-lg border-2 transition-all ${
                    i === activeImg ? "border-accent ring-2 ring-accent/20" : "border-transparent hover:border-foreground/20"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:py-8 space-y-6 sm:space-y-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-semibold mb-2 sm:mb-3">
              {product.subtitle}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 sm:gap-4">
              <p className="font-mono text-xl sm:text-2xl font-bold text-accent">{formatPrice(product.price)}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <p className="font-mono text-base sm:text-lg text-muted line-through">{formatPrice(product.originalPrice)}</p>
                  <span className="px-2 sm:px-3 py-1 bg-destructive/10 text-destructive text-[10px] uppercase tracking-widest font-semibold rounded-full">
                    Promo
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-foreground/80 leading-relaxed max-w-prose text-sm sm:text-base">
            {product.description}
          </p>

          {product.variants && (
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted mb-3">
                {product.variants.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setVariant(opt)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 border rounded-lg text-sm font-medium transition-all ${
                      variant === opt
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-foreground/15 hover:border-foreground/40 hover:bg-foreground/5"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => add(product.slug, variant)}
              className="flex-1 py-3 sm:py-4 bg-primary text-primary-foreground uppercase tracking-[0.2em] text-xs font-bold hover:bg-primary/90 transition-all rounded-lg shadow-md hover:shadow-lg"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={() => {
                add(product.slug, variant);
                navigate({ to: "/panier" });
              }}
              className="flex-1 py-3 sm:py-4 border-2 border-primary text-primary uppercase tracking-[0.2em] text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all rounded-lg"
            >
              Acheter maintenant
            </button>
          </div>

          <div className="pt-6 border-t border-foreground/10 space-y-3">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Livraison rapide partout au Sénégal</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Paiement à la livraison</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Service client disponible 7j/7</span>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-foreground/5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display mb-8 sm:mb-12">Vous aimerez aussi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8 lg:gap-y-16">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} onOpenModal={setSelectedProduct} />
            ))}
          </div>
        </section>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
