import { ReactNode } from 'react';
import { Header } from './Header';
import { SwipeablePageWrapper } from './SwipeablePageWrapper';
import { PageIndicator } from './PageIndicator';
import { Leaf, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  disableSwipeNav?: boolean;
}

const userRoutes = ['/', '/search', '/my-garden', '/reminders', '/feedback'];
const adminRoutes = ['/', '/search', '/admin', '/admin/users', '/admin/reminders', '/admin/feedback'];

export function Layout({ children, disableSwipeNav = false }: LayoutProps) {
  const { isAdmin, user } = useAuth();
  const routes = isAdmin ? adminRoutes : userRoutes;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 page-transition">
        {disableSwipeNav ? (
          children
        ) : (
          <SwipeablePageWrapper isAdmin={isAdmin}>
            {children}
          </SwipeablePageWrapper>
        )}
      </main>
      
      {/* Page indicator for swipe navigation */}
      {user && !disableSwipeNav && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-soft">
          <PageIndicator routes={routes} />
        </div>
      )}
      <footer className="border-t border-border bg-secondary/30">
        <div className="container px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">PlantCare</span>
            </Link>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Plants
              </Link>
              <Link to="/feedback" className="text-muted-foreground hover:text-foreground transition-colors">
                Feedback
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-end gap-1.5">
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
