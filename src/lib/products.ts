import maillotsImg from "@/assets/cat-maillots.jpg";
import tshirtsImg from "@/assets/cat-tshirts.jpg";
import chaussuresImg from "@/assets/cat-chaussures.jpg";
import parfumsImg from "@/assets/cat-parfums.jpg";
import tshirtNoir from "@/assets/p-tshirt-noir.jpg";
import sneakerBlanc from "@/assets/p-sneaker-blanc.jpg";
import maillotVert from "@/assets/p-maillot-vert.jpg";

export type CategorySlug = "maillots" | "tshirts" | "chaussures" | "parfums";

export interface Category {
  slug: CategorySlug;
  label: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { slug: "maillots", label: "Maillots", image: maillotsImg },
  { slug: "tshirts", label: "T-shirts", image: tshirtsImg },
  { slug: "chaussures", label: "Chaussures", image: chaussuresImg },
  { slug: "parfums", label: "Parfums", image: parfumsImg },
];

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  category: CategorySlug;
  image: string;
  gallery: string[];
  description: string;
  variants?: { label: string; options: string[] };
  isNew?: boolean;
  isPopular?: boolean;
}

const SIZES_CLOTHING = { label: "Taille", options: ["S", "M", "L", "XL"] };
const SIZES_SHOES = { label: "Pointure", options: ["40", "41", "42", "43", "44", "45"] };
const VOLUMES = { label: "Format", options: ["50ml", "100ml"] };

export const PRODUCTS: Product[] = [
  {
    slug: "maillot-or-2024",
    name: "Maillot d'Or 2024",
    subtitle: "Édition Limitée",
    price: 55000,
    category: "maillots",
    image: maillotVert,
    gallery: [maillotVert, maillotsImg],
    description:
      "Maillot en édition limitée tissé dans un polyester technique respirant. Broderie dorée à la main, finitions soignées et coupe ajustée pour un confort optimal sur et hors du terrain.",
    variants: SIZES_CLOTHING,
    isNew: true,
    isPopular: true,
  },
  {
    slug: "maillot-classique-vert",
    name: "Maillot Classique Vert",
    subtitle: "Collection Heritage",
    price: 42000,
    category: "maillots",
    image: maillotsImg,
    gallery: [maillotsImg, maillotVert],
    description:
      "Un classique réinterprété par Maison Haymet. Vert forêt profond, écusson brodé fil d'or, coupe contemporaine.",
    variants: SIZES_CLOTHING,
    isPopular: true,
  },
  {
    slug: "tshirt-signature-noir",
    name: "T-Shirt Signature Noir",
    subtitle: "Maison Haymet",
    price: 22000,
    category: "tshirts",
    image: tshirtNoir,
    gallery: [tshirtNoir, tshirtsImg],
    description:
      "Coton premium 240gr, coupe boxy, logo doré brodé discrètement sur la poitrine. Une pièce essentielle du vestiaire OBB.",
    variants: SIZES_CLOTHING,
    isPopular: true,
  },
  {
    slug: "tshirt-blanc-essentiel",
    name: "T-Shirt Blanc Essentiel",
    subtitle: "Coton Premium",
    price: 18000,
    category: "tshirts",
    image: tshirtsImg,
    gallery: [tshirtsImg, tshirtNoir],
    description:
      "L'essentiel blanc, revisité. Coton longues fibres, col renforcé, finitions surpiquées main.",
    variants: SIZES_CLOTHING,
    isNew: true,
  },
  {
    slug: "sneaker-heritage-blanc",
    name: "Sneaker Heritage Blanc",
    subtitle: "Cuir Véritable",
    price: 85000,
    category: "chaussures",
    image: sneakerBlanc,
    gallery: [sneakerBlanc, chaussuresImg],
    description:
      "Basket en cuir pleine fleur monté à la main, œillets dorés, semelle interne en cuir. Une silhouette intemporelle.",
    variants: SIZES_SHOES,
    isPopular: true,
  },
  {
    slug: "sneaker-heritage-noir",
    name: "Sneaker Heritage Noir",
    subtitle: "Édition Limitée",
    price: 95000,
    category: "chaussures",
    image: chaussuresImg,
    gallery: [chaussuresImg, sneakerBlanc],
    description:
      "Version noire de la Heritage, sur piédestal. Cuir mat, semelle vulcanisée, finitions cousues.",
    variants: SIZES_SHOES,
    isNew: true,
  },
  {
    slug: "essence-de-dakar-50ml",
    name: "Essence de Dakar",
    subtitle: "Eau de Parfum",
    price: 120000,
    category: "parfums",
    image: parfumsImg,
    gallery: [parfumsImg],
    description:
      "Un parfum oriental boisé : notes de tête bergamote et safran, cœur de rose et oud, fond de musc et ambre. Flacon ambré, bouchon doré.",
    variants: VOLUMES,
    isPopular: true,
  },
  {
    slug: "oud-royal",
    name: "Oud Royal",
    subtitle: "Fragrance Signature",
    price: 145000,
    category: "parfums",
    image: parfumsImg,
    gallery: [parfumsImg],
    description:
      "Oud brut de Madagascar, vanille de Tahiti, encens. Une signature olfactive intense et envoûtante.",
    variants: VOLUMES,
    isNew: true,
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
