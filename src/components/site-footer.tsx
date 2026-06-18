import { Link } from "@tanstack/react-router";
import { CONTACT_CITY, CONTACT_EMAIL, STORE_NAME, STORE_TAGLINE } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground/90 pt-24 pb-12 px-6 mt-24 border-t border-accent/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2">
          <span className="text-3xl font-display font-bold text-primary-foreground mb-6 block">
            {STORE_NAME.toUpperCase()}
          </span>
          <p className="text-sm text-primary-foreground/60 max-w-xs leading-relaxed">
            {STORE_TAGLINE} — Redéfinir le luxe au Sénégal à travers une sélection pointue et un
            service irréprochable.
          </p>
          <p className="text-xs text-primary-foreground/40 mt-6">{CONTACT_CITY}</p>
        </div>
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-6">
            Exploration
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/boutique" className="hover:text-accent transition-colors">Boutique</Link></li>
            <li><Link to="/boutique" search={{ cat: "maillots" }} className="hover:text-accent transition-colors">Maillots</Link></li>
            <li><Link to="/boutique" search={{ cat: "parfums" }} className="hover:text-accent transition-colors">Parfums</Link></li>
            <li><Link to="/a-propos" className="hover:text-accent transition-colors">À Propos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-6">Aide</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent transition-colors">{CONTACT_EMAIL}</a></li>
            <li><Link to="/panier" className="hover:text-accent transition-colors">Mon panier</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-primary-foreground/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-primary-foreground/40">
        <span>© {new Date().getFullYear()} {STORE_NAME} — {STORE_TAGLINE}.</span>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary-foreground">Instagram</a>
          <a href="#" className="hover:text-primary-foreground">TikTok</a>
          <a href="#" className="hover:text-primary-foreground">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
