import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return null;

  const navItems = [
    { label: 'Collection', path: '/search' },
    { label: 'Care Guides', path: '/search' },
    { label: 'About', path: '/' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Leaf className="h-4.5 w-4.5 text-primary" style={{ width: '18px', height: '18px' }} />
          <span className="text-[15px] font-bold tracking-[0.12em] uppercase text-foreground font-display">PlantCare</span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-[12px] tracking-[0.15em] text-foreground/55 hover:text-foreground transition-colors duration-200 font-medium uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign In */}
        <Button
          size="sm"
          className="rounded-none px-6 h-9 text-[11px] font-bold tracking-[0.18em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-none border-0"
          onClick={() => navigate('/auth')}
        >
          Sign In
        </Button>
      </div>
    </header>
  );
}
