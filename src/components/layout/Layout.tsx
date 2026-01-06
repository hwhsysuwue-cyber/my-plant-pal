import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/50 bg-secondary/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 PlantCare Assistant. Nurture your green companions with love.</p>
        </div>
      </footer>
    </div>
  );
}
