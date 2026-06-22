import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import { RevenueChart, OrdersChart } from '@/components/admin/Charts';
import ChartCard from '@/components/admin/Charts';
import { TrendingUp, Users, ShoppingCart, Percent } from 'lucide-react';

function AnalyticsPage() {
  return (
    <AdminLayout title="Analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Revenue"
          value="$125,430"
          change={12.5}
          icon={<TrendingUp size={24} />}
          color="silver"
        />
        <KPICard
          title="Total Orders"
          value="2,847"
          change={8.2}
          icon={<ShoppingCart size={24} />}
          color="blue"
        />
        <KPICard
          title="Customer Growth"
          value="+156"
          change={15.3}
          icon={<Users size={24} />}
          color="green"
        />
        <KPICard
          title="Conversion Rate"
          value="3.24%"
          change={-2.1}
          icon={<Percent size={24} />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <RevenueChart title="Revenue Trend (Last 7 months)" height={400} />
        <OrdersChart title="Orders Trend" height={400} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard type="line" title="Customer Growth" dataKey="orders" height={300} />
        <ChartCard type="bar" title="Sales Performance" dataKey="revenue" height={300} />
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/analytics')({
  head: () => ({ meta: [{ title: 'Analytics — OBB Store Admin' }] }),
  component: AnalyticsPage,
});
