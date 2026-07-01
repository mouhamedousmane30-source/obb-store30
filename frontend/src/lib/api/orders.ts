import { api } from "./client";

export interface CreateOrderPayload {
  shippingAddress: {
    prenom: string;
    nom: string;
    telephone: string;
    email?: string;
    adresse: string;
    ville: string;
  };
  produits: Array<{
    productId: string;
    quantite: number;
    variant?: string;
    taille?: string;
  }>;
  paymentMethod?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  statut?: string;
  status?: string;
  montantTotal?: number;
  totalAmount?: number;
  total?: number;
  shippingAddress?: CreateOrderPayload["shippingAddress"];
  statusHistory?: Array<{ status: string; date: string; note?: string }>;
  createdAt?: string;
  updatedAt?: string;
  customer?: string;
  email?: string;
  product?: string;
  produits?: Array<{ nom: string; quantite: number; prix: number }>;
  paiement?: { statut: string; methode: string };
  utilisateur?: { prenom: string; nom: string; email: string };
}

export const createOrder = (payload: CreateOrderPayload) =>
  api.post<{ success: boolean; order: Order; message?: string }>("/orders", payload);

export const fetchOrderReceipt = (orderNumber: string, telephone?: string, email?: string) =>
  api.get<{ success: boolean; order: Order }>("/orders/receipt", {
    orderNumber,
    telephone,
    email,
  });

export const fetchOrders = (params?: Record<string, string | number>) =>
  api.get<{ success: boolean; orders: Order[]; pagination?: unknown }>("/orders", params);

export const fetchOrder = (id: string) =>
  api.get<{ success: boolean; order: Order }>(`/orders/${id}`);

export const updateOrder = (id: string, data: Record<string, unknown>) =>
  api.put<{ success: boolean; order: Order }>(`/orders/${id}`, data);
