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
      <div className="min-h-screen flex w-full bg-background">
        {user && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
            {user && <SidebarTrigger />}
            {!user && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold tracking-tight">PlantCare</span>
              </div>
            )}
          </header>
          <main className="flex-1 gradient-mesh">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
