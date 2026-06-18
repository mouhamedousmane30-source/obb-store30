import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS, type CategorySlug } from "@/lib/products";

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
    return list;
  }, [cat, query]);

  const setCat = (next: CategorySlug | undefined) => {
    navigate({ to: "/boutique", search: next ? { cat: next } : {} });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <header className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
          La boutique
        </span>
        <h1 className="text-4xl md:text-6xl font-display mb-4">
          {cat ? CATEGORIES.find((c) => c.slug === cat)?.label : "Toute la sélection"}
        </h1>
        <p className="text-muted max-w-xl">
          Une sélection pointue, mise à jour chaque saison par Maison Haymet.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 sticky top-[64px] z-30 bg-background/95 backdrop-blur-md py-4 border-y border-foreground/5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            <CatTab active={!cat} onClick={() => setCat(undefined)}>Tout</CatTab>
            {CATEGORIES.map((c) => (
              <CatTab key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                {c.label}
              </CatTab>
            ))}
          </div>
          <div className="md:ml-auto md:w-72">
            <input
              type="search"
              placeholder="Rechercher un produit…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-foreground/10 bg-background px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="font-mono text-[10px] uppercase tracking-tighter text-muted mb-8">
          {String(products.length).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")} produits
        </div>
        {products.length === 0 ? (
          <div className="py-32 text-center text-muted">Aucun produit ne correspond.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
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
      className={`whitespace-nowrap pb-1 border-b-2 text-sm tracking-wide transition-colors ${
        active
          ? "border-primary font-semibold text-foreground"
          : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
