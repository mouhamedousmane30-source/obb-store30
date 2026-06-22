import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { add } = useCart();
  const [isClicked, setIsClicked] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });

    add(product.slug, product.variants?.options[0]);

    setTimeout(() => setIsClicked(false), 600);
    setTimeout(() => setRipple(null), 600);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });
    setTimeout(() => setRipple(null), 600);
    onOpenModal(product);
  };

  return (
    <div className="group animate-fade-up">
      <div
        onClick={handleCardClick}
        className="relative block aspect-[3/4] overflow-hidden bg-[#F5F8FC] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 mb-3 sm:mb-4 w-full text-left cursor-pointer border border-[#0A0A0A]/10"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {product.isNew && (
          <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#1E40AF] text-white text-[8px] uppercase tracking-[0.1em] font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-md">
            Nouveau
          </span>
        )}
        {ripple && (
          <span
            className="absolute bg-[#1E40AF]/30 rounded-full animate-ping pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '120px',
              height: '120px',
              marginLeft: '-60px',
              marginTop: '-60px',
            }}
          />
        )}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`absolute bottom-0 w-full py-2 sm:py-3 bg-[#1E40AF] text-white text-[9px] uppercase tracking-[0.15em] font-bold opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-2 group-hover:translate-y-0 active:scale-95 overflow-hidden rounded-lg shadow-lg ${
            isClicked ? "scale-95 bg-[#0A0A0A]" : ""
          }`}
        >
          {isClicked ? "✓ Ajouté !" : "Ajouter au panier"}
        </button>
      </div>
      <div className="pt-3 sm:pt-4 text-center space-y-2 sm:space-y-3">
        {/* Merged Name and Price with Animation */}
        <div
          onClick={handleCardClick}
          className="relative group/merged cursor-pointer overflow-hidden rounded-lg p-3 sm:p-4 bg-gradient-to-br from-[#F5F8FC] to-white border border-[#0A0A0A]/10 hover:border-[#1E40AF]/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF]/5 to-transparent opacity-0 group-hover/merged:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div className="relative z-10">
            {/* Product Name */}
            <h3 className="font-mango text-xs sm:text-sm font-bold text-[#0A0A0A] leading-tight mb-1 sm:mb-2 group-hover/merged:text-[#1E40AF] transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>

            {/* Price Display */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="font-price text-lg sm:text-xl md:text-2xl font-bold text-[#0A0A0A] group-hover/merged:scale-110 transition-transform duration-300 origin-center">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono text-[10px] sm:text-xs text-[#0A0A0A]/40 line-through group-hover/merged:line-through-none transition-all duration-300">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Animated underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#1E40AF] w-0 group-hover/merged:w-full transition-all duration-500 ease-out" />
          </div>

          {/* Touch ripple effect */}
          {ripple && (
            <span
              className="absolute bg-[#1E40AF]/20 rounded-full animate-ping pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: '100px',
                height: '100px',
                marginLeft: '-50px',
                marginTop: '-50px',
              }}
            />
          )}
        </div>

        {/* Collection/Category - Subtle & Refined */}
        <p className="text-[9px] text-[#0A0A0A]/50 uppercase tracking-[0.15em] font-medium">
          {product.subtitle}
        </p>
      </div>
    </div>
  );
}
