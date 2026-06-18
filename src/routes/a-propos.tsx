import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — OBB Store" },
      {
        name: "description",
        content:
          "L'histoire de Maison Haymet : redéfinir le prêt-à-porter premium au Sénégal avec une sélection pointue.",
      },
      { property: "og:title", content: "À propos — OBB Store" },
      {
        property: "og:description",
        content: "L'histoire et la mission de Maison Haymet, derrière OBB Store.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-6 block">
          L'histoire
        </span>
        <h1 className="text-4xl md:text-6xl font-display mb-8">
          Maison Haymet : <i className="italic text-accent">un héritage</i> de raffinement.
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-3xl mx-auto">
          Née à Dakar de la passion pour les belles matières et l'élégance contemporaine, Maison
          Haymet sélectionne pour OBB Store les pièces qui composent un vestiaire tendance, durable
          et signé.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="aspect-[16/9] overflow-hidden bg-stone-100">
          <img src={heroImg} alt="Atelier OBB Store" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-12">
        {[
          {
            n: "01",
            t: "Notre mission",
            d: "Rendre accessible au Sénégal une sélection de pièces premium qui ne trouvent habituellement leur place que dans les capitales de la mode.",
          },
          {
            n: "02",
            t: "Nos valeurs",
            d: "Exigence sur la qualité, transparence sur les prix, service client humain. Trois engagements qui guident chaque décision.",
          },
          {
            n: "03",
            t: "Notre engagement",
            d: "Soutenir les talents locaux, proposer des éditions limitées sénégalaises et garantir une livraison rapide dans tout le pays.",
          },
        ].map((b) => (
          <div key={b.n} className="border-t border-foreground/10 pt-6">
            <span className="font-mono text-[11px] tracking-widest text-accent">{b.n}</span>
            <h3 className="font-display text-2xl mt-3 mb-4">{b.t}</h3>
            <p className="text-muted leading-relaxed">{b.d}</p>
          </div>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
