import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-context";
import { Logo } from "@/components/logo";
import { useState } from "react";

const linkBase =
  "relative pb-1 text-[13px] uppercase tracking-widest font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors";
const linkActive =
  "data-[status=active]:text-[#0A0A0A] data-[status=active]:after:absolute data-[status=active]:after:left-0 data-[status=active]:after:right-0 data-[status=active]:after:-bottom-0.5 data-[status=active]:after:h-px data-[status=active]:after:bg-[#1E40AF]";

export function SiteNav() {
  const { count } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F5F8FC]/95 backdrop-blur-xl border-b border-[#0A0A0A]/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
          <Logo variant="horizontal" size="sm" className="w-20 h-10 sm:w-32 sm:h-16 md:w-40 md:h-20" />
        </Link>
        <div className="hidden lg:flex gap-6 lg:gap-8">
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
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link
            to="/panier"
            className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1E40AF]/90 transition-all hover:shadow-lg hover:-translate-y-0.5 group"
            aria-label="Panier"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#0A0A0A] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#1E40AF] text-white rounded-xl hover:bg-[#1E40AF]/90 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            aria-label="Menu"
          >
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <span
                className={`absolute left-0 top-1.5 sm:top-2 w-5 sm:w-6 h-0.5 bg-white transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
                  isMobileMenuOpen ? "rotate-45 top-2.5 sm:top-3 w-4 sm:w-5" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 sm:top-3 w-5 sm:w-6 h-0.5 bg-white transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-3.5 sm:top-4 w-5 sm:w-6 h-0.5 bg-white transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
                  isMobileMenuOpen ? "-rotate-45 top-2.5 sm:top-3 w-4 sm:w-5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-[9999] bg-[#0A0A0A] shadow-2xl border-t border-[rgba(30,64,175,0.15)] backdrop-blur-xl transition-all duration-[350ms] ease-out">
          <nav className="flex flex-col p-6 gap-6">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-[20px] font-bold text-white hover:text-[#1E40AF] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[#1E40AF] after:transition-all after:duration-300 hover:after:w-full"
              activeOptions={{ exact: true }}
            >
              Accueil
            </Link>
            <Link
              to="/boutique"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-[20px] font-bold text-white hover:text-[#1E40AF] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[#1E40AF] after:transition-all after:duration-300 hover:after:w-full"
            >
              Boutique
            </Link>
            <Link
              to="/boutique"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-[20px] font-bold text-white hover:text-[#1E40AF] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[#1E40AF] after:transition-all after:duration-300 hover:after:w-full"
            >
              Nouveautés
            </Link>
            <Link
              to="/a-propos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-[20px] font-bold text-white hover:text-[#1E40AF] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[#1E40AF] after:transition-all after:duration-300 hover:after:w-full"
            >
              À Propos
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-[20px] font-bold text-white hover:text-[#1E40AF] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-[#1E40AF] after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
          </nav>
          <div className="px-6 pb-6">
            <p className="text-[#1E40AF] text-xs font-medium tracking-widest uppercase mb-4">
              Je ne fais que commencer.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-[#1E40AF] transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-[#1E40AF] transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-2.91-3.65-2.84-5.92.08-2.03 1.23-3.92 3.06-4.85 1.68-.87 3.7-.9 5.5-.15.01.01.02.01.03.02.01-2.52-.01-5.04.02-7.55 0-.01.01-.02.02-.03zm-3.12 9.67c-.01 1.63.63 3.25 1.93 4.25 1.33 1.05 3.18 1.15 4.65.3 1.48-.85 2.39-2.66 2.37-4.37-.02-1.62-.92-3.15-2.35-3.96-1.44-.82-3.26-.73-4.61.22-1.45 1.01-2.03 2.83-1.99 4.56z"/>
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-[#1E40AF] transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
