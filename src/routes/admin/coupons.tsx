import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';

const couponsData = [
  {
    id: '1',
    code: 'SUMMER20',
    type: '20% Off',
    discount: '$0 - $500+',
    uses: 1240,
    limit: 5000,
    status: 'completed' as const,
  },
  {
    id: '2',
    code: 'NEWUSER15',
    type: '15% Off',
    discount: '$0 - $300+',
    uses: 856,
    limit: 2000,
    status: 'completed' as const,
  },
  {
    id: '3',
    code: 'SHIP50',
    type: 'Free Shipping',
    discount: 'Orders $50+',
    uses: 432,
    limit: 10000,
    status: 'completed' as const,
  },
  {
    id: '4',
    code: 'VIPGOLD',
    type: '25% Off',
    discount: '$0 - $1000+',
    uses: 89,
    limit: 500,
    status: 'completed' as const,
  },
];

function CouponsPage() {
  return (
    <AdminLayout title="Coupons & Promotions">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search coupons..."
            className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20"
          />
          <select className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground focus:outline-none focus:border-foreground/20">
            <option>All Types</option>
            <option>Percentage</option>
            <option>Fixed</option>
            <option>Free Shipping</option>
          </select>
        </div>
        <Button className="bg-white text-black hover:bg-gray-200 gap-2">
          <Plus size={18} />
          Create Coupon
        </Button>
      </div>

      <div className="bg-card rounded-sm border border-foreground/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/3">
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Uses</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Limit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {couponsData.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-foreground/10 hover:bg-foreground/2 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-foreground">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{coupon.type}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{coupon.discount}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-semibold">{coupon.uses}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{coupon.limit}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status="completed">Active</StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Edit size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Copy size={16} className="text-foreground/60" />
                      </button>
                      <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                        <Trash2 size={16} className="text-red-400" />
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

export const Route = createFileRoute('/admin/coupons')({
  head: () => ({ meta: [{ title: 'Coupons — OBB Store Admin' }] }),
  component: CouponsPage,
});
