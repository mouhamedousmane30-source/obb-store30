import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import { RevenueChart, OrdersChart, CategoryChart } from '@/components/admin/Charts';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
  Eye,
} from 'lucide-react';

// Données réalistes pour OBB STORE
const recentOrders = [
  {
    id: '1',
    orderNumber: '#CMD-2024-001',
    customer: 'Amadou Diallo',
    product: 'Maillot Sénégal Player 2026',
    amount: '7 000 FCFA',
    status: 'delivered' as const,
    date: '22/06/2024',
  },
  {
    id: '2',
    orderNumber: '#CMD-2024-002',
    customer: 'Fatou Ndiaye',
    product: 'T-shirt OBB Premium',
    amount: '22 000 FCFA',
    status: 'shipped' as const,
    date: '22/06/2024',
  },
  {
    id: '3',
    orderNumber: '#CMD-2024-003',
    customer: 'Moussa Sow',
    product: 'Parfum Royal Oud',
    amount: '120 000 FCFA',
    status: 'processing' as const,
    date: '21/06/2024',
  },
  {
    id: '4',
    orderNumber: '#CMD-2024-004',
    customer: 'Awa Diop',
    product: 'Sneakers Urban White',
    amount: '75 000 FCFA',
    status: 'pending' as const,
    date: '21/06/2024',
  },
  {
    id: '5',
    orderNumber: '#CMD-2024-005',
    customer: 'Ibrahima Fall',
    product: 'Casquette OBB Classic',
    amount: '15 000 FCFA',
    status: 'delivered' as const,
    date: '20/06/2024',
  },
];

const bestSellingProducts = [
  { id: '1', name: 'Maillot Sénégal Player 2026', category: 'Maillots', sales: 156, revenue: '1 092 000 FCFA', stock: 45 },
  { id: '2', name: 'T-shirt OBB Premium', category: 'T-shirts', sales: 124, revenue: '2 728 000 FCFA', stock: 78 },
  { id: '3', name: 'Parfum Royal Oud', category: 'Parfums', sales: 89, revenue: '10 680 000 FCFA', stock: 23 },
  { id: '4', name: 'Sneakers Urban White', category: 'Chaussures', sales: 78, revenue: '5 850 000 FCFA', stock: 34 },
  { id: '5', name: 'Casquette OBB Classic', category: 'Accessoires', sales: 67, revenue: '1 005 000 FCFA', stock: 56 },
];

function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      {/* KPI Cards - Première ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Chiffre d'affaires"
          value="22 450 000 FCFA"
          change={18.5}
          icon={<DollarSign size={20} />}
          variant="default"
        />
        <KPICard
          title="Commandes"
          value="1 568"
          change={12.3}
          icon={<ShoppingCart size={20} />}
          variant="default"
        />
        <KPICard
          title="Clients"
          value="892"
          change={24.7}
          icon={<Users size={20} />}
          variant="default"
        />
        <KPICard
          title="Produits"
          value="24"
          change={8.1}
          icon={<Package size={20} />}
          variant="default"
        />
      </div>

      {/* Graphiques - Deuxième ligne */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <RevenueChart title="Chiffre d'affaires" height={320} />
        <OrdersChart title="Commandes" height={320} />
      </div>

      {/* KPIs supplémentaires - Troisième ligne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Commandes en attente"
          value="23"
          change={-8.2}
          icon={<AlertCircle size={20} />}
          variant="default"
        />
        <KPICard
          title="Visiteurs"
          value="4 520"
          change={32.4}
          icon={<Eye size={20} />}
          variant="default"
        />
        <KPICard
          title="Croissance mensuelle"
          value="24.5%"
          change={5.8}
          icon={<TrendingUp size={20} />}
          variant="default"
        />
      </div>

      {/* Graphique catégories - Quatrième ligne */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <CategoryChart title="Ventes par catégorie" height={320} />
      </div>

      {/* Tables - Cinquième ligne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Dernières commandes"
          columns={[
            { key: 'orderNumber', label: 'Commande' },
            { key: 'customer', label: 'Client' },
            { key: 'product', label: 'Produit' },
            { key: 'amount', label: 'Montant' },
            {
              key: 'status',
              label: 'Statut',
              render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
            },
          ]}
          data={recentOrders}
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
          data={bestSellingProducts}
        />
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/')({
  head: () => ({ meta: [{ title: 'OBB Store — Dashboard Administrateur' }] }),
  component: AdminDashboard,
});
