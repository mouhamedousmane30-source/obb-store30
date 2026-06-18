import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — OBB Store" },
      { name: "description", content: "Récapitulatif de votre panier OBB Store." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, total, setQuantity, remove, count } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-display mb-12">Votre Panier</h1>

        {lines.length === 0 ? (
          <div className="border border-foreground/10 py-24 text-center">
            <p className="text-muted mb-6">Votre panier est vide.</p>
            <Link
              to="/boutique"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground uppercase tracking-widest text-[11px] font-semibold hover:bg-foreground transition-colors"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {lines.map((line) => (
                <div
                  key={`${line.product.slug}-${line.variant ?? ""}`}
                  className="flex gap-6 border-b border-foreground/10 pb-6"
                >
                  <Link
                    to="/boutique/$slug"
                    params={{ slug: line.product.slug }}
                    className="w-24 h-32 bg-stone-100 overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          to="/boutique/$slug"
                          params={{ slug: line.product.slug }}
                          className="font-medium hover:text-accent transition-colors"
                        >
                          {line.product.name}
                        </Link>
                        <p className="text-[11px] uppercase tracking-widest text-muted mt-1">
                          {line.product.subtitle}
                          {line.variant ? ` · ${line.variant}` : ""}
                        </p>
                      </div>
                      <span className="font-mono">{formatPrice(line.lineTotal)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-foreground/15">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.product.slug, line.variant, line.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-foreground/5"
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <span className="px-4 font-mono text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.product.slug, line.variant, line.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-foreground/5"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.product.slug, line.variant)}
                        className="text-[11px] uppercase tracking-widest text-muted hover:text-destructive transition-colors"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-card border border-foreground/10 p-8 h-fit lg:sticky lg:top-24">
              <h2 className="font-display text-2xl mb-6">Récapitulatif</h2>
              <dl className="space-y-3 text-sm border-b border-foreground/10 pb-6 mb-6">
                <div className="flex justify-between">
                  <dt className="text-muted">Articles</dt>
                  <dd className="font-mono">{count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Sous-total</dt>
                  <dd className="font-mono">{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Livraison</dt>
                  <dd className="text-[11px] uppercase tracking-widest text-muted">
                    Calculée à la commande
                  </dd>
                </div>
              </dl>
              <div className="flex justify-between text-lg font-display mb-8">
                <span>Total</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
              <Link
                to="/checkout"
                className="block text-center w-full py-4 bg-primary text-primary-foreground uppercase tracking-[0.2em] text-xs font-bold hover:bg-foreground transition-colors"
              >
                Passer commande
              </Link>
              <Link
                to="/boutique"
                className="block text-center w-full py-3 mt-3 text-[11px] uppercase tracking-widest text-muted hover:text-foreground"
              >
                ← Continuer mes achats
              </Link>
            </aside>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
