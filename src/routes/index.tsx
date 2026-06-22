import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/section1.png";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/products";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OBB Store — L'élégance redéfinie" },
      {
        name: "description",
        content:
          "OBB Store. Maillots, t-shirts, chaussures et parfums premium au Sénégal. Livraison rapide, commande WhatsApp.",
      },
      { property: "og:title", content: "OBB Store — L'élégance redéfinie" },
      {
        property: "og:description",
        content: "OBB Store. Boutique premium au Sénégal.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const popular = PRODUCTS.filter((p) => p.isPopular).slice(0, 6);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scrolledCategories, setScrolledCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const categorySlug = entry.target.getAttribute('data-category');
          if (categorySlug) {
            if (entry.isIntersecting) {
              setScrolledCategories((prev) => new Set([...prev, categorySlug]));
              // Reset after 2 seconds
              setTimeout(() => {
                setScrolledCategories((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(categorySlug);
                  return newSet;
                });
              }, 2000);
            } else {
              // Reset when leaving viewport
              setScrolledCategories((prev) => {
                const newSet = new Set(prev);
                newSet.delete(categorySlug);
                return newSet;
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-category]').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative h-[75vh] sm:h-[90vh] w-full overflow-hidden bg-[#0A0A0A]">
        <img
          src={heroImg}
          alt="Collection OBB Store"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-60 animate-hero-float"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/30 to-[#0A0A0A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="animate-fade-up">
            <span className="inline-block px-4 sm:px-6 py-2.5 bg-[#1E40AF]/30 backdrop-blur-md rounded-full text-white text-[9px] uppercase tracking-[0.4em] font-semibold mb-6 sm:mb-8 border border-[#1E40AF]">
              YEKSIIL AK JAMM MY G!
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display text-white mb-5 sm:mb-6 animate-fade-up [animation-delay:100ms] leading-tight tracking-tight">
            NÉ POUR SE
            <br />
            <span className="italic font-normal text-[#1E40AF]">DÉMARQUER.</span>
          </h1>
          <p className="text-white/85 max-w-2xl mb-8 sm:mb-10 animate-fade-up [animation-delay:200ms] text-xs sm:text-sm md:text-base leading-relaxed font-light">
            Des essentiels streetwear conçus pour ceux qui refusent de suivre la foule.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up [animation-delay:300ms]">
            <Link
              to="/boutique"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#1E40AF] text-white uppercase tracking-[0.2em] font-bold text-[10px] sm:text-xs hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Découvrir la boutique
            </Link>
            <Link
              to="/a-propos"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white uppercase tracking-[0.2em] font-bold text-[10px] sm:text-xs hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 rounded-2xl backdrop-blur-sm"
            >
              Notre histoire
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <span className="text-[#1E40AF] text-[9px] uppercase tracking-[0.3em] font-semibold mb-2 block">
              Explorer
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display">Catégories</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-tighter text-[#0A0A0A]/60">
            04 / Univers
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.slug}
              to="/boutique"
              search={{ cat: cat.slug }}
              data-category={cat.slug}
              className="group relative aspect-[3/4] overflow-hidden bg-[#F5F8FC] rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-up border border-[#0A0A0A]/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full h-full">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${cat.hoverImage ? (scrolledCategories.has(cat.slug) ? 'opacity-0' : 'group-hover:opacity-0') : (scrolledCategories.has(cat.slug) ? 'scale-110' : 'group-hover:scale-110')}`}
                />
                {cat.hoverImage && (
                  <img
                    src={cat.hoverImage}
                    alt={`${cat.label} hover`}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${scrolledCategories.has(cat.slug) ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-end justify-between p-4 sm:p-6">
                <div className="bg-[#1E40AF]/40 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-[#1E40AF]/30">
                  <span className="text-white text-[10px] uppercase tracking-widest font-semibold">
                    {PRODUCTS.filter((p) => p.category === cat.slug).length} articles
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-white font-display text-base sm:text-lg font-bold tracking-wide block">
                    {cat.label}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 sm:mb-12 gap-6 sm:gap-8">
            <div>
              <span className="text-[#1E40AF] text-[9px] uppercase tracking-[0.3em] font-semibold mb-2 block">
                Sélection Maison
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mb-2">Nos Incontournables</h2>
              <p className="text-xs sm:text-sm text-[#0A0A0A]/60 max-w-md">Les pièces les plus convoitées de la Maison, sélectionnées avec soin.</p>
            </div>
            <Link
              to="/boutique"
              className="group flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold border-b border-[#1E40AF] pb-1 hover:text-[#1E40AF] transition-all duration-300 hover:gap-3"
            >
              Voir toute la boutique
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {popular.map((p, index) => (
              <ProductCard key={p.slug} product={p} onOpenModal={setSelectedProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-[#1E40AF] text-[9px] uppercase tracking-[0.3em] font-semibold mb-1.5 sm:mb-2 block">
                Fraîchement arrivés
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display mb-1">Nouveautés</h2>
              <span className="font-mono text-[9px] uppercase tracking-tighter text-[#0A0A0A]/60">
                Saison en cours
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.slug} product={p} onOpenModal={setSelectedProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-[#1E40AF] text-[9px] uppercase tracking-[0.3em] font-semibold mb-2 block">
              Nos engagements
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display">
              Pourquoi nous choisir ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {[
              {
                n: "01",
                title: "Qualité Supérieure",
                text: "Chaque pièce est sélectionnée rigoureusement pour répondre aux standards internationaux du luxe.",
              },
              {
                n: "02",
                title: "Livraison Express",
                text: "Service de livraison rapide partout au Sénégal, avec suivi en temps réel de votre commande.",
              },
              {
                n: "03",
                title: "Commande WhatsApp",
                text: "Une équipe dédiée 7j/7 pour vous conseiller et finaliser vos achats en un clic.",
              },
            ].map((item, index) => (
              <div key={item.n} className="text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1E40AF]/20 text-[#0A0A0A] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg border border-[#1E40AF]/30">
                  <span className="font-bold font-mono text-sm sm:text-base">{item.n}</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl mb-3 sm:mb-4">{item.title}</h3>
                <p className="text-[#0A0A0A]/60 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-[#1E40AF] text-[9px] uppercase tracking-[0.3em] font-semibold mb-2 block">
              Témoignages
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display">
              Ils nous font confiance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Awa D.",
                city: "Dakar",
                text: "Le maillot est d'une qualité exceptionnelle. Livraison en 24h, emballage soigné. Je recommande sans hésiter.",
              },
              {
                name: "Mamadou S.",
                city: "Thiès",
                text: "Mes sneakers Heritage sont sublimes. Le cuir est superbe et le service WhatsApp ultra réactif.",
              },
              {
                name: "Fatou N.",
                city: "Saint-Louis",
                text: "Le parfum Essence de Dakar est devenu ma signature. Sillage tenace, flacon magnifique.",
              },
            ].map((r, index) => (
              <figure key={r.name} className="border border-[#0A0A0A]/10 p-5 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-[#1E40AF] font-mono text-xl sm:text-2xl leading-none mb-3 sm:mb-4">"</div>
                <blockquote className="text-xs sm:text-sm leading-relaxed text-[#0A0A0A]/90 mb-4 sm:mb-6">
                  {r.text}
                </blockquote>
                <figcaption className="text-[11px] uppercase tracking-widest text-[#0A0A0A]/60">
                  {r.name} — {r.city}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
