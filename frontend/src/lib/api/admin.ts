import { api } from "./client";

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  pendingOrders: number;
  averageCart: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalRevenueFormatted: string;
  monthlyRevenueFormatted: string;
  averageCartFormatted: string;
}

export interface RecentOrder {
  id: string;
  _id: string;
  orderNumber: string;
  customer: string;
  email: string;
  product: string;
  amount: string;
  montantTotal: number;
  deliveryStatus: string;
  paymentStatus: string;
  date: string;
  time: string;
  createdAt: string;
}

export interface BestProduct {
  id: string;
  _id: string;
  name: string;
  category: string;
  sales: number;
  stock: number;
  revenue: string;
  revenueAmount: number;
}

export interface MonthlySale {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategorySale {
  name: string;
  sales: number;
  revenue: number;
  count: number;
}

export interface InventoryItem {
  id: string;
  _id: string;
  product: string;
  nom: string;
  sku: string;
  slug: string;
  category: string;
  available: number;
  stock: number;
  price: number;
  image: string;
  reserved: number;
}

export interface Notification {
  _id: string;
  type: 'order' | 'stock' | 'customer' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  lien: string;
  isRead: boolean;
  createdAt: string;
}

export const fetchDashboardStats = () =>
  api.get<{ success: boolean; stats: DashboardStats; recentUsers: unknown[]; recentOrders: unknown[]; bestProducts: unknown[] }>("/admin/stats");

export const fetchRecentOrders = (limit = 5) =>
  api.get<{ success: boolean; orders: RecentOrder[] }>("/admin/dashboard/recent-orders", { limit });

export const fetchBestProducts = (limit = 5) =>
  api.get<{ success: boolean; products: BestProduct[] }>("/admin/dashboard/best-products", { limit });

export const fetchMonthlySales = (year?: number) =>
  api.get<{ success: boolean; monthlySales: MonthlySale[] }>("/admin/dashboard/monthly-sales", { year });

export const fetchCategorySales = () =>
  api.get<{ success: boolean; categories: CategorySale[] }>("/admin/dashboard/category-sales");

export const fetchUsers = (params?: Record<string, string | number>) =>
  api.get<{ success: boolean; users: unknown[]; total?: number; pagination?: unknown }>("/users", params);

export const fetchInventory = () =>
  api.get<{ success: boolean; inventory: InventoryItem[] }>("/admin/inventory");

export const fetchNotifications = (params?: Record<string, string | number>) =>
  api.get<{ success: boolean; notifications: Notification[]; unreadCount?: number }>("/notifications", params);

export const markNotificationRead = (id: string) =>
  api.put<{ success: boolean; notification: Notification }>(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.put<{ success: boolean; message: string }>("/notifications/read-all");

export const deleteNotification = (id: string) =>
  api.delete<{ success: boolean; message: string }>(`/notifications/${id}`);

export const fetchSettings = () =>
  api.get<{ success: boolean; settings: Record<string, unknown>; settingsList: unknown[] }>("/settings");

export const updateSettings = (data: Record<string, unknown>) =>
  api.put<{ success: boolean; message: string; settingsList: unknown[] }>("/settings", data);

export const fetchAdminProducts = (params?: Record<string, string | number>) =>
  api.get<{ success: boolean; products: unknown[]; total?: number; pagination?: unknown }>("/admin/products", params);

export const fetchAdminProduct = (id: string) =>
  api.get<{ success: boolean; product: unknown }>(`/admin/products/${id}`);

export const createAdminProduct = (data: FormData | Record<string, unknown>) =>
  api.post<{ success: boolean; product: unknown }>('/products', data);

export const updateAdminProduct = (id: string, data: FormData | Record<string, unknown>) =>
  api.put<{ success: boolean; product: unknown }>(`/products/${id}`, data);

export const deleteAdminProduct = (id: string) =>
  api.delete<{ success: boolean; message: string }>(`/products/${id}`);

export const toggleProductStatus = (id: string) =>
  api.put<{ success: boolean; product: unknown }>(`/admin/products/${id}/toggle`);

export const importAdminProducts = async (products: Record<string, unknown>[]) => {
  const created = [];
  for (const product of products) {
    const res = await api.post<{ success: boolean; product: unknown }>('/products', product);
    created.push(res.product);
  }
  return created;
};

export const updateUser = (id: string, data: Record<string, unknown>) =>
  api.put<{ success: boolean; user: unknown }>(`/admin/users/${id}`, data);

export const fetchDashboardSummary = () =>
  api.get<{ success: boolean; stats: { pendingOrders: number; lowStockCount: number; unreadNotifications: number } }>("/admin/dashboard/summary");
