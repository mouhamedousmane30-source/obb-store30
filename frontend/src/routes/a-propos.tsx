import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import founderImg from "@/assets/me2.png";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — OBB Store" },
      {
        name: "description",
        content:
          "L'histoire de Mohamet Ousmane Diouf et la vision de OBB Store.",
      },
      { property: "og:title", content: "À propos — OBB Store" },
      {
        property: "og:description",
        content: "L'histoire et la vision de OBB Store par son fondateur Mohamet Ousmane Diouf.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Premium Founder Section */}
      <section className="relative w-full min-h-screen py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 50%, #0A0A0A 100%)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-12 sm:mb-16 animate-fade-up">
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold mb-4 sm:mb-6 block" style={{ color: '#1E40AF' }}>
              L'histoire
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display text-white mb-4">
              À PROPOS DU
              <br />
              <span className="italic font-normal" style={{ color: '#1E40AF' }}>FONDATEUR</span>
            </h1>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left: Founder Image */}
            <div className="relative animate-fade-up [animation-delay:200ms]">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={founderImg}
                  alt="Mohamet Ousmane Diouf - Fondateur OBB Store"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Quote Mark */}
              <div className="absolute -top-6 sm:-top-8 -left-6 sm:-left-8 text-6xl sm:text-8xl font-display opacity-20" style={{ color: '#1E40AF' }}>
                "
              </div>
            </div>

            {/* Right: Story and Mission */}
            <div className="space-y-6 sm:space-y-8 animate-fade-up [animation-delay:400ms]">
              <div className="space-y-4 sm:space-y-6 text-white/90 leading-relaxed text-sm sm:text-base lg:text-lg">
                <p>
                  Je m'appelle <span className="font-semibold text-white">Mohamet Ousmane Diouf</span>.
                </p>
                <p>
                  Comme beaucoup de jeunes, je suis parti avec une vision, des ambitions et la conviction qu'il était possible de créer quelque chose de grand, même en partant de peu. J'ai connu les doutes, les échecs et les remises en question. Mais j'ai refusé d'abandonner.
                </p>
                <p>
                  J'ai créé <span className="font-semibold" style={{ color: '#1E40AF' }}>OBB STORE</span> parce que je crois en une jeunesse qui ose rêver grand. Une jeunesse qui ne se contente pas d'attendre les opportunités, mais qui les crée.
                </p>
                <p>
                  Cette marque représente bien plus que des vêtements. Elle incarne la détermination, le travail, la confiance en soi et la volonté de laisser une empreinte.
                </p>
                <p>
                  À tous les jeunes qui ont un rêve : commencez maintenant. N'attendez pas le moment parfait. Croyez en votre vision et travaillez chaque jour pour elle.
                </p>
                <p className="font-semibold text-white">
                  OBB STORE est mon premier pas.
                </p>
                <p className="font-semibold text-white">
                  Le premier chapitre d'une aventure bien plus grande.
                </p>
                <p>
                  D'autres projets arrivent. D'autres idées attendent de voir le jour. D'autres objectifs restent à accomplir.
                </p>
                <p className="font-semibold text-white">
                  Je ne suis pas arrivé au sommet.
                </p>
                <p className="font-semibold text-white">
                  Je ne fais que commencer.
                </p>
                <p className="text-xl sm:text-2xl font-display italic" style={{ color: '#1E40AF' }}>
                  Maintenant, c'est mon heure.
                </p>
              </div>

              {/* Founder Signature */}
              <div className="pt-6 sm:pt-8 border-t border-white/10">
                <p className="font-display text-xl sm:text-2xl md:text-3xl text-white tracking-wide">
                  Mohamet Ousmane Diouf
                </p>
                <p className="text-xs sm:text-sm text-white/60 mt-2 uppercase tracking-widest">
                  Fondateur, OBB STORE
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-6 sm:pt-8">
                <Link
                  to="/boutique"
                  className="inline-block px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 text-white uppercase tracking-[0.2em] font-bold text-xs transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  style={{ backgroundColor: '#1E40AF' }}
                >
                  Découvrir la Collection
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </section>

      <SiteFooter />
    </div>
  );
}
