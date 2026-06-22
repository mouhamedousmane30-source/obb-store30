import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Trash2, Check } from 'lucide-react';

const notificationsData = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-001 from Sarah Johnson for $89.99',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Silver Bomber Jacket stock is running low (87 units)',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'customer',
    title: 'New Customer Registration',
    message: 'New customer Lisa Anderson joined',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Failed',
    message: 'Payment failed for order #ORD-004',
    time: '3 hours ago',
    read: true,
  },
];

const typeColors = {
  order: 'border-l-blue-500 bg-blue-500/5',
  stock: 'border-l-red-500 bg-red-500/5',
  customer: 'border-l-emerald-500 bg-emerald-500/5',
  payment: 'border-l-yellow-500 bg-yellow-500/5',
};

function NotificationsPage() {
  return (
    <AdminLayout title="Notifications">
      <div className="max-w-2xl space-y-3">
        {notificationsData.map((notif) => (
          <div
            key={notif.id}
            className={`border-l-4 rounded-sm p-4 transition-all ${typeColors[notif.type as keyof typeof typeColors]} ${
              !notif.read ? 'bg-opacity-20' : 'bg-opacity-10'
            } hover:shadow-lg hover:shadow-gray-900/50`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">{notif.title}</h3>
                <p className="text-sm text-foreground/60 mb-2">{notif.message}</p>
                <p className="text-xs text-foreground/50">{notif.time}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!notif.read && (
                  <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                    <Check size={16} className="text-emerald-400" />
                  </button>
                )}
                <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/notifications')({
  head: () => ({ meta: [{ title: 'Notifications — OBB Store Admin' }] }),
  component: NotificationsPage,
});
