import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { add } = useCart();
  const [variant, setVariant] = useState<string | undefined>(product.variants?.options[0]);
  const [activeImg, setActiveImg] = useState(0);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    add(product.slug, variant);
    onClose();
  };

  const handleBuyNow = () => {
    add(product.slug, variant);
    onClose();
    window.location.href = "/panier";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-[#F5F8FC] hover:bg-[#F5F8FC]/80 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-5 h-5 text-[#0A0A0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4">
            <div className="aspect-square bg-[#F5F8FC] overflow-hidden rounded-2xl">
              <img
                src={product.gallery?.[activeImg] || product.imagePrincipale}
                alt={product.nom}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            {product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden bg-[#F5F8FC] rounded-xl border-2 transition-all ${
                      i === activeImg ? "border-[#1E40AF] ring-2 ring-[#1E40AF]/20" : "border-transparent hover:border-[#0A0A0A]/10"
                    }`}
                  >
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#1E40AF] font-semibold mb-2">
                {product.subtitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-mango font-bold mb-3 text-[#0A0A0A]">{product.nom}</h2>
              <div className="flex items-center gap-3">
                <p className="font-price text-2xl font-bold text-[#1E40AF]">{formatPrice(product.prix)}</p>
                {product.ancienPrix && product.ancienPrix > product.prix && (
                  <>
                    <p className="font-mono text-sm text-[#0A0A0A]/40 line-through">{formatPrice(product.ancienPrix)}</p>
                    <span className="px-2 py-1 bg-[#DC2626]/10 text-[#DC2626] text-[10px] uppercase tracking-widest font-semibold rounded-full">
                      Promo
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-[#0A0A0A]/80 leading-relaxed text-sm">
              {product.description}
            </p>

            {product.variants && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#0A0A0A]/60 mb-3">
                  {product.variants.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setVariant(opt)}
                      className={`px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                        variant === opt
                          ? "border-[#1E40AF] bg-[#1E40AF] text-white shadow-md"
                          : "border-[#0A0A0A]/10 hover:border-[#0A0A0A]/20 hover:bg-[#F5F8FC]/80"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#1E40AF] text-white uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#1E40AF]/90 transition-all rounded-2xl shadow-md hover:shadow-lg"
              >
                Ajouter au panier
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-4 border-2 border-[#1E40AF] text-[#1E40AF] uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#1E40AF] hover:text-white transition-all rounded-2xl"
              >
                Acheter maintenant
              </button>
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[#0A0A0A]/60">
                <svg className="w-4 h-4 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Livraison rapide partout au Sénégal</span>
              </div>
              <div className="flex items-center gap-2 text-[#0A0A0A]/60">
                <svg className="w-4 h-4 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
