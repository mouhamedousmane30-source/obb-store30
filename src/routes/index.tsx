import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OBB Store — L'élégance redéfinie" },
      {
        name: "description",
        content:
          "Maison Haymet. Maillots, t-shirts, chaussures et parfums premium au Sénégal. Livraison rapide, commande WhatsApp.",
      },
      { property: "og:title", content: "OBB Store — L'élégance redéfinie" },
      {
        property: "og:description",
        content: "Maison Haymet. Boutique premium au Sénégal.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const popular = PRODUCTS.filter((p) => p.isPopular).slice(0, 6);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-primary">
        <img
          src={heroImg}
          alt="Collection OBB Store"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-6 animate-fade-up">
            Nouvelle Collection
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-primary-foreground mb-6 animate-fade-up [animation-delay:100ms]">
            L'Élégance
            <br />
            <i className="italic font-normal text-accent">Redéfinie.</i>
          </h1>
          <p className="text-primary-foreground/80 max-w-md mb-10 animate-fade-up [animation-delay:200ms]">
            Découvrez la sélection Maison Haymet. L'artisanat premium rencontre le style
            contemporain sénégalais.
          </p>
          <Link
            to="/boutique"
            className="px-10 py-4 bg-accent text-accent-foreground uppercase tracking-[0.2em] font-bold text-xs hover:bg-primary-foreground hover:text-primary transition-all duration-300 animate-fade-up [animation-delay:300ms]"
          >
            Découvrir la boutique
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-display">Catégories</h2>
          <span className="font-mono text-[10px] uppercase tracking-tighter text-muted">
            04 / Univers
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to="/boutique"
              search={{ cat: cat.slug }}
              className="group relative aspect-[3/4] overflow-hidden bg-stone-100"
            >
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="text-white uppercase font-bold tracking-widest text-sm">
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="py-12 border-t border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display mb-2">Nos Incontournables</h2>
              <p className="text-sm text-muted">Les pièces les plus convoitées de la Maison.</p>
            </div>
            <Link
              to="/boutique"
              className="text-[11px] uppercase tracking-widest font-semibold border-b border-accent pb-1 hover:text-accent transition-colors"
            >
              Voir toute la boutique →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {popular.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="py-24 mt-12 border-t border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-display">Nouveautés</h2>
            <span className="font-mono text-[10px] uppercase tracking-tighter text-muted">
              Saison en cours
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {newArrivals.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="my-24 px-6">
        <div className="max-w-7xl mx-auto bg-primary text-primary-foreground p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 blur-3xl" />
          <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold mb-6">
            Offre Exclusive
          </span>
          <h2 className="text-3xl md:text-5xl font-display mb-8 max-w-2xl">
            Inscrivez-vous et bénéficiez de 10% sur votre première commande.
          </h2>
          <form
            className="flex flex-col md:flex-row gap-4 w-full max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="votre@email.com"
              className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-primary-foreground placeholder:text-primary-foreground/40"
            />
            <button className="px-8 py-3 bg-accent text-accent-foreground uppercase text-[10px] font-bold tracking-widest hover:bg-primary-foreground transition-colors">
              S'inscrire
            </button>
          </form>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-display text-center mb-16">
            Pourquoi nous choisir ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
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
            ].map((item) => (
              <div key={item.n} className="text-center">
                <div className="size-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="font-bold font-mono">{item.n}</span>
                </div>
                <h3 className="font-display text-xl mb-4">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display text-center mb-16">
            Ils nous font confiance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            ].map((r) => (
              <figure key={r.name} className="border border-foreground/10 p-8 bg-card">
                <div className="text-accent font-mono text-2xl leading-none mb-4">"</div>
                <blockquote className="text-sm leading-relaxed text-foreground/80 mb-6">
                  {r.text}
                </blockquote>
                <figcaption className="text-[11px] uppercase tracking-widest text-muted">
                  {r.name} — {r.city}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
