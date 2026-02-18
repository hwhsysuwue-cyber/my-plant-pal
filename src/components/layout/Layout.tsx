import { ReactNode } from 'react';
import { Header } from './Header';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from './DashboardLayout';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <footer className="bg-card border-t border-border text-foreground/50">
        <div className="container px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="text-base font-bold tracking-[0.15em] uppercase font-display text-foreground">PlantCare</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/35">
                Bringing nature closer to you — one plant at a time.
              </p>
            </div>
            {[
              { title: 'EXPLORE', links: [{ label: 'All Plants', to: '/search' }, { label: 'Care Guides', to: '/search' }, { label: 'My Garden', to: '/my-garden' }] },
              { title: 'COMPANY', links: [{ label: 'About Us', to: '/' }, { label: 'Contact', to: '/feedback' }, { label: 'Feedback', to: '/feedback' }] },
              { title: 'SUPPORT', links: [{ label: 'Help Center', to: '/' }, { label: 'Privacy Policy', to: '/' }, { label: 'Terms of Service', to: '/' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-bold tracking-[0.25em] text-foreground/30 mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-foreground/40 hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-foreground/25">© {new Date().getFullYear()} PlantCare. All rights reserved.</p>
            <div className="flex gap-6">
              {['Instagram', 'Twitter', 'Facebook'].map((s) => (
                <span key={s} className="text-xs text-foreground/25 hover:text-foreground cursor-pointer transition-colors tracking-wider">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
