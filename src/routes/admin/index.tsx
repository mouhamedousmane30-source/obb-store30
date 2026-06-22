import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import { RevenueChart, OrdersChart } from '@/components/admin/Charts';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const recentOrders = [
  {
    id: '1',
    orderNumber: '#ORD-001',
    customer: 'Sarah Johnson',
    product: 'Black Oversized Hoodie',
    amount: '$89.99',
    status: 'delivered' as const,
    date: '2024-01-15',
  },
  {
    id: '2',
    orderNumber: '#ORD-002',
    customer: 'Mike Chen',
    product: 'Silver Bomber Jacket',
    amount: '$149.99',
    status: 'shipped' as const,
    date: '2024-01-14',
  },
  {
    id: '3',
    orderNumber: '#ORD-003',
    customer: 'Emily Rodriguez',
    product: 'Premium T-Shirt Bundle',
    amount: '$129.99',
    status: 'processing' as const,
    date: '2024-01-14',
  },
  {
    id: '4',
    orderNumber: '#ORD-004',
    customer: 'James Wilson',
    product: 'Street Wear Collection',
    amount: '$299.99',
    status: 'pending' as const,
    date: '2024-01-13',
  },
  {
    id: '5',
    orderNumber: '#ORD-005',
    customer: 'Lisa Anderson',
    product: 'Limited Edition Jacket',
    amount: '$249.99',
    status: 'delivered' as const,
    date: '2024-01-13',
  },
];

const bestSellingProducts = [
  { id: '1', name: 'Black Oversized Hoodie', sales: 1240, revenue: '$89,960' },
  { id: '2', name: 'Silver Bomber Jacket', sales: 890, revenue: '$133,510' },
  { id: '3', name: 'Premium White Tee', sales: 756, revenue: '$45,360' },
  { id: '4', name: 'Street Wear Pants', sales: 623, revenue: '$43,610' },
];

function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <KPICard
          title="Total Revenue"
          value="$125,430"
          change={12.5}
          icon={<DollarSign size={20} />}
          variant="default"
        />
        <KPICard
          title="Total Orders"
          value="2,847"
          change={8.2}
          icon={<ShoppingCart size={20} />}
          variant="default"
        />
        <KPICard
          title="Total Customers"
          value="1,523"
          change={15.3}
          icon={<Users size={20} />}
          variant="default"
        />
        <KPICard
          title="Products"
          value="487"
          change={-2.1}
          icon={<Package size={20} />}
          variant="default"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <RevenueChart title="Revenue Trend" height={300} />
        <OrdersChart title="Orders Trend" height={300} />
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <KPICard
          title="Pending Orders"
          value="23"
          change={-5.2}
          icon={<AlertCircle size={20} />}
          variant="default"
        />
        <KPICard
          title="Monthly Growth"
          value="24.5%"
          change={3.2}
          icon={<TrendingUp size={20} />}
          variant="default"
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DataTable
          title="Recent Orders"
          columns={[
            { key: 'orderNumber', label: 'Order' },
            { key: 'customer', label: 'Customer' },
            { key: 'amount', label: 'Amount' },
            {
              key: 'status',
              label: 'Status',
              render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
            },
          ]}
          data={recentOrders}
        />
        <DataTable
          title="Best Selling Products"
          columns={[
            { key: 'name', label: 'Product' },
            { key: 'sales', label: 'Sales' },
            { key: 'revenue', label: 'Revenue' },
          ]}
          data={bestSellingProducts}
        />
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/')({
  head: () => ({ meta: [{ title: 'OBB Store — Admin Dashboard' }] }),
  component: AdminDashboard,
});
