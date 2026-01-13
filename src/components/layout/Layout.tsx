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
      <footer className="border-t border-border/40 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo and tagline */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-xl gradient-forest flex items-center justify-center shadow-soft group-hover:shadow-colored transition-shadow duration-300">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-semibold">PlantCare</span>
              </Link>
              <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
                Your trusted companion for growing healthier, happier plants.
              </p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors link-underline">
                Browse Plants
              </Link>
              <Link to="/feedback" className="text-muted-foreground hover:text-foreground transition-colors link-underline">
                Feedback
              </Link>
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Made with <Heart className="h-3.5 w-3.5 text-terracotta fill-terracotta" /> for plant lovers
              </p>
              <p className="text-xs text-muted-foreground/70">
                © {new Date().getFullYear()} PlantCare. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}