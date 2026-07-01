import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { add } = useCart();
  const [isClicked, setIsClicked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    add(product.slug, product.variants?.options[0]);
    setTimeout(() => setIsClicked(false), 1500);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const discountPercentage = product.ancienPrix && product.ancienPrix > product.prix
    ? Math.round(((product.ancienPrix - product.prix) / product.ancienPrix) * 100)
    : 0;

  const getBadge = () => {
    if (product.isNewArrival) return { text: "Nouveau", emoji: "⭐", color: "bg-[#1E40AF]" };
    if (discountPercentage > 0) return { text: `-${discountPercentage}%`, emoji: "⚡", color: "bg-[#DC2626]" };
    if (product.isPopular) return { text: "Best Seller", emoji: "🔥", color: "bg-[#F59E0B]" };
    return null;
  };

  const badge = getBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <div
        onClick={() => onOpenModal(product)}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E40AF]/20 via-[#1E40AF]/10 to-[#F5F8FC] cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
        onPointerEnter={() => setShowQuickView(true)}
        onPointerLeave={() => setShowQuickView(false)}
        onPointerCancel={() => setShowQuickView(false)}
      >
        {/* Image with zoom effect */}
        <motion.img
          src={product.imagePrincipale}
          alt={product.nom}
          loading="lazy"
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E40AF]/80 via-[#1E40AF]/30 to-transparent opacity-60" />

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-3 py-1.5 shadow-lg"
          >
            <span className="text-white text-xs font-semibold tracking-wide">
              {badge.emoji} {badge.text}
            </span>
          </motion.div>
        )}

        {/* Favorite button */}
        <motion.button
          onClick={handleFavorite}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 w-10 h-10 backdrop-blur-md bg-white/20 border border-white/30 rounded-full flex items-center justify-center shadow-lg transition-colors hover:bg-white/30"
        >
          <Heart
            size={18}
            className={isFavorited ? "fill-red-500 text-red-500" : "text-white"}
          />
        </motion.button>

        {/* Quick add to cart button */}
        <AnimatePresence>
          {showQuickView && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
              disabled={isClicked}
              className={`absolute bottom-4 left-4 right-4 py-3.5 rounded-2xl font-semibold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 ${
                isClicked
                  ? "bg-green-500 text-white"
                  : "bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white"
              } transition-colors`}
            >
              {isClicked ? (
                <>
                  <Check size={18} />
                  Ajouté !
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Ajouter au panier
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Stock indicator */}
        {product.stock !== undefined && product.stock <= 3 && product.stock > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-4 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg"
          >
            Plus que {product.stock} disponibles
          </motion.div>
        )}
        {product.stock === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-4 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg"
          >
            Rupture
          </motion.div>
        )}
      </div>

      {/* Product info */}
      <div className="mt-4 space-y-2">
        {/* Category */}
        <p className="text-xs text-[#0A0A0A]/50 uppercase tracking-[0.15em] font-medium">
          {product.subtitle}
        </p>

        {/* Name */}
        <h3 className="font-display text-base font-semibold text-[#0A0A0A] leading-tight line-clamp-2 group-hover:text-[#1E40AF] transition-colors">
          {product.nom}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.note || 0) ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#0A0A0A]/20"}
              />
            ))}
          </div>
          <span className="text-xs text-[#0A0A0A]/50">({product.nombreAvis || 0} avis)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display text-3xl font-black text-[#1E40AF]">
            {formatPrice(product.prix)}
          </span>
          {product.ancienPrix && product.ancienPrix > product.prix && (
            <>
              <span className="text-sm text-[#0A0A0A]/40 line-through">
                {formatPrice(product.ancienPrix)}
              </span>
              <span className="text-xs font-semibold text-red-500">
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>

        {/* Variants */}
        {product.variants?.options && product.variants.options.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.variants.options.slice(0, 5).map((variant, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-[#0A0A0A]/10 border border-[#0A0A0A]/20 hover:border-[#1E40AF] transition-colors cursor-pointer"
                title={variant}
              />
            ))}
            {product.variants.options.length > 5 && (
              <span className="text-xs text-[#0A0A0A]/50">+{product.variants.options.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
