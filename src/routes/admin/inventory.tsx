import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import KPICard from '@/components/admin/KPICard';
import DataTable from '@/components/admin/DataTable';
import { AlertCircle, Package, TrendingDown, Package2 } from 'lucide-react';

const inventoryData = [
  {
    id: '1',
    product: 'Black Oversized Hoodie',
    sku: 'OBB-HOOD-001',
    available: 245,
    reserved: 12,
    low: false,
  },
  {
    id: '2',
    product: 'Silver Bomber Jacket',
    sku: 'OBB-BOMB-001',
    available: 87,
    reserved: 8,
    low: true,
  },
  {
    id: '3',
    product: 'Premium White Tee',
    sku: 'OBB-TEE-001',
    available: 512,
    reserved: 25,
    low: false,
  },
  {
    id: '4',
    product: 'Street Wear Pants',
    sku: 'OBB-PANT-001',
    available: 2,
    reserved: 1,
    low: true,
  },
];

function InventoryPage() {
  return (
    <AdminLayout title="Inventory Management">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Stock"
          value="846"
          icon={<Package size={24} />}
          color="silver"
        />
        <KPICard
          title="Reserved Stock"
          value="46"
          icon={<Package2 size={24} />}
          color="blue"
        />
        <KPICard
          title="Low Stock Alerts"
          value="8"
          change={-12}
          icon={<TrendingDown size={24} />}
          color="red"
        />
        <KPICard
          title="Out of Stock"
          value="0"
          change={0}
          icon={<AlertCircle size={24} />}
          color="silver"
        />
      </div>

      <DataTable
        title="Inventory Status"
        columns={[
          { key: 'product', label: 'Product' },
          { key: 'sku', label: 'SKU' },
          { key: 'available', label: 'Available' },
          { key: 'reserved', label: 'Reserved' },
          {
            key: 'low',
            label: 'Status',
            render: (value) => (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                value
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {value ? 'Low Stock' : 'In Stock'}
              </span>
            ),
          },
        ]}
        data={inventoryData}
      />
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/inventory')({
  head: () => ({ meta: [{ title: 'Inventory — OBB Store Admin' }] }),
  component: InventoryPage,
});
