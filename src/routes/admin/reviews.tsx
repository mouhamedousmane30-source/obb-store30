import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Star, Trash2, Check } from 'lucide-react';

const reviewsData = [
  {
    id: '1',
    product: 'Black Oversized Hoodie',
    customer: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing quality and perfect fit!',
    status: 'published' as const,
  },
  {
    id: '2',
    product: 'Silver Bomber Jacket',
    customer: 'Mike Chen',
    rating: 4,
    comment: 'Great jacket, shipping was fast',
    status: 'published' as const,
  },
  {
    id: '3',
    product: 'Premium White Tee',
    customer: 'Emily Rodriguez',
    rating: 5,
    comment: 'Exactly as described, very happy',
    status: 'pending' as const,
  },
];

function ReviewsPage() {
  return (
    <AdminLayout title="Customer Reviews">
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search reviews..."
          className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20 flex-1"
        />
        <select className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground focus:outline-none focus:border-foreground/20">
          <option>All Status</option>
          <option>Published</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="bg-card rounded-sm border border-foreground/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/3">
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Comment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewsData.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-foreground/10 hover:bg-foreground/2 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-foreground">{review.product}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{review.customer}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60 max-w-xs truncate">{review.comment}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      review.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {review.status === 'pending' && (
                        <button className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors">
                          <Check size={16} className="text-emerald-400" />
                        </button>
                      )}
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

export const Route = createFileRoute('/admin/reviews')({
  head: () => ({ meta: [{ title: 'Reviews — OBB Store Admin' }] }),
  component: ReviewsPage,
});
