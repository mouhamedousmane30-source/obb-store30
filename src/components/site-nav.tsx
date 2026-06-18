import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-context";
import { STORE_NAME } from "@/lib/config";

const linkBase =
  "relative pb-1 text-[13px] uppercase tracking-widest font-medium text-foreground/70 hover:text-foreground transition-colors";
const linkActive =
  "data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:left-0 data-[status=active]:after:right-0 data-[status=active]:after:-bottom-0.5 data-[status=active]:after:h-px data-[status=active]:after:bg-accent";

export function SiteNav() {
  const { count } = useCart();
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-foreground/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
          {STORE_NAME.split(" ")[0]}
        </Link>
        <div className="hidden md:flex gap-8">
          <Link to="/" className={`${linkBase} ${linkActive}`} activeOptions={{ exact: true }}>
            Accueil
          </Link>
          <Link to="/boutique" className={`${linkBase} ${linkActive}`}>
            Boutique
          </Link>
          <Link to="/a-propos" className={`${linkBase} ${linkActive}`}>
            À propos
          </Link>
          <Link to="/contact" className={`${linkBase} ${linkActive}`}>
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/panier"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[11px] uppercase tracking-widest font-semibold hover:bg-foreground transition-colors"
          >
            Panier <span className="font-mono">({count})</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
