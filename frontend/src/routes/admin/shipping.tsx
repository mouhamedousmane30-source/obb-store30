import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const shippingData = [
  {
    id: '1',
    method: 'Standard Shipping',
    carrier: 'USPS',
    cost: '$5.99',
    duration: '5-7 Business Days',
  },
  {
    id: '2',
    method: 'Express Shipping',
    carrier: 'FedEx',
    cost: '$12.99',
    duration: '2-3 Business Days',
  },
  {
    id: '3',
    method: 'Overnight Shipping',
    carrier: 'UPS',
    cost: '$24.99',
    duration: 'Next Business Day',
  },
];

function ShippingPage() {
  return (
    <AdminLayout title="Shipping Methods">
      <div className="mb-6">
        <Button className="bg-white text-black hover:bg-gray-200 gap-2">
          <Plus size={18} />
          Add Shipping Method
        </Button>
      </div>

      <DataTable
        title="Shipping Methods"
        columns={[
          { key: 'method', label: 'Method' },
          { key: 'carrier', label: 'Carrier' },
          { key: 'cost', label: 'Cost' },
          { key: 'duration', label: 'Duration' },
          {
            key: 'id',
            label: 'Actions',
            render: () => (
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                  <Edit size={16} className="text-foreground/60" />
                </button>
                <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ),
          },
        ]}
        data={shippingData}
      />
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/shipping')({
  head: () => ({ meta: [{ title: 'Shipping Methods — OBB Store Admin' }] }),
  component: ShippingPage,
});
