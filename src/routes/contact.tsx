import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CONTACT_CITY, CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — OBB Store" },
      {
        name: "description",
        content: "Contactez OBB Store par WhatsApp, e-mail ou directement depuis Dakar.",
      },
      { property: "og:title", content: "Contact — OBB Store" },
      { property: "og:description", content: "Nous joindre par WhatsApp ou e-mail." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
        <div>
          <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 sm:mb-4 block">
            Nous joindre
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display mb-4 sm:mb-6">
            Une question ?
            <br />
            <i className="italic text-accent">Parlons-en.</i>
          </h1>
          <p className="text-muted leading-relaxed text-sm sm:text-base">
            Notre équipe est disponible 7j/7 pour vous accompagner dans vos commandes, vos
            questions sur les produits ou la livraison.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <ContactItem label="WhatsApp">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg hover:text-accent transition-colors"
            >
              +{WHATSAPP_NUMBER}
            </a>
          </ContactItem>
          <ContactItem label="E-mail">
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-base sm:text-lg hover:text-accent transition-colors">
              {CONTACT_EMAIL}
            </a>
          </ContactItem>
          <ContactItem label="Adresse">
            <span className="text-base sm:text-lg">{CONTACT_CITY}</span>
          </ContactItem>
          <ContactItem label="Horaires">
            <span className="text-base sm:text-lg">Lundi — Samedi · 9h — 22h</span>
          </ContactItem>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-foreground/10 pt-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">{label}</p>
      {children}
    </div>
  );
}
