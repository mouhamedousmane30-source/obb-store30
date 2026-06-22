import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const categoriesData = [
  {
    id: '1',
    name: 'Hoodies',
    products: 45,
    image: 'https://via.placeholder.com/40',
    status: 'completed' as const,
  },
  {
    id: '2',
    name: 'Jackets',
    products: 32,
    image: 'https://via.placeholder.com/40',
    status: 'completed' as const,
  },
  {
    id: '3',
    name: 'T-Shirts',
    products: 78,
    image: 'https://via.placeholder.com/40',
    status: 'completed' as const,
  },
  {
    id: '4',
    name: 'Pants',
    products: 56,
    image: 'https://via.placeholder.com/40',
    status: 'completed' as const,
  },
];

function CategoriesPage() {
  return (
    <AdminLayout title="Product Categories">
      <div className="mb-6">
        <Button className="bg-white text-black hover:bg-gray-200 gap-2">
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      <DataTable
        title="Categories"
        columns={[
          { key: 'name', label: 'Category Name' },
          { key: 'products', label: 'Products' },
          {
            key: 'status',
            label: 'Status',
            render: (value) => <StatusBadge status={value}>Active</StatusBadge>,
          },
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
        data={categoriesData}
      />
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/categories')({
  head: () => ({ meta: [{ title: 'Categories — OBB Store Admin' }] }),
  component: CategoriesPage,
});
