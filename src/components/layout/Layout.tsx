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
      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="container px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight font-display">PlantCare</span>
            </div>
            <p className="text-xs text-primary-foreground/60">
              © {new Date().getFullYear()} PlantCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
