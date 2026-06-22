import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

const paymentsData = [
  {
    id: '1',
    transactionId: 'TXN-001',
    customer: 'Sarah Johnson',
    amount: '$89.99',
    method: 'Credit Card',
    status: 'completed' as const,
    date: '2024-01-15',
  },
  {
    id: '2',
    transactionId: 'TXN-002',
    customer: 'Mike Chen',
    amount: '$149.99',
    method: 'PayPal',
    status: 'completed' as const,
    date: '2024-01-14',
  },
  {
    id: '3',
    transactionId: 'TXN-003',
    customer: 'Emily Rodriguez',
    amount: '$129.99',
    method: 'Apple Pay',
    status: 'completed' as const,
    date: '2024-01-14',
  },
  {
    id: '4',
    transactionId: 'TXN-004',
    customer: 'James Wilson',
    amount: '$299.99',
    method: 'Stripe',
    status: 'completed' as const,
    date: '2024-01-13',
  },
];

function PaymentsPage() {
  return (
    <AdminLayout title="Payments & Transactions">
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search transactions..."
          className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20 flex-1"
        />
        <select className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground focus:outline-none focus:border-foreground/20">
          <option>All Methods</option>
          <option>Credit Card</option>
          <option>PayPal</option>
          <option>Apple Pay</option>
          <option>Stripe</option>
        </select>
      </div>

      <DataTable
        title="Recent Transactions"
        columns={[
          { key: 'transactionId', label: 'Transaction ID' },
          { key: 'customer', label: 'Customer' },
          { key: 'amount', label: 'Amount' },
          { key: 'method', label: 'Method' },
          {
            key: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
          },
          { key: 'date', label: 'Date' },
        ]}
        data={paymentsData}
      />
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/payments')({
  head: () => ({ meta: [{ title: 'Payments — OBB Store Admin' }] }),
  component: PaymentsPage,
});
