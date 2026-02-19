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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {user && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center gap-3 border-b border-border px-4 bg-card/90 backdrop-blur-xl sticky top-0 z-40">
            {user && <SidebarTrigger className="text-foreground/50 hover:text-foreground" />}
            {!user && (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold tracking-tight font-display">PlantCare</span>
              </div>
            )}
          </header>
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
