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
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        <AdminTopNav title={title} />
        <main className="flex-1 overflow-auto bg-background">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
