import { ReactNode } from 'react';
import { Header } from './Header';
import { Leaf, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 page-transition">{children}</main>
      <footer className="border-t border-border bg-secondary/30">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">PlantCare</span>
            </Link>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Plants
              </Link>
              <Link to="/feedback" className="text-muted-foreground hover:text-foreground transition-colors">
                Feedback
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                Made with <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" /> for plant lovers
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                © {new Date().getFullYear()} PlantCare
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
