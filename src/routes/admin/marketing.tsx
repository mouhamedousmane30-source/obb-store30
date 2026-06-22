import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Zap } from 'lucide-react';

function MarketingPage() {
  return (
    <AdminLayout title="Marketing & Campaigns">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Email Campaigns */}
        <div className="bg-card rounded-sm border border-foreground/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Mail size={20} />
              Email Campaigns
            </h3>
            <Button className="bg-white text-black hover:bg-gray-200">
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Summer Sale Announcement', sent: '12,543', opened: '4,230' },
              { name: 'New Collection Launch', sent: '10,832', opened: '3,891' },
              { name: 'Birthday Discount Offer', sent: '8,234', opened: '2,945' },
            ].map((campaign) => (
              <div key={campaign.name} className="p-3 bg-foreground/3 rounded-sm">
                <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                <div className="flex justify-between mt-2 text-xs text-foreground/60">
                  <span>Sent: {campaign.sent}</span>
                  <span>Opened: {campaign.opened}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotions */}
        <div className="bg-card rounded-sm border border-foreground/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Zap size={20} />
              Active Promotions
            </h3>
            <Button className="bg-white text-black hover:bg-gray-200">
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Summer Sale', discount: '20% OFF', status: 'Active' },
              { name: 'New Customer', discount: '15% OFF', status: 'Active' },
              { name: 'Free Shipping', discount: 'Orders $50+', status: 'Inactive' },
            ].map((promo) => (
              <div key={promo.name} className="p-3 bg-foreground/3 rounded-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{promo.name}</p>
                    <p className="text-xs text-foreground/60">{promo.discount}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    promo.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-gray-500/10 text-foreground/60'
                  }`}>
                    {promo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-card rounded-sm border border-foreground/10 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Social Media Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Instagram', 'Facebook', 'Twitter', 'TikTok'].map((platform) => (
            <div key={platform} className="p-4 bg-foreground/3 rounded-sm text-center">
              <p className="text-sm font-medium text-foreground mb-2">{platform}</p>
              <Button className="w-full bg-gray-800 text-foreground/80 hover:bg-gray-700 text-sm">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/marketing')({
  head: () => ({ meta: [{ title: 'Marketing — OBB Store Admin' }] }),
  component: MarketingPage,
});
