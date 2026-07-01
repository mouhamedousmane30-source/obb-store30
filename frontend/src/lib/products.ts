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
  _id?: string;
  slug: string;
  nom: string;
  subtitle: string;
  prix: number;
  ancienPrix?: number;
  category: CategorySlug;
  imagePrincipale: string;
  gallery: string[];
  description: string;
  variants?: { label: string; options: string[] };
  isNewArrival?: boolean;
  isPopular?: boolean;
  promoEndDate?: Date;
  stock?: number;
  note?: number;
  nombreAvis?: number;
  sousCategorie?: string;
  marque?: string;
  reduction?: number;
  tailles?: string[];
  couleurs?: Array<{ nom: string; code: string; image: string }>;
  images?: string[];
  vendu?: number;
  tags?: string[];
  featured?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SIZES_CLOTHING = { label: "Taille", options: ["S", "M", "L", "XL"] };
const SIZES_SHOES = { label: "Pointure", options: ["40", "41", "42", "43", "44"] };
const VOLUMES_PARFUM = { label: "Volume", options: ["50ml", "100ml", "200ml"] };

export const PRODUCTS: Product[] = [
  {
    slug: "maillot-senegal",
    nom: "Maillot Sénégal Player 2026",
    subtitle: "Maillots",
    prix: 7000,
    ancienPrix: 10000,
    category: "maillots",
    imagePrincipale: maillotsenegal,
    gallery: [maillotsenegal],
    description:
      "Maillot officiel du Sénégal par OBB STORE. Qualité premium, coupe ajustée, tissu respirant. Portez fièrement les couleurs nationales.",
    variants: SIZES_CLOTHING,
    isPopular: true,
    promoEndDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    stock: 45,
    note: 4.5,
    nombreAvis: 124,
  },
  {
    slug: "tshirt-obb-premium",
    nom: "T-shirt OBB Premium",
    subtitle: "T-shirts",
    prix: 22000,
    category: "tshirts",
    imagePrincipale: weaintboyz2,
    gallery: [weaintboyz2, weainboyz1],
    description:
      "T-shirt premium en coton bio. Coupe moderne, confort absolu. Le must-have de votre garde-robe.",
    variants: SIZES_CLOTHING,
    isNewArrival: true,
    stock: 78,
    note: 4.8,
    nombreAvis: 89,
  },
  {
    slug: "parfum-royal-oud",
    nom: "Parfum Royal Oud",
    subtitle: "Parfums",
    prix: 120000,
    ancienPrix: 150000,
    category: "parfums",
    imagePrincipale: parfumsImg,
    gallery: [parfumsImg],
    description:
      "Parfum luxueux aux notes de oud, ambre et santal. Longue tenue, sillage envoûtant. L'essence de l'élégance.",
    variants: VOLUMES_PARFUM,
    isPopular: true,
    stock: 23,
    note: 4.9,
    nombreAvis: 156,
  },
  {
    slug: "sneakers-urban-white",
    nom: "Sneakers Urban White",
    subtitle: "Chaussures",
    prix: 75000,
    category: "chaussures",
    imagePrincipale: shoes2,
    gallery: [shoes2, shoes1],
    description:
      "Sneakers urbaines minimalistes. Design épuré, confort optimal. Parfait pour un style casual chic.",
    variants: SIZES_SHOES,
    isNewArrival: true,
    stock: 34,
    note: 4.6,
    nombreAvis: 67,
  },
  {
    slug: "maillot-psg-home",
    nom: "Maillot PSG Home 2024",
    subtitle: "Maillots",
    prix: 25000,
    category: "maillots",
    imagePrincipale: maillotsImg,
    gallery: [maillotsImg, maillotsImgHover],
    description:
      "Maillot domicile PSG 2024. Qualité officielle, design iconique. Pour les vrais supporters parisiens.",
    variants: SIZES_CLOTHING,
    stock: 12,
    note: 4.7,
    nombreAvis: 203,
  },
  {
    slug: "tshirt-essential",
    nom: "T-shirt Essential Black",
    subtitle: "T-shirts",
    prix: 15000,
    category: "tshirts",
    imagePrincipale: weaintboyz2,
    gallery: [weaintboyz2],
    description:
      "T-shirt essentiel noir. Basique mais indispensable. Coton premium, coupe ajustée.",
    variants: SIZES_CLOTHING,
    stock: 2,
    note: 4.3,
    nombreAvis: 45,
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
