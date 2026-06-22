import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CATEGORIES, PRODUCTS, type CategorySlug, type Product } from "@/lib/products";

const searchSchema = z.object({
  cat: z.enum(["maillots", "tshirts", "chaussures", "parfums"]).optional(),
});

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique — OBB Store" },
      {
        name: "description",
        content:
          "Découvrez la sélection OBB Store : maillots, t-shirts, chaussures et parfums premium.",
      },
      { property: "og:title", content: "Boutique — OBB Store" },
      { property: "og:description", content: "Maillots, t-shirts, chaussures et parfums." },
    ],
  }),
  validateSearch: searchSchema,
  component: BoutiqueLayout,
});

function BoutiqueLayout() {
  // If a child route matches (product detail), render its outlet.
  const match = Route.useMatch();
  const isLeaf = match.fullPath === "/boutique";
  if (!isLeaf) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <Outlet />
        <SiteFooter />
      </div>
    );
  }
  return <BoutiquePage />;
}

function BoutiquePage() {
  const { cat } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "newest">("popular");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = useMemo(() => {
    let list = PRODUCTS;
    if (cat) list = list.filter((p) => p.category === cat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort products
    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "popular":
      default:
        list = [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return list;
  }, [cat, query, priceRange, sortBy]);

  const setCat = (next: CategorySlug | undefined) => {
    navigate({ to: "/boutique", search: next ? { cat: next } : {} });
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#0A0A0A]">
      <SiteNav />

      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <span className="text-[#1E40AF] text-[9px] uppercase tracking-[0.3em] font-semibold mb-2 block">
          La boutique
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display mb-3">
          {cat ? CATEGORIES.find((c) => c.slug === cat)?.label : "Toute la sélection"}
        </h1>
        <p className="text-[#0A0A0A]/60 max-w-xl text-sm sm:text-base">
          Une sélection pointue, mise à jour chaque saison par OBB Store.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 sticky top-[60px] sm:top-[64px] z-30 bg-[#F5F8FC]/95 backdrop-blur-xl py-3 sm:py-4 border-y border-[#0A0A0A]/10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <CatTab active={!cat} onClick={() => setCat(undefined)}>Tout</CatTab>
            {CATEGORIES.map((c) => (
              <CatTab key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                {c.label}
              </CatTab>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="search"
                placeholder="Rechercher…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-64 border border-[#0A0A0A]/10 bg-white px-4 py-2 pl-10 text-sm focus:outline-none focus:border-[#1E40AF] transition-colors rounded-xl"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-[#0A0A0A]/10 bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#1E40AF] transition-colors rounded-xl flex-1 sm:flex-none"
            >
              <option value="popular">Populaires</option>
              <option value="newest">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="font-mono text-[10px] uppercase tracking-tighter text-[#0A0A0A]/60 mb-6 sm:mb-8">
          {String(products.length).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")} produits
        </div>
        {products.length === 0 ? (
          <div className="py-16 sm:py-32 text-center text-[#0A0A0A]/60">Aucun produit ne correspond.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} onOpenModal={setSelectedProduct} />
            ))}
          </div>
        )}
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

function CatTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
        active
          ? "bg-[#1E40AF] text-white shadow-lg hover:shadow-xl"
          : "bg-white text-[#0A0A0A]/60 hover:bg-white/80 hover:text-[#0A0A0A] hover:shadow-md"
      }`}
    >
      {children}
    </button>
  );
}
