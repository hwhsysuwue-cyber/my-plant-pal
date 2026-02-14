import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Leaf } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {user && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-background sticky top-0 z-40">
            {user && <SidebarTrigger />}
            {!user && (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
                  <Leaf className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold">PlantCare</span>
              </div>
            )}
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
