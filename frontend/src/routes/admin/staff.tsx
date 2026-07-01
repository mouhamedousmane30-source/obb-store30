import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Lock } from 'lucide-react';

const staffData = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@obbstore.com',
    role: 'Administrator',
    status: 'completed' as const,
  },
  {
    id: '2',
    name: 'John Manager',
    email: 'manager@obbstore.com',
    role: 'Manager',
    status: 'completed' as const,
  },
  {
    id: '3',
    name: 'Sarah Support',
    email: 'support@obbstore.com',
    role: 'Support',
    status: 'completed' as const,
  },
];

function StaffPage() {
  return (
    <AdminLayout title="Staff & Permissions">
      <div className="mb-6">
        <Button className="bg-white text-black hover:bg-gray-200 gap-2">
          <Plus size={18} />
          Add Staff
        </Button>
      </div>

      <DataTable
        title="Staff Members"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
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
                  <Lock size={16} className="text-foreground/60" />
                </button>
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
        data={staffData}
      />
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/staff')({
  head: () => ({ meta: [{ title: 'Staff & Permissions — OBB Store Admin' }] }),
  component: StaffPage,
});
