import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { useState } from "react";

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
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: ''
  });

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#0A0A0A]">
      <SiteNav />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-4">Votre Panier</h1>
        <p className="text-[#0A0A0A]/60 mb-8 sm:mb-12">{count} {count === 1 ? 'article' : 'articles'} dans votre panier</p>

        {lines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#0A0A0A]/10 p-8 sm:p-16 text-center shadow-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-[#F5F8FC] flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#0A0A0A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-display mb-3 text-[#0A0A0A]">Votre panier est vide</h2>
            <p className="text-[#0A0A0A]/60 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">Découvrez notre collection de produits exclusifs et commencez votre shopping.</p>
            <Link
              to="/boutique"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#1E40AF] text-white rounded-xl uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#1E40AF]/90 transition-all hover:shadow-lg w-full sm:w-auto"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information Section */}
              <div className="bg-white rounded-2xl border border-[#0A0A0A]/10 p-6 sm:p-8 shadow-lg">
                <h2 className="font-display text-xl sm:text-2xl mb-6 pb-4 border-b border-[#0A0A0A]/10 text-[#0A0A0A]">Vos Informations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-widest text-[#0A0A0A]/60 mb-2 font-medium">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3 border border-[#0A0A0A]/10 bg-[#F5F8FC] rounded-xl text-sm focus:outline-none focus:border-[#1E40AF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-[#0A0A0A]/60 mb-2 font-medium">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+221 XX XXX XX XX"
                      className="w-full px-4 py-3 border border-[#0A0A0A]/10 bg-[#F5F8FC] rounded-xl text-sm focus:outline-none focus:border-[#1E40AF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-[#0A0A0A]/60 mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-[#0A0A0A]/10 bg-[#F5F8FC] rounded-xl text-sm focus:outline-none focus:border-[#1E40AF] transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-widest text-[#0A0A0A]/60 mb-2 font-medium">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder="Votre adresse"
                      className="w-full px-4 py-3 border border-[#0A0A0A]/10 bg-[#F5F8FC] rounded-xl text-sm focus:outline-none focus:border-[#1E40AF] transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-widest text-[#0A0A0A]/60 mb-2 font-medium">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      placeholder="Dakar, Thiès, Saint-Louis..."
                      className="w-full px-4 py-3 border border-[#0A0A0A]/10 bg-[#F5F8FC] rounded-xl text-sm focus:outline-none focus:border-[#1E40AF] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {lines.map((line, index) => (
                  <div
                    key={`${line.product.slug}-${line.variant ?? ""}`}
                    className="group bg-white rounded-xl border border-[#0A0A0A]/10 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      <Link
                        to="/boutique/$slug"
                        params={{ slug: line.product.slug }}
                        className="w-20 h-28 sm:w-28 sm:h-36 bg-[#F5F8FC] rounded-lg overflow-hidden flex-shrink-0 group-hover:ring-2 ring-[#1E40AF]/20 transition-all"
                      >
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between gap-2 sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <Link
                              to="/boutique/$slug"
                              params={{ slug: line.product.slug }}
                              className="font-display text-base sm:text-lg font-medium hover:text-[#1E40AF] transition-colors block truncate text-[#0A0A0A]"
                            >
                              {line.product.name}
                            </Link>
                            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#0A0A0A]/60 mt-1 truncate">
                              {line.product.subtitle}
                              {line.variant ? ` · ${line.variant}` : ""}
                            </p>
                          </div>
                          <span className="font-price text-base sm:text-lg font-semibold flex-shrink-0 text-[#0A0A0A]">{formatPrice(line.lineTotal)}</span>
                        </div>
                        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6">
                          <div className="flex items-center bg-[#F5F8FC] rounded-lg">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.product.slug, line.variant, line.quantity - 1)
                              }
                              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#F5F8FC]/80 transition-colors rounded-l-lg text-[#0A0A0A]"
                              aria-label="Diminuer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-10 sm:w-12 text-center font-mono font-medium text-sm sm:text-base text-[#0A0A0A]">{line.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.product.slug, line.variant, line.quantity + 1)
                              }
                              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#F5F8FC]/80 transition-colors rounded-r-lg text-[#0A0A0A]"
                              aria-label="Augmenter"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(line.product.slug, line.variant)}
                            className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#0A0A0A]/60 hover:text-[#DC2626] transition-colors px-3 sm:px-4 py-2 rounded-lg hover:bg-[#DC2626]/5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-1 order-first lg:order-last">
              <div className="bg-white rounded-2xl border border-[#0A0A0A]/10 p-6 sm:p-8 shadow-lg lg:sticky lg:top-24">
                <h2 className="font-display text-xl sm:text-2xl mb-6 pb-4 border-b border-[#0A0A0A]/10 text-[#0A0A0A]">Récapitulatif</h2>
                <dl className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-[#0A0A0A]/60">Articles</dt>
                    <dd className="font-mono font-medium text-[#0A0A0A]">{count}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-[#0A0A0A]/60">Sous-total</dt>
                    <dd className="font-price font-medium text-[#0A0A0A]">{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between items-center py-4 border-t border-[#0A0A0A]/10">
                    <dt className="text-[#0A0A0A]/60">Livraison</dt>
                    <dd className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1E40AF] font-medium">
                      Calculée à la commande
                    </dd>
                  </div>
                </dl>
                <div className="flex justify-between items-center text-lg sm:text-xl font-display mt-6 pt-6 border-t border-[#0A0A0A]/10">
                  <span className="font-semibold text-[#0A0A0A]">Total</span>
                  <span className="font-price font-bold text-[#1E40AF]">{formatPrice(total)}</span>
                </div>
                <Link
                  to="/checkout"
                  search={{
                    name: customerInfo.name,
                    phone: customerInfo.phone,
                    email: customerInfo.email,
                    address: customerInfo.address,
                    city: customerInfo.city,
                  }}
                  className="block text-center w-full py-3 sm:py-4 mt-6 sm:mt-8 bg-[#1E40AF] text-white rounded-xl uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#1E40AF]/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Passer commande
                </Link>
                <Link
                  to="/boutique"
                  className="flex items-center justify-center gap-2 w-full py-3 mt-4 text-xs uppercase tracking-widest text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continuer mes achats
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
