import { api } from "./client";

export interface ApiCategory {
  _id: string;
  slug: string;
  nom: string;
  label?: string;
  image: string;
  hoverImage?: string;
  productsCount?: number;
}

export async function fetchCategories() {
  const res = await api.get<{ success: boolean; categories: ApiCategory[] }>('/categories');
  return res.categories.map((category) => ({
    ...category,
    label: category.label || category.nom || category.slug,
  }));
}
