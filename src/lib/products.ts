import maillotsImg from "@/assets/shoptonmaillot.png";
import maillotsImgHover from "@/assets/shoptonmaillot2.png";
import tshirtsImg from "@/assets/cat-tshirts.jpg";
import chaussuresImg from "@/assets/cat-chaussures.jpg";
import parfumsImg from "@/assets/cat-parfums.jpg";
import maillotsenegal from "@/assets/maillotsenegal.png";
import shoes2 from "@/assets/shoes2.png";
import shoes1 from "@/assets/shoes1.png";
import weaintboyz2 from "@/assets/weaintboyz2.png";
import weainboyz1 from "@/assets/weainboyz1.png";

export type CategorySlug = "maillots" | "tshirts" | "chaussures" | "parfums";

export interface Category {
  slug: CategorySlug;
  label: string;
  image: string;
  hoverImage?: string;
}

export const CATEGORIES: Category[] = [
  { slug: "maillots", label: "Maillots", image: maillotsImg, hoverImage: maillotsImgHover },
  { slug: "tshirts", label: "T-shirts", image: weaintboyz2, hoverImage: weainboyz1 },
  { slug: "chaussures", label: "Chaussures", image: shoes2, hoverImage: shoes1 },
  { slug: "parfums", label: "Parfums", image: parfumsImg },
];

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: CategorySlug;
  image: string;
  gallery: string[];
  description: string;
  variants?: { label: string; options: string[] };
  isNew?: boolean;
  isPopular?: boolean;
  promoEndDate?: Date;
}

const SIZES_CLOTHING = { label: "Taille", options: ["S", "M", "L", "XL"] };

export const PRODUCTS: Product[] = [
  {
    slug: "maillot-senegal",
    name: "Maillot Sénégal",
    subtitle: "OBB STORE",
    price: 7000,
    originalPrice: 10000,
    category: "maillots",
    image: maillotsenegal,
    gallery: [maillotsenegal],
    description:
      "Maillot officiel du Sénégal par OBB STORE. Qualité premium, coupe ajustée, tissu respirant. Portez fièrement les couleurs nationales.",
    variants: SIZES_CLOTHING,
    isPopular: true,
    promoEndDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(product: Product, limit = 3) {
  return PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(
    0,
    limit,
  );
}
