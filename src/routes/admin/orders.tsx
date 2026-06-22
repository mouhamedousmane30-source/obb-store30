import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Edit, Printer, RefreshCw, Trash2 } from 'lucide-react';

const ordersData = [
  {
    id: '1',
    orderNumber: '#ORD-001',
    customer: 'Sarah Johnson',
    product: 'Black Oversized Hoodie',
    amount: '$89.99',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'delivered' as const,
    date: '2024-01-15',
  },
  {
    id: '2',
    orderNumber: '#ORD-002',
    customer: 'Mike Chen',
    product: 'Silver Bomber Jacket',
    amount: '$149.99',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'shipped' as const,
    date: '2024-01-14',
  },
  {
    id: '3',
    orderNumber: '#ORD-003',
    customer: 'Emily Rodriguez',
    product: 'Premium T-Shirt Bundle',
    amount: '$129.99',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'processing' as const,
    date: '2024-01-14',
  },
  {
    id: '4',
    orderNumber: '#ORD-004',
    customer: 'James Wilson',
    product: 'Street Wear Collection',
    amount: '$299.99',
    paymentStatus: 'completed' as const,
    deliveryStatus: 'pending' as const,
    date: '2024-01-13',
  },
];

function OrdersPage() {
  return (
    <AdminLayout title="Orders Management">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search orders..."
            className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20"
          />
          <select className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground focus:outline-none focus:border-foreground/20">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
        <Button className="bg-white text-black hover:bg-gray-200">
          Export Orders
        </Button>
      </div>

      <div className="bg-card rounded-sm border border-foreground/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/3">
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-foreground/10 hover:bg-foreground/2 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={order.paymentStatus}>{order.paymentStatus}</StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={order.deliveryStatus}>{order.deliveryStatus}</StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{order.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Eye size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Edit size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Printer size={16} className="text-foreground/60" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/orders')({
  head: () => ({ meta: [{ title: 'Orders — OBB Store Admin' }] }),
  component: OrdersPage,
});
