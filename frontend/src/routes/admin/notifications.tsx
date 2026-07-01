import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, type Notification } from '@/lib/api/admin';
import { Trash2, Check, CheckCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const typeColors: Record<string, string> = {
  order: 'border-l-blue-500 bg-blue-500/5',
  stock: 'border-l-red-500 bg-red-500/5',
  customer: 'border-l-emerald-500 bg-emerald-500/5',
  payment: 'border-l-yellow-500 bg-yellow-500/5',
  review: 'border-l-purple-500 bg-purple-500/5',
  system: 'border-l-gray-500 bg-gray-500/5',
};

function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: () => fetchNotifications({ limit: 50 }),
    refetchInterval: 15000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      toast.success('Toutes les notifications marquées comme lues');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      toast.success('Notification supprimée');
    },
  });

  const notifications = (data?.notifications ?? []) as Notification[];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <AdminLayout title="Notifications">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-foreground/60">
          {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : 'Toutes les notifications sont lues'}
        </p>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <CheckCheck size={16} />
              Tout marquer comme lu
            </button>
          )}
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] })}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <RefreshCw size={18} className="text-foreground/60" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-foreground/60">Chargement des notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center text-foreground/60">Aucune notification pour le moment.</div>
      ) : (
        <div className="max-w-2xl space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`border-l-4 rounded-lg p-4 transition-all ${
                typeColors[notif.type] || 'border-l-gray-500 bg-gray-500/5'
              } ${!notif.isRead ? 'ring-1 ring-foreground/5' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{notif.title}</h3>
                  <p className="text-sm text-foreground/60 mb-2">{notif.message}</p>
                  <p className="text-xs text-foreground/50">
                    {new Date(notif.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!notif.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(notif._id)}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check size={16} className="text-emerald-500" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(notif._id)}
                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export const Route = createFileRoute('/admin/notifications')({
  head: () => ({ meta: [{ title: 'Notifications — OBB Store Admin' }] }),
  component: NotificationsPage,
});
