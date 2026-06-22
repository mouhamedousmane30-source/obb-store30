import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopNav from '@/components/admin/AdminTopNav';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-64 transition-all duration-500">
        <AdminTopNav title={title} />
        <main className="flex-1 overflow-auto bg-background">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
