import { ReactNode } from 'react';
import { Header } from './Header';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from './DashboardLayout';

interface LayoutProps {
  children: ReactNode;
  disableSwipeNav?: boolean;
}

export function Layout({ children, disableSwipeNav = false }: LayoutProps) {
  const { user } = useAuth();

  // Authenticated users get the sidebar dashboard layout
  if (user) {
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    );
  }

  // Public layout with top header
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="container px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-white"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1.5 2.5-.5 6c-1.2 2.1-2.8 3.5-4.5 4.5"/><path d="M11.7 20a7 7 0 0 0 3.5-12.2"/></svg>
              </div>
              <span className="text-sm font-medium">PlantCare</span>
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
