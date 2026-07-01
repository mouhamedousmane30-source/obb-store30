import { api } from "./client";
import type { Product, CategorySlug } from "@/lib/products";

export interface ApiProduct extends Product {
  _id: string;
}

interface ProductsResponse {
  success: boolean;
  products: ApiProduct[];
  total?: number;
  pagination?: { page: number; limit: number; total: number; pages: number };
}

interface ProductResponse {
  success: boolean;
  product: ApiProduct;
}

export interface ProductFilters {
  cat?: CategorySlug;
  search?: string;
  sort?: "popular" | "newest" | "price-asc" | "price-desc";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  return api.get<ProductsResponse>("/products", {
    cat: filters.cat,
    search: filters.search,
    sort: filters.sort,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    page: filters.page,
    limit: filters.limit,
  });
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await api.get<ProductResponse>(`/products/${slug}`);
    return res.product;
  } catch {
    return null;
  }
}

export async function fetchPopularProducts(limit = 6) {
  const res = await api.get<ProductsResponse>("/products/popular/list", { limit });
  return res.products;
}

export async function fetchNewProducts(limit = 4) {
  const res = await api.get<ProductsResponse>("/products/new/list", { limit });
  return res.products;
}

export async function fetchSimilarProducts(slug: string, limit = 3) {
  const res = await api.get<ProductsResponse>(`/products/${slug}/similar`, { limit });
  return res.products;
}

export async function fetchAdminProducts(filters: ProductFilters = {}) {
  return api.get<ProductsResponse>("/products", { ...filters, format: "admin" });
}
