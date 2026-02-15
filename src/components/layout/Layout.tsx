import { ReactNode } from 'react';
import { Header } from './Header';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from './DashboardLayout';
import { Leaf } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  disableSwipeNav?: boolean;
}

export function Layout({ children, disableSwipeNav = false }: LayoutProps) {
  const { user } = useAuth();

  if (user) {
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border bg-card">
        <div className="container px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">PlantCare</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PlantCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
