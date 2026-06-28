import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, Store, Mail, Phone, MapPin, CreditCard, Truck, Shield, Lock, Globe, Bell, Users } from 'lucide-react';
import { useState } from 'react';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Général', icon: <Store size={16} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={16} /> },
    { id: 'payment', label: 'Paiement', icon: <CreditCard size={16} /> },
    { id: 'shipping', label: 'Livraison', icon: <Truck size={16} /> },
    { id: 'security', label: 'Sécurité', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <AdminLayout title="Paramètres">
      <div className="flex gap-8">
        {/* Sidebar navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Store size={18} />
                  Informations boutique
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Nom de la boutique</label>
                    <input
                      type="text"
                      defaultValue="OBB STORE"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Description</label>
                    <textarea
                      rows={3}
                      defaultValue="Votre destination mode premium pour maillots, t-shirts, parfums et accessoires."
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Devise</label>
                    <select className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground focus:outline-none focus:border-foreground/15 transition-colors">
                      <option>FCFA (Franc CFA Ouest Africain)</option>
                      <option>EUR (Euro)</option>
                      <option>USD (Dollar US)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Globe size={18} />
                  Paramètres régionaux
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Pays</label>
                    <select className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground focus:outline-none focus:border-foreground/15 transition-colors">
                      <option>Sénégal</option>
                      <option>Côte d'Ivoire</option>
                      <option>Mali</option>
                      <option>France</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Fuseau horaire</label>
                    <select className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground focus:outline-none focus:border-foreground/15 transition-colors">
                      <option>GMT+0 (Dakar)</option>
                      <option>GMT+1 (Paris)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Mail size={18} />
                  Coordonnées
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Email administrateur</label>
                    <input
                      type="email"
                      defaultValue="admin@obbstore.com"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Email support client</label>
                    <input
                      type="email"
                      defaultValue="support@obbstore.com"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue="+221 77 123 45 67"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Adresse</label>
                    <textarea
                      rows={3}
                      defaultValue="Dakar, Sénégal"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard size={18} />
                  Méthodes de paiement
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'wave', name: 'Wave', enabled: true },
                    { id: 'orange', name: 'Orange Money', enabled: true },
                    { id: 'card', name: 'Carte bancaire', enabled: true },
                    { id: 'paypal', name: 'PayPal', enabled: false },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked={method.enabled} className="w-4 h-4 cursor-pointer" />
                        <span className="text-foreground font-medium">{method.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
                        Configurer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6">Taxes</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">TVA (%)</label>
                    <input
                      type="number"
                      defaultValue="18"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Truck size={18} />
                  Options de livraison
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'standard', name: 'Livraison standard', price: '2 000 FCFA', days: '3-5 jours' },
                    { id: 'express', name: 'Livraison express', price: '5 000 FCFA', days: '1-2 jours' },
                    { id: 'pickup', name: 'Retrait en magasin', price: 'Gratuit', days: 'Immédiat' },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{method.name}</p>
                        <p className="text-xs text-foreground/60">{method.days}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-foreground">{method.price}</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6">Zones de livraison</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">Dakar et environs</p>
                      <p className="text-xs text-foreground/60">Livraison standard disponible</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Actif</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">Autres régions du Sénégal</p>
                      <p className="text-xs text-foreground/60">Livraison express disponible</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Actif</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Lock size={18} />
                  Mot de passe
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Mot de passe actuel</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-muted/50 border border-foreground/8 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-foreground/15 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Shield size={18} />
                  Authentification à deux facteurs
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">2FA par SMS</p>
                      <p className="text-xs text-foreground/60">Recevez un code par SMS</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">2FA par Email</p>
                      <p className="text-xs text-foreground/60">Recevez un code par email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-foreground/8 p-6">
                <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Bell size={18} />
                  Préférences de notification
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'orders', name: 'Nouvelles commandes', description: 'Être notifié pour chaque nouvelle commande' },
                    { id: 'stock', name: 'Alertes de stock', description: 'Être notifié quand le stock est faible' },
                    { id: 'customers', name: 'Nouveaux clients', description: 'Être notifié quand un nouveau client s\'inscrit' },
                    { id: 'reviews', name: 'Nouveaux avis', description: 'Être notifié quand un nouvel avis est posté' },
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-foreground font-medium">{notification.name}</p>
                        <p className="text-xs text-foreground/60">{notification.description}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="pt-6">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-8 py-3 rounded-lg">
              <Save size={18} />
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/settings')({
  head: () => ({ meta: [{ title: 'Paramètres — OBB Store Admin' }] }),
  component: SettingsPage,
});
