import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState } from 'react';

function SettingsPage() {
  const [storeName, setStoreName] = useState('OBB Store');
  const [email, setEmail] = useState('admin@obbstore.com');

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Store Information */}
        <div className="bg-card rounded-sm border border-foreground/10 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card rounded-sm border border-foreground/10 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {['Stripe', 'PayPal', 'Square'].map((method) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-foreground/80">{method}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="bg-card rounded-sm border border-foreground/10 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Shipping Methods</h3>
          <div className="space-y-3">
            {['Standard Shipping', 'Express Shipping', 'Overnight Shipping'].map((method) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-foreground/80">{method}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-card rounded-sm border border-foreground/10 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Email Templates</h3>
          <div className="space-y-3">
            {['Order Confirmation', 'Shipping Notification', 'Delivery Confirmation'].map((template) => (
              <div key={template} className="flex items-center justify-between">
                <span className="text-foreground/80">{template}</span>
                <Button className="bg-gray-800 text-foreground/80 hover:bg-gray-700">Edit</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-card rounded-sm border border-foreground/10 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Two-Factor Authentication</label>
              <div className="flex items-center justify-between">
                <span className="text-foreground/60 text-sm">Enable 2FA for admin accounts</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">IP Whitelist</label>
              <input
                type="text"
                placeholder="Enter IP addresses separated by commas"
                className="w-full px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-foreground/20"
              />
            </div>
          </div>
        </div>

        <Button className="w-full bg-white text-black hover:bg-gray-200 gap-2 py-3">
          <Save size={18} />
          Save Settings
        </Button>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/settings')({
  head: () => ({ meta: [{ title: 'Settings — OBB Store Admin' }] }),
  component: SettingsPage,
});
