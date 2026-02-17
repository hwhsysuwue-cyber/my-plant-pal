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
      <footer className="bg-primary text-primary-foreground">
        <div className="container px-4 sm:px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight font-display">PlantCare</span>
              </div>
              <p className="text-sm text-primary-foreground/60 leading-relaxed">
                Bringing nature closer to you — one plant at a time.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Explore', links: [{ label: 'All Plants', to: '/search' }, { label: 'Plant Care', to: '/search' }, { label: 'My Garden', to: '/my-garden' }] },
              { title: 'Company', links: [{ label: 'About Us', to: '/' }, { label: 'Contact', to: '/feedback' }, { label: 'Feedback', to: '/feedback' }] },
              { title: 'Support', links: [{ label: 'Help Center', to: '/' }, { label: 'Privacy Policy', to: '/' }, { label: 'Terms of Service', to: '/' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-primary-foreground/50">
              © {new Date().getFullYear()} PlantCare. All rights reserved.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'Facebook'].map((s) => (
                <span key={s} className="text-xs text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
