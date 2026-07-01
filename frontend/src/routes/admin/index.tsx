import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import { RevenueChart, OrdersChart, CategoryChart } from '@/components/admin/Charts';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  fetchDashboardStats,
  fetchRecentOrders,
  fetchBestProducts,
  fetchMonthlySales,
  fetchCategorySales,
  type DashboardStats,
  type RecentOrder,
  type BestProduct,
  type MonthlySale,
  type CategorySale,
} from '@/lib/api/admin';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  processing: 'En cours',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

function AdminDashboard() {
  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000,
  });
  const { data: ordersRes } = useQuery({
    queryKey: ['admin', 'recent-orders'],
    queryFn: () => fetchRecentOrders(5),
  });
  const { data: productsRes } = useQuery({
    queryKey: ['admin', 'best-products'],
    queryFn: () => fetchBestProducts(5),
  });
  const { data: monthlyRes } = useQuery({
    queryKey: ['admin', 'monthly-sales'],
    queryFn: () => fetchMonthlySales(),
  });
  const { data: categoryRes } = useQuery({
    queryKey: ['admin', 'category-sales'],
    queryFn: fetchCategorySales,
  });

  const stats = (statsRes?.stats ?? {}) as DashboardStats;
  const recentOrders = (ordersRes?.orders ?? []) as RecentOrder[];
  const bestProducts = (productsRes?.products ?? []) as BestProduct[];
  const monthlySales = (monthlyRes?.monthlySales ?? []) as MonthlySale[];
  const categorySales = (categoryRes?.categories ?? []) as CategorySale[];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Chiffre d'affaires"
          value={statsLoading ? '…' : (stats.totalRevenueFormatted ?? '0 FCFA')}
          icon={<DollarSign size={20} />}
          variant="default"
        />
        <KPICard
          title="Commandes"
          value={statsLoading ? '…' : String(stats.totalOrders ?? 0)}
          icon={<ShoppingCart size={20} />}
          variant="default"
        />
        <KPICard
          title="Clients"
          value={statsLoading ? '…' : String(stats.totalCustomers ?? 0)}
          icon={<Users size={20} />}
          variant="default"
        />
        <KPICard
          title="Produits"
          value={statsLoading ? '…' : String(stats.totalProducts ?? 0)}
          icon={<Package size={20} />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <RevenueChart title="Chiffre d'affaires" height={320} data={monthlySales} />
        <OrdersChart title="Commandes" height={320} data={monthlySales} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Commandes en attente"
          value={statsLoading ? '…' : String(stats.pendingOrders ?? 0)}
          icon={<AlertCircle size={20} />}
          variant="default"
        />
        <KPICard
          title="Panier moyen"
          value={statsLoading ? '…' : (stats.averageCartFormatted ?? '0 FCFA')}
          icon={<TrendingUp size={20} />}
          variant="default"
        />
        <KPICard
          title="Revenus du mois"
          value={statsLoading ? '…' : (stats.monthlyRevenueFormatted ?? '0 FCFA')}
          icon={<DollarSign size={20} />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <CategoryChart title="Ventes par catégorie" height={320} data={categorySales} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Dernières commandes"
          columns={[
            { key: 'orderNumber', label: 'Commande' },
            { key: 'customer', label: 'Client' },
            { key: 'product', label: 'Produit' },
            { key: 'amount', label: 'Montant' },
            {
              key: 'deliveryStatus',
              label: 'Statut',
              render: (value) => (
                <StatusBadge status={(value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}>
                  {STATUS_LABELS[value as string] ?? String(value)}
                </StatusBadge>
              ),
            },
          ]}
          data={recentOrders.map(o => ({ ...o, id: o._id || o.id }))}
        />
        <DataTable
          title="Produits les plus vendus"
          columns={[
            { key: 'name', label: 'Produit' },
            { key: 'category', label: 'Catégorie' },
            { key: 'sales', label: 'Ventes' },
            { key: 'stock', label: 'Stock' },
            { key: 'revenue', label: 'Revenu' },
          ]}
          data={bestProducts.map(p => ({ ...p, id: p._id || p.id }))}
        />
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/')({
  head: () => ({ meta: [{ title: 'OBB Store — Dashboard Administrateur' }] }),
  component: AdminDashboard,
});
