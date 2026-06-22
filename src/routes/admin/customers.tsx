import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Ban, Download } from 'lucide-react';

const customersData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    orders: 12,
    spending: '$1,245.99',
    loyalty: 'Gold',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    phone: '+1 (555) 234-5678',
    orders: 8,
    spending: '$892.50',
    loyalty: 'Silver',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    phone: '+1 (555) 345-6789',
    orders: 5,
    spending: '$450.75',
    loyalty: 'Silver',
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james@example.com',
    phone: '+1 (555) 456-7890',
    orders: 15,
    spending: '$2,150.00',
    loyalty: 'Platinum',
  },
];

function CustomersPage() {
  return (
    <AdminLayout title="Customer Management">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search customers..."
            className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20"
          />
          <select className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground focus:outline-none focus:border-foreground/20">
            <option>All Loyalty Levels</option>
            <option>Platinum</option>
            <option>Gold</option>
            <option>Silver</option>
          </select>
        </div>
        <Button className="bg-white text-black hover:bg-gray-200 gap-2">
          <Download size={18} />
          Export Customers
        </Button>
      </div>

      <div className="bg-card rounded-sm border border-foreground/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/3">
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Spending</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Loyalty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-foreground/10 hover:bg-foreground/2 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-semibold">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{customer.spending}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      customer.loyalty === 'Platinum'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : customer.loyalty === 'Gold'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-gray-500/10 text-foreground/60 border border-gray-500/20'
                    }`}>
                      {customer.loyalty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Eye size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Edit size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Ban size={16} className="text-red-400" />
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

export const Route = createFileRoute('/admin/customers')({
  head: () => ({ meta: [{ title: 'Customers — OBB Store Admin' }] }),
  component: CustomersPage,
});
