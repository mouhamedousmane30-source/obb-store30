import { Link } from "@tanstack/react-router";
import { CONTACT_CITY, CONTACT_EMAIL, STORE_NAME, STORE_TAGLINE } from "@/lib/config";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-white/90 pt-16 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 mt-16 sm:mt-24 border-t border-[rgba(212,160,23,0.15)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-20">
        <div className="md:col-span-2">
          <div className="mb-4 sm:mb-6">
            <Logo variant="vertical" size="lg" className="text-white" />
          </div>
          <p className="text-xs sm:text-sm text-white/60 max-w-xs leading-relaxed">
            {STORE_TAGLINE} — Redéfinir le luxe au Sénégal à travers une sélection pointue et un
            service irréprochable.
          </p>
          <p className="text-[10px] sm:text-xs text-white/40 mt-4 sm:mt-6">{CONTACT_CITY}</p>
        </div>
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1E40AF] mb-4 sm:mb-6">
            Exploration
          </h4>
          <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <li><Link to="/boutique" className="hover:text-[#1E40AF] transition-colors">Boutique</Link></li>
            <li><Link to="/boutique" search={{ cat: "maillots" }} className="hover:text-[#1E40AF] transition-colors">Maillots</Link></li>
            <li><Link to="/boutique" search={{ cat: "parfums" }} className="hover:text-[#1E40AF] transition-colors">Parfums</Link></li>
            <li><Link to="/a-propos" className="hover:text-[#1E40AF] transition-colors">À Propos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1E40AF] mb-4 sm:mb-6">Aide</h4>
          <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <li><Link to="/contact" className="hover:text-[#1E40AF] transition-colors">Contact</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#1E40AF] transition-colors">{CONTACT_EMAIL}</a></li>
            <li><Link to="/panier" className="hover:text-[#1E40AF] transition-colors">Mon panier</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-[10px] uppercase tracking-widest text-white/40">
        <span className="text-center md:text-left">© {new Date().getFullYear()} {STORE_NAME} — {STORE_TAGLINE}.</span>
        <div className="flex gap-4 sm:gap-8">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
