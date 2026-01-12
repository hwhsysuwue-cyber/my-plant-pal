import { ReactNode } from 'react';
import { Header } from './Header';
import { Leaf } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-secondary/20">
        <div className="container px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-medium">PlantCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PlantCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
